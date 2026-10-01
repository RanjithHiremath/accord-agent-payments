import { readFileSync } from 'node:fs';
import solc from 'solc';
import { Contract, TypedDataEncoder, verifyTypedData, getAddress, keccak256, toUtf8Bytes, ZeroAddress } from 'ethers';

const UINT256_MAX = (1n << 256n) - 1n;
const walletPaymentQueues = new Map();
let compiledContract;

export const quoteTypes = Object.freeze({ Quote: Object.freeze([
  { name: 'buyer', type: 'address' }, { name: 'seller', type: 'address' },
  { name: 'amount', type: 'uint256' }, { name: 'requestHash', type: 'bytes32' },
  { name: 'resultHash', type: 'bytes32' }, { name: 'nonce', type: 'bytes32' },
  { name: 'expiry', type: 'uint256' },
].map(field => Object.freeze(field))) });

export function compileContract() {
  if (compiledContract) return compiledContract;
  const compilerInput = { language: 'Solidity', sources: { 'AccordPayments.sol': { content: readFileSync(new URL('../contracts/AccordPayments.sol', import.meta.url), 'utf8') } }, settings: { evmVersion: 'shanghai', optimizer: { enabled: true, runs: 200 }, outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } } };
  const compilerOutput = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
  const compilationFailures = compilerOutput.errors?.filter(diagnostic => diagnostic.severity === 'error') ?? [];
  if (compilationFailures.length) throw new Error(compilationFailures.map(diagnostic => diagnostic.formattedMessage).join('\n'));
  const paymentContractArtifact = compilerOutput.contracts['AccordPayments.sol'].AccordPayments;
  compiledContract = { abi: paymentContractArtifact.abi, bytecode: `0x${paymentContractArtifact.evm.bytecode.object}` };
  return compiledContract;
}

function unsignedDecimal(value, fieldName) {
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]*)$/.test(value) || value.length > 78 || BigInt(value) > UINT256_MAX) throw new Error(`${fieldName} must be a canonical uint256 decimal string`);
  return BigInt(value);
}
function canonicalAddress(value, fieldName) {
  try { return getAddress(value); } catch { throw new Error(`${fieldName} must be a valid Ethereum address`); }
}
function sameAddress(actual, expected, fieldName) {
  if (canonicalAddress(actual, fieldName) !== canonicalAddress(expected, fieldName)) throw new Error(`${fieldName} mismatch`);
}
export function domain(chainId, contractAddress) {
  return { name: 'Accord', version: '0.1', chainId, verifyingContract: contractAddress };
}
export function quoteId(quote, chainId, contractAddress) {
  return TypedDataEncoder.hash(domain(chainId, contractAddress), quoteTypes, quote);
}
export function profile(values) {
  if (!Array.isArray(values) || values.length < 1 || values.length > 100 || Array.from(values).some(value => !Number.isSafeInteger(value) || value < 0 || value > 1_000_000 || Object.is(value, -0))) throw new Error('Dataset must contain 1–100 integers from 0 to 1,000,000');
  return { count: values.length, sum: values.reduce((sum, value) => sum + value, 0), min: Math.min(...values), max: Math.max(...values) };
}
export function hashRequest(values) {
  profile(values);
  return keccak256(toUtf8Bytes(JSON.stringify({ service: 'dataset.profile.v1', values })));
}
export function hashResult(result) {
  return keccak256(toUtf8Bytes(JSON.stringify({ count: result.count, sum: result.sum, min: result.min, max: result.max })));
}
function verifyOffer(offer, expected, allowExpired = false) {
  if (!offer || offer.protocol !== 'accord/0.1' || offer.service !== 'dataset.profile.v1') throw new Error('Unsupported protocol or service');
  unsignedDecimal(offer.chainId, 'chainId');
  if (offer.chainId !== String(expected.chainId)) throw new Error('Network mismatch');
  sameAddress(offer.contractAddress, expected.contractAddress, 'Payment contract');
  const quote = offer.quote;
  if (!quote || typeof quote !== 'object') throw new Error('Missing signed quote');
  sameAddress(quote.buyer, expected.buyer, 'Buyer');
  sameAddress(quote.seller, expected.seller, 'Seller');
  if (canonicalAddress(quote.seller, 'Seller') === ZeroAddress) throw new Error('Invalid seller');
  const amountWei = unsignedDecimal(quote.amount, 'amount');
  if (amountWei === 0n || amountWei > unsignedDecimal(expected.maxPaymentWei, 'maxPaymentWei')) throw new Error('Payment budget exceeded');
  const expirySeconds = unsignedDecimal(quote.expiry, 'expiry');
  const nowSeconds = BigInt(expected.nowSeconds);
  if (nowSeconds < 0n || (!allowExpired && expirySeconds < nowSeconds)) throw new Error('Quote expired');
  for (const hashField of ['requestHash', 'resultHash', 'nonce']) {
    if (typeof quote[hashField] !== 'string' || !/^0x[0-9a-fA-F]{64}$/.test(quote[hashField])) throw new Error(`Invalid ${hashField}`);
  }
  const expectedRequestHash = hashRequest(expected.values);
  if (hashRequest(offer.request?.values) !== expectedRequestHash || quote.requestHash.toLowerCase() !== expectedRequestHash) throw new Error('Request binding mismatch');
  if (quote.resultHash.toLowerCase() !== hashResult(profile(expected.values))) throw new Error('Result commitment mismatch');
  if (typeof offer.signature !== 'string' || !/^0x[0-9a-fA-F]{130}$/.test(offer.signature)) throw new Error('Invalid seller signature encoding');
  let recoveredSeller;
  try { recoveredSeller = verifyTypedData(domain(offer.chainId, offer.contractAddress), quoteTypes, quote, offer.signature); } catch { throw new Error('Invalid seller signature'); }
  sameAddress(recoveredSeller, expected.seller, 'Seller signature');
  return quoteId(quote, offer.chainId, offer.contractAddress);
}
export function validateOffer(offer, expected) { return verifyOffer(offer, expected); }

