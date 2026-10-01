import test from 'node:test';
import assert from 'node:assert/strict';
import { startDevelopmentChain } from '../runtime/development-chain.mjs';
import { Wallet, ContractFactory, randomBytes, hexlify, parseEther } from 'ethers';
import { compileContract, domain, quoteTypes, quoteId, profile, hashRequest, hashResult, validateOffer, payOffer } from '../lib/protocol.mjs';

const values = [12, 18, 24, 30, 36];
const paymentAmountWei = '1000000000000000';
const feeBudgetWei = parseEther('0.01').toString();
const totalBudgetWei = parseEther('0.02').toString();
let chain, provider, buyerWallet, sellerWallet, strangerWallet, paymentContract, paymentContractAddress;

test.before(async () => {
  const initialAccounts = Array.from({ length: 3 }, () => ({ secretKey: Wallet.createRandom().privateKey }));
  chain = await startDevelopmentChain({ accounts: initialAccounts });
  provider = chain.provider;
  buyerWallet = new Wallet(initialAccounts[0].secretKey, provider);
  sellerWallet = new Wallet(initialAccounts[1].secretKey, provider);
  strangerWallet = new Wallet(initialAccounts[2].secretKey, provider);
  const contractArtifact = compileContract();
  paymentContract = await new ContractFactory(contractArtifact.abi, contractArtifact.bytecode, strangerWallet).deploy();
  await paymentContract.waitForDeployment();
  paymentContractAddress = await paymentContract.getAddress();
});
test.after(async () => { await chain?.close(); });

async function makeOffer(overrides = {}, signingWallet = sellerWallet, signingDomain) {
  const quote = { buyer: buyerWallet.address, seller: sellerWallet.address, amount: paymentAmountWei, requestHash: hashRequest(values), resultHash: hashResult(profile(values)), nonce: hexlify(randomBytes(32)), expiry: String(Math.floor(Date.now() / 1000) + 3600), ...overrides };
  return { protocol: 'accord/0.1', service: 'dataset.profile.v1', chainId: '31337', contractAddress: paymentContractAddress, quote, signature: await signingWallet.signTypedData(signingDomain ?? domain('31337', paymentContractAddress), quoteTypes, quote), request: { values } };
}
function expectedOffer(overrides = {}) {
  return { buyer: buyerWallet.address, seller: sellerWallet.address, chainId: '31337', contractAddress: paymentContractAddress, values, maxPaymentWei: paymentAmountWei, nowSeconds: Math.floor(Date.now() / 1000), ...overrides };
}
function purchaseOptions(overrides = {}) {
  return { wallet: buyerWallet, provider, expected: expectedOffer(), maxGasWei: feeBudgetWei, maxTotalWei: totalBudgetWei, ...overrides };
}
async function rejectedPayment(offer, wallet = buyerWallet, amountWei = offer.quote.amount) {
  await assert.rejects(async () => {
    const transaction = await paymentContract.connect(wallet).pay(offer.quote, offer.signature, { value: amountWei });
    await transaction.wait();
  });
}

test('dataset encoding is explicit, deterministic, and bounded', () => {
  assert.deepEqual(profile(values), { count: 5, sum: 120, min: 12, max: 36 });
  assert.equal(hashResult({ max: 36, count: 5, min: 12, sum: 120 }), hashResult(profile(values)));
  for (const invalidValues of [[], [1.5], [-1], [-0], [1000001], Array(101).fill(1), Array(1), ['1'], null]) assert.throws(() => profile(invalidValues));
});

test('valid quote has identical signed digest and validation identifier', async () => {
  const offer = await makeOffer();
  assert.equal(validateOffer(offer, expectedOffer()), quoteId(offer.quote, '31337', paymentContractAddress));
});

test('validation rejects signature tampering, request alteration, wrong buyer, seller, chain, contract and service', async () => {
  const offer = await makeOffer();
  const alteredOffers = [
    { ...offer, quote: { ...offer.quote, amount: '2' } },
    { ...offer, request: { values: [1, 2, 3] } },
    { ...offer, quote: { ...offer.quote, buyer: strangerWallet.address } },
    { ...offer, quote: { ...offer.quote, seller: strangerWallet.address } },
    { ...offer, chainId: '1' }, { ...offer, contractAddress: strangerWallet.address },
    { ...offer, service: 'unrecognized.service' }, { ...offer, protocol: 'accord/9' },
    { ...offer, quote: { ...offer.quote, resultHash: hashResult(profile([2])) } },
    { ...offer, signature: '0x1234' },
  ];
  for (const alteredOffer of alteredOffers) assert.throws(() => validateOffer(alteredOffer, expectedOffer()));
  assert.throws(() => validateOffer(offer, expectedOffer({ maxPaymentWei: '1' })), /budget/);
});

