# Accord 0.1 — integration contract

Working name: Accord. Local research prototype, not a new currency or a deployed
public protocol. No x402, L402, or AP2 compatibility is claimed. Those standards
informed the design; interoperability needs a separate tested adapter.

## Roles and boundaries

- `lib/protocol.mjs`, `contracts/AccordPayments.sol`, `test/protocol.test.mjs`:
  payment and quote implementation.
- `runtime/`: local development chain, seller process, buyer process, website
  server and launcher. All listeners bind to `127.0.0.1`.
- `web/`: marketing site, live local demonstration, searchable decision network.
- `logs/`: durable decision network. Main agent alone edits the canonical ledger
  and source catalog; contributors send findings for logging.

## Shared data

Network: local Ethereum-compatible development chain, ID 31337. Currency is
valueless development ETH. No public network or real funds.

Quote EIP-712 domain (structured signing context): `name: Accord`, `version: 0.1`,
`chainId`, `verifyingContract`. EIP-712 Quote fields, in this exact order:

```
address buyer
address seller
uint256 amount
bytes32 requestHash
bytes32 resultHash
bytes32 nonce
uint256 expiry
```

All uint256 values are decimal strings in JSON. A quote ID is its EIP-712 digest.
The contract exposes `pay(Quote quote, bytes signature)` payable and
`paid(bytes32 quoteId)` returning bool. It emits
`Paid(bytes32 indexed quoteId, address indexed buyer, address indexed seller,
uint256 amount, bytes32 requestHash, bytes32 resultHash)`.
Contract constructor takes no arguments. No owner, upgrade authority, fees,
or token issuance. Payment moves exact native value to the quoted seller.

The example service is `dataset.profile.v1`: 1–100 integers, each between 0 and
1,000,000. Result object, fixed key order: `{count,sum,min,max}`. Request hash is
keccak256 of UTF-8 JSON.stringify({service:'dataset.profile.v1',values}). Result
hash is keccak256 of UTF-8 JSON.stringify({count,sum,min,max}). No general-purpose
JSON canonicalization is claimed. This deterministically computed demonstration
service deliberately avoids an external model API or fabricated data feed.

## Library interface

`lib/protocol.mjs` exports:

- `compileContract()` -> `{abi, bytecode}` (compile Solidity with Shanghai target).
- `domain(chainId, contractAddress)` and `quoteTypes`.
- `quoteId(quote, chainId, contractAddress)`.
- `profile(values)` -> validated `{count,sum,min,max}`.
- `hashRequest(values)` and `hashResult(result)`.
- `validateOffer(offer, expected)` throws on invalid offer. `expected` contains
  `buyer`, `seller`, `chainId`, `contractAddress`, `values`, `maxPaymentWei`,
  `nowSeconds`. Verify strict amount/expiry encoding, signature, all request and
  network bindings, service name, hashes, and expiry. Returns the quote ID.
- `payOffer(offer, {wallet, provider, expected, maxGasWei, maxTotalWei})` checks
  offer and expected local network, estimates gas, enforces fee+payment caps,
  submits payment once, and returns `{quoteId, transactionHash, blockNumber,
  amountWei, gasCostWei, reused}`. Repeated calls recover an existing Paid event
  instead of charging again. Serialize calls within a process for the same wallet;
  document that budgets are per invocation, not durable multi-process allowances.

Offer envelope: `{protocol:'accord/0.1', service:'dataset.profile.v1', chainId,
contractAddress, quote, signature, request:{values}}`. No result is disclosed by
the quote endpoint; the signed resultHash commits to the promised response.
This does not prove useful or correct work for arbitrary services.

## Runtime interface

Start an Anvil development chain on 8545, seller on 4318, marketing website on 4317.
Anvil replaces the initial Ganache choice after the dependency advisory review.
Launcher creates random
development keys only; never uses real wallets. Runtime config `.local/network.json`:
`{chainId,rpcUrl,contractAddress,sellerUrl,buyerAddress,sellerAddress}`.
Secrets only in `.local/wallets.json` with file mode 0600, ignored by Git and never
served. Keep helper `runtime/config.mjs` if useful.

Seller endpoints: GET `/health`, GET `/.well-known/accord.json`;
POST `/quote` with `{buyer,values}`; POST `/deliver` with `{offer}`. Verify the
envelope/request/signature against configured chain, contract and seller, and
on-chain payment. Paid offers remain deliverable after quote expiry. Repeated
delivery returns the same result; restarting seller must not erase paid status.

Buyer exports `runDemo({scenario, values}={})`. Default values `[12,18,24,30,36]`.
Scenarios: `success`, `replay`, `budget`. It fetches a quote, enforces a budget,
pays, and fetches delivery. Replay makes the same payment request twice and
shows one payment. Budget declines before submitting a transaction.
Returns JSON `{ok,scenario,summary,steps:[{name,status,detail}],quoteId,
transactionHash,blockNumber,amountWei,gasCostWei,buyer,seller,result,reused,
network:'Local development chain',currency:'Test ETH',durationMs}` as applicable.
`ok:true` includes expected budget rejection; `steps` describe observed events,
not invented timing. Buyer CLI prints public results only.

Website API: GET `/api/health`, GET `/api/logs` returning `{records,sources}` from
ledger and source catalog, POST `/api/demo` with `{scenario,values}`. Server
serializes demonstrations, rejects concurrent requests, bounds request sizes,
and requires same-origin browser requests. Serve only allowlisted public files;
never expose the project directory or `.local`. A GET `/api/receipt?quoteId=...`
may provide verified public receipt details if implemented.

## Success and honest limits

Demonstrate real execution of a payment contract on a local EVM, signed offers,
request/recipient/network bindings, per-purchase budgets including a fee cap,
replay protection, and retryable delivery. Test wrong signatures, tampering,
expiry, wrong buyer, wrong network/domain, underpayment, replay, and interrupted
delivery. A local chain is controlled by this launcher: it does not prove public
decentralization, independent operators, market value, or real-world fairness.
No automatic refunds or general escrow. Payment precedes delivery; the buyer
trusts seller availability. The SDK is for development only and not audited.