async function recoverPayment(paymentContract, provider, quoteIdentifier, amountWei) {
  const paymentEvents = await paymentContract.queryFilter(paymentContract.filters.Paid(quoteIdentifier), 0, 'latest');
  if (paymentEvents.length !== 1) throw new Error('Payment state exists but unique receipt is unavailable');
  const paymentEvent = paymentEvents[0];
  const transactionReceipt = await provider.getTransactionReceipt(paymentEvent.transactionHash);
  if (!transactionReceipt || transactionReceipt.status !== 1) throw new Error('Payment receipt is not successful');
  return { quoteId: quoteIdentifier, transactionHash: paymentEvent.transactionHash, blockNumber: transactionReceipt.blockNumber, amountWei, gasCostWei: transactionReceipt.fee.toString(), reused: true };
}

export async function payOffer(offer, { wallet, provider, expected, maxGasWei, maxTotalWei }) {
  // Snapshot caller-controlled input before awaiting, preventing mutation during signing.
  const offerSnapshot = structuredClone(offer);
  const expectedSnapshot = structuredClone(expected);
  const maximumGasWei = unsignedDecimal(maxGasWei, 'maxGasWei');
  const maximumTotalWei = unsignedDecimal(maxTotalWei, 'maxTotalWei');
  if (wallet.provider !== provider) throw new Error('Wallet and verification must use the same provider instance');
  const walletAddress = await wallet.getAddress();
  const queueKey = walletAddress.toLowerCase();
  const priorPayment = walletPaymentQueues.get(queueKey) ?? Promise.resolve();
  const currentPayment = priorPayment.catch(() => {}).then(async () => {
    const network = await provider.getNetwork();
    if (network.chainId !== 31337n || String(expectedSnapshot.chainId) !== '31337') throw new Error('Prototype payment is restricted to local chain 31337');
    sameAddress(walletAddress, expectedSnapshot.buyer, 'Wallet buyer');
    if (!wallet.provider || (await wallet.provider.getNetwork()).chainId !== network.chainId) throw new Error('Wallet provider network mismatch');
    // Explicit block/nonce requests avoid provider response caches during rapid purchases.
    const latestBlockNumber = Number(BigInt(await provider.send('eth_blockNumber', [])));
    const latestBlock = await provider.getBlock(latestBlockNumber);
    expectedSnapshot.nowSeconds = Math.max(Number(expectedSnapshot.nowSeconds), latestBlock.timestamp, Math.floor(Date.now() / 1000));
    const quoteIdentifier = verifyOffer(offerSnapshot, expectedSnapshot, true);
    const paymentContract = new Contract(expectedSnapshot.contractAddress, compileContract().abi, wallet);
    if (await paymentContract.paid(quoteIdentifier, { blockTag: latestBlockNumber })) return recoverPayment(paymentContract, provider, quoteIdentifier, offerSnapshot.quote.amount);
    verifyOffer(offerSnapshot, expectedSnapshot);
    const estimatedGasUnits = await paymentContract.pay.estimateGas(offerSnapshot.quote, offerSnapshot.signature, { value: offerSnapshot.quote.amount });
    const gasLimitUnits = (estimatedGasUnits * 120n + 99n) / 100n;
    const feeData = await provider.getFeeData();
    const gasPriceWei = feeData.maxFeePerGas ?? feeData.gasPrice;
    if (gasPriceWei === null) throw new Error('Network fee estimate unavailable');
    const maximumTransactionFeeWei = gasLimitUnits * gasPriceWei;
    if (maximumTransactionFeeWei > maximumGasWei) throw new Error('Gas budget exceeded');
    if (BigInt(offerSnapshot.quote.amount) + maximumTransactionFeeWei > maximumTotalWei) throw new Error('Total purchase budget exceeded');
    const feeOverrides = feeData.maxFeePerGas !== null ? { maxFeePerGas: gasPriceWei, maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? 0n } : { gasPrice: gasPriceWei };
    const pendingNonce = Number(BigInt(await provider.send('eth_getTransactionCount', [walletAddress, 'pending'])));
    const paymentTransaction = await paymentContract.pay(offerSnapshot.quote, offerSnapshot.signature, { value: offerSnapshot.quote.amount, gasLimit: gasLimitUnits, nonce: pendingNonce, ...feeOverrides });
    const transactionReceipt = await paymentTransaction.wait(1);
    if (!transactionReceipt || transactionReceipt.status !== 1) throw new Error('Payment transaction failed');
    return { quoteId: quoteIdentifier, transactionHash: transactionReceipt.hash, blockNumber: transactionReceipt.blockNumber, amountWei: offerSnapshot.quote.amount, gasCostWei: transactionReceipt.fee.toString(), reused: false };
  });
  walletPaymentQueues.set(queueKey, currentPayment);
  try { return await currentPayment; } finally { if (walletPaymentQueues.get(queueKey) === currentPayment) walletPaymentQueues.delete(queueKey); }
}