test('strict numeric encodings prevent ambiguous wire amounts, expiry and network identifiers', async () => {
  const offer = await makeOffer();
  for (const amount of [1, '01', '-1', '+1', '1.0', '1e3', ' 1', ((1n << 256n)).toString()]) assert.throws(() => validateOffer({ ...offer, quote: { ...offer.quote, amount } }, expectedOffer()), /decimal string/);
  for (const expiry of [123, '01', '1e10']) assert.throws(() => validateOffer({ ...offer, quote: { ...offer.quote, expiry } }, expectedOffer()), /decimal string/);
  assert.throws(() => validateOffer({ ...offer, chainId: 31337 }, expectedOffer()), /decimal string/);
});

test('contract independently rejects wrong signature, signing domain, buyer, expiry and underpayment', async () => {
  await rejectedPayment(await makeOffer({}, strangerWallet));
  await rejectedPayment(await makeOffer({}, sellerWallet, domain('1', paymentContractAddress)));
  await rejectedPayment(await makeOffer({}, sellerWallet, domain('31337', strangerWallet.address)));
  await rejectedPayment(await makeOffer(), strangerWallet);
  await rejectedPayment(await makeOffer({ expiry: '1' }));
  await rejectedPayment(await makeOffer(), buyerWallet, '1');
  await rejectedPayment(await makeOffer(), buyerWallet, (BigInt(paymentAmountWei) + 1n).toString());
  await rejectedPayment(await makeOffer({ amount: '0' }));
  const alteredRequestOffer = await makeOffer();
  alteredRequestOffer.quote.requestHash = hashRequest([99]);
  await rejectedPayment(alteredRequestOffer);
  const expiredOffer = await makeOffer({ expiry: '1' });
  assert.throws(() => validateOffer(expiredOffer, expectedOffer()), /expired/);
});

test('gas, total and payment budgets reject before any transaction is submitted', async () => {
  const offer = await makeOffer();
  const transactionCountBefore = await provider.getTransactionCount(buyerWallet.address);
  await assert.rejects(payOffer(offer, purchaseOptions({ maxGasWei: '0' })), /Gas budget/);
  await assert.rejects(payOffer(offer, purchaseOptions({ maxTotalWei: paymentAmountWei })), /Total purchase budget/);
  await assert.rejects(payOffer(offer, purchaseOptions({ expected: expectedOffer({ maxPaymentWei: '1' }) })), /Payment budget/);
  assert.equal(await provider.getTransactionCount(buyerWallet.address), transactionCountBefore);
});

test('actual EVM payment moves exact value, emits bound receipt, and duplicate concurrent SDK calls charge once', async () => {
  const offer = await makeOffer();
  const sellerBalanceBeforeWei = await provider.getBalance(sellerWallet.address);
  const buyerBalanceBeforeWei = await provider.getBalance(buyerWallet.address);
  const [firstReceipt, retryReceipt] = await Promise.all([payOffer(offer, purchaseOptions()), payOffer(offer, purchaseOptions())]);
  assert.equal(firstReceipt.reused, false);
  assert.equal(retryReceipt.reused, true);
  assert.equal(firstReceipt.transactionHash, retryReceipt.transactionHash);
  assert.equal(await provider.getBalance(sellerWallet.address) - sellerBalanceBeforeWei, BigInt(paymentAmountWei));
  assert.equal(buyerBalanceBeforeWei - await provider.getBalance(buyerWallet.address), BigInt(paymentAmountWei) + BigInt(firstReceipt.gasCostWei));
  assert.equal(await paymentContract.paid(firstReceipt.quoteId), true);
  const paymentEvents = await paymentContract.queryFilter(paymentContract.filters.Paid(firstReceipt.quoteId));
  assert.equal(paymentEvents.length, 1);
  assert.equal(paymentEvents[0].args.buyer, buyerWallet.address);
  assert.equal(paymentEvents[0].args.resultHash, offer.quote.resultHash);
  assert.equal(await provider.getBalance(paymentContractAddress), 0n);
  await rejectedPayment(offer);
});

test('paid quote remains recoverable after expiry, but expired unpaid and altered paid offers are rejected', async () => {
  const offer = await makeOffer();
  const firstReceipt = await payOffer(offer, purchaseOptions());
  const futureExpected = expectedOffer({ nowSeconds: Number(offer.quote.expiry) + 1 });
  assert.throws(() => validateOffer(offer, futureExpected), /expired/);
  const recoveredReceipt = await payOffer(offer, purchaseOptions({ expected: futureExpected }));
  assert.equal(recoveredReceipt.transactionHash, firstReceipt.transactionHash);
  assert.equal(recoveredReceipt.reused, true);
  await assert.rejects(payOffer(await makeOffer({ expiry: offer.quote.expiry }), purchaseOptions({ expected: futureExpected })), /expired/);
  await assert.rejects(payOffer({ ...offer, signature: '0x1234' }, purchaseOptions({ expected: futureExpected })), /signature/);
});

test('a wrong wallet cannot purchase another buyer’s signed quote', async () => {
  const offer = await makeOffer();
  await assert.rejects(payOffer(offer, purchaseOptions({ wallet: strangerWallet })), /Wallet buyer mismatch/);
});

test('payment helper refuses public chain identifiers before signing or sending', async () => {
  const offer = await makeOffer();
  const publicNetworkProvider = { getNetwork: async () => ({ chainId: 1n }) };
  const publicNetworkWallet = { getAddress: async () => buyerWallet.address, provider: publicNetworkProvider };
  await assert.rejects(payOffer(offer, purchaseOptions({ provider: publicNetworkProvider, wallet: publicNetworkWallet })), /restricted to local chain/);
});

test('unpaid quote expiry cannot be bypassed by supplying an old caller clock', async () => {
  const offer = await makeOffer({ expiry: '1' });
  await assert.rejects(payOffer(offer, purchaseOptions({ expected: expectedOffer({ nowSeconds: '0' }) })), /expired/);
});

test('concurrent distinct purchases serialize wallet nonces and settle both quotes', async () => {
  const firstOffer = await makeOffer();
  const secondOffer = await makeOffer();
  const [firstReceipt, secondReceipt] = await Promise.all([payOffer(firstOffer, purchaseOptions()), payOffer(secondOffer, purchaseOptions())]);
  assert.notEqual(firstReceipt.transactionHash, secondReceipt.transactionHash);
  assert.equal(await paymentContract.paid(firstReceipt.quoteId), true);
  assert.equal(await paymentContract.paid(secondReceipt.quoteId), true);
});

test('recipient transfer failure rolls back the paid marker and allows a later retry', async () => {
  const offer = await makeOffer();
  const quoteIdentifier = quoteId(offer.quote, '31337', paymentContractAddress);
  const sellerBalanceBeforeWei = await provider.getBalance(sellerWallet.address);
  // Inject a reverting recipient in the disposable chain to exercise failure rollback.
  await provider.send('anvil_setCode', [sellerWallet.address, '0x60006000fd']);
  try {
    await assert.rejects(async () => {
      const transaction = await paymentContract.connect(buyerWallet).pay(offer.quote, offer.signature, { value: offer.quote.amount, gasLimit: 200000 });
      await transaction.wait();
    });
    assert.equal(await paymentContract.paid(quoteIdentifier), false);
    assert.equal(await provider.getBalance(sellerWallet.address), sellerBalanceBeforeWei);
    assert.equal(await provider.getBalance(paymentContractAddress), 0n);
  } finally {
    await provider.send('anvil_setCode', [sellerWallet.address, '0x']);
  }
  const successfulRetry = await payOffer(offer, purchaseOptions());
  assert.equal(successfulRetry.reused, false);
  assert.equal(await paymentContract.paid(quoteIdentifier), true);
});


test('payment and verification cannot use different providers with the same claimed network', async () => {
  const offer = await makeOffer();
  const otherNetworkProvider = { getNetwork: async () => ({ chainId: 31337n }) };
  await assert.rejects(payOffer(offer, purchaseOptions({ provider: otherNetworkProvider })), /same provider instance/);
});
