# Accord 0.1 protocol reference

Accord 0.1 lets a buyer program check a seller’s signed offer, pay through a shared payment contract, and request the promised result. This document describes the implemented local prototype. The currency is valueless development ETH on network 31337. The prototype creates no new currency and has no public deployment.

The protocol’s broader goal is exchange between independently operated artificial-intelligence agents without a mandatory company payment server. In this demonstration, buyer and seller are ordinary programs acting under explicit rules; neither calls a language model. A local development network lets us test payment behavior, but its single operator controls the network. It does not establish public decentralization.

## Follow one purchase

A buyer asks the seller to summarize `[12,18,24,30,36]`. The seller returns a signed offer for `100000000000000` wei, equivalent to 0.0001 development ETH. A **wei** is the smallest native currency unit: 1 ETH equals 1,000,000,000,000,000,000 wei.

The offer names the buyer, seller, payment amount, requested work, promised result, and expiry. The buyer checks those details against its own expectations and spending limits. It then sends the payment to the contract, which forwards the exact amount to the seller and records the purchase. Finally, the buyer requests delivery and checks the result:

```json
{"count":5,"sum":120,"min":12,"max":36}
```

A **contract** is a program executed by the money network. Accord’s contract has no administrator, upgrade function, platform fee, or mechanism to issue currency. It records payment and forwards funds; it does not judge whether a seller delivered useful work.

## Identity, network, and units

The contract follows Ethereum’s programmable payment conventions. Ethereum is a public network that executes shared programs and tracks its native currency, ETH. This project uses a local imitation of that execution environment.

A **bit** is a binary digit, and a **byte** groups eight bits. **Hexadecimal** displays byte values using digits `0–9` and letters `a–f`; each byte takes two such digits. **UTF-8** is the text encoding that converts the characters used in this document’s messages into bytes for hashing.

A **wallet** holds a signing key and uses that key to authorize transactions. Its **address** is a public identifier, represented as `0x` followed by 40 hexadecimal digits. Buyer and seller addresses identify keys, not verified people, organizations, or trustworthy services. The current seller signature format supports ordinary signing keys; it does not implement smart-contract wallet signature verification.

The **chain ID** identifies a network in transaction and offer signatures. The local chain ID is the decimal string `"31337"`. Different development networks can share that ID. Therefore the library also requires the wallet and verification code to use the same provider object. A **provider** is the software connection used to read the network and submit transactions. The provider remains trusted; the library does not independently verify the complete network history.

Amounts, expiry, and chain ID use decimal strings in JavaScript Object Notation (JSON), the text format exchanged between programs. Strings avoid the rounding that JavaScript numbers can introduce for large integers. Valid unsigned values match `0` or a nonzero digit followed by digits, and fit within 256 bits: from 0 through 2²⁵⁶−1. Leading zeros, signs, whitespace, decimal fractions, scientific notation, and JSON numbers are rejected for these fields. Payment amount must be greater than zero.

**Native currency** means the network’s own currency, transferred with the transaction. Accord 0.1 implements only native transfers; it has no separate token address or token transfer method. The payment helper refuses network IDs other than 31337. A chain ID alone does not prove that funds are valueless: use only the disposable development chain provided with this project.

## The example service and exact request bytes

The service identifier is `dataset.profile.v1`. Its input is an array of 1–100 integers, each between 0 and 1,000,000 inclusive. Fractions, strings, missing array elements, and negative zero are rejected. The array’s order is preserved.

The result has exactly four calculated values: `count` is the number of inputs, `sum` is their total, `min` is the smallest, and `max` is the largest. The largest possible sum is 100,000,000, safely representable by the JavaScript number type used here.

A **hash** is a fixed-length fingerprint of bytes. This prototype uses Keccak-256, producing 32 bytes displayed as `0x` and 64 hexadecimal digits. A changed input should produce a different fingerprint. A hash does not encrypt the input or prove it is valuable.

To calculate `requestHash`, construct the following object with keys in this order, serialize it with JavaScript `JSON.stringify`, encode that text as UTF-8 bytes, and hash those bytes with Keccak-256:

```json
{"service":"dataset.profile.v1","values":[12,18,24,30,36]}
```

For this exact input:

```text
requestHash = 0x9065d361baa640623af4780262d79104ffd34332fb5553d5e32c7fa056d11fd8
```

To calculate `resultHash`, construct the result with keys in the order `count`, `sum`, `min`, `max`, serialize and encode it in the same way, and hash it:

```json
{"count":5,"sum":120,"min":12,"max":36}
```

```text
resultHash = 0xd1b853edc6096da36a98d3b9f4a4bb7489604904a4ebe9c8e4184b2ff19bc03b
```

Those two fingerprints were computed with the checked-in library. Other implementations must reproduce the exact bytes: no extra spaces, line breaks, reordered keys, or alternate numeric formatting. This is a service-specific serialization rule. It is not a general rule for canonicalizing arbitrary JSON, where **canonicalizing** means choosing one representation for equivalent data.

The buyer can calculate this toy result itself and checks its fingerprint before paying. The service demonstrates the exchange mechanics; it does not demonstrate a commercially necessary computation or a general proof that paid work is correct.

## Offer envelope

An **envelope** is the surrounding message that carries the signed quote and its supporting information. `POST /quote` accepts:

```json
{"buyer":"<buyer address>","values":[12,18,24,30,36]}
```

The seller returns these fields. Angle-bracket values below are explanatory placeholders, not a valid signed offer:

```json
{
  "protocol": "accord/0.1",
  "service": "dataset.profile.v1",
  "chainId": "31337",
  "contractAddress": "<deployed payment contract address>",
  "quote": {
    "buyer": "<buyer address>",
    "seller": "<seller address>",
    "amount": "100000000000000",
    "requestHash": "0x9065d361baa640623af4780262d79104ffd34332fb5553d5e32c7fa056d11fd8",
    "resultHash": "0xd1b853edc6096da36a98d3b9f4a4bb7489604904a4ebe9c8e4184b2ff19bc03b",
    "nonce": "<0x followed by 64 hexadecimal digits>",
    "expiry": "<Unix time in seconds>"
  },
  "signature": "<0x followed by 130 hexadecimal digits>",
  "request": {"values": [12,18,24,30,36]}
}
```

**Unix time** counts seconds since 1970-01-01 00:00:00 UTC. An offer can be paid through its expiry second, inclusive. The reference seller sets expiry 120 seconds after issuing the offer.

The quote **nonce** is a random 32-byte value that distinguishes otherwise identical offers. A new nonce produces a new purchase identity. Buying the same service through a newly issued offer can therefore charge again. Retry protection applies to the same signed quote, not every semantically similar purchase.

The quote endpoint omits the result object, but includes its signed fingerprint. All unsigned envelope fields are checked against trusted expectations and the signed contents before payment. The enclosing JSON text itself is not what the seller signs.

## Exact signed structure

A **digital signature** provides evidence that the holder of a particular private key authorized specific data. Accord uses Ethereum Improvement Proposal 712 (EIP-712), a format that gives each signed field a name and type and binds the message to a signing context called a **domain**.

The domain fields, in order, are:

| Name | Type | Value |
|---|---|---|
| `name` | `string` | `Accord` |
| `version` | `string` | `0.1` |
| `chainId` | `uint256` | `31337` for this prototype |
| `verifyingContract` | `address` | The deployed Accord payment contract |

The signed `Quote` fields must use this exact order:

| Name | Type | Meaning |
|---|---|---|
| `buyer` | `address` | Wallet allowed to submit payment |
| `seller` | `address` | Offer signer and payment recipient |
| `amount` | `uint256` | Exact native payment in wei |
| `requestHash` | `bytes32` | Fingerprint of the specified service request |
| `resultHash` | `bytes32` | Fingerprint of the promised result |
| `nonce` | `bytes32` | Random identifier distinguishing this offer |
| `expiry` | `uint256` | Last permitted payment time in Unix seconds |

`uint256` means a nonnegative integer occupying up to 256 bits. `bytes32` means exactly 32 bytes. The JSON decimal strings become integers for signing; the strings’ ASCII characters are not substituted for those integers.

The precise type strings are:

```text
EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)
Quote(address buyer,address seller,uint256 amount,bytes32 requestHash,bytes32 resultHash,bytes32 nonce,uint256 expiry)
```

For implementers, the following defines the fingerprint that the contract verifies. `keccak256(text)` below hashes the UTF-8 bytes when its argument is text. `abi.encode` is Ethereum Application Binary Interface encoding: the typed values here occupy separate 32-byte words; unsigned integers and addresses are left-padded with zero bytes. `concat` joins raw byte sequences without separators.

```text
DOMAIN_TYPE_HASH = keccak256(the exact EIP712Domain type string above)
QUOTE_TYPE_HASH  = keccak256(the exact Quote type string above)

domainSeparator = keccak256(abi.encode(
  DOMAIN_TYPE_HASH,
  keccak256("Accord"),
  keccak256("0.1"),
  chainId,
  verifyingContract
))

quoteStructHash = keccak256(abi.encode(
  QUOTE_TYPE_HASH,
  buyer,
  seller,
  amount,
  requestHash,
  resultHash,
  nonce,
  expiry
))

quoteId = keccak256(concat(0x1901, domainSeparator, quoteStructHash))
```

`0x1901` here denotes two raw bytes, not six text characters. The **quote ID** is the final signed fingerprint. It identifies the purchase in contract storage, events, and delivery responses. The contract computes the domain from its own network ID and its own address.

The signature is 65 bytes: a 32-byte `r` component, a 32-byte `s` component, and a one-byte recovery value of 27 or 28. The components belong to the elliptic-curve signature method used by Ethereum; recovery reconstructs the signer’s public address from the signature and message fingerprint. The contract requires `s` no greater than:

```text
0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0
```

This lower-half rule prevents accepting the alternative high-`s` form of the same signature. Compact 64-byte signatures are not accepted. The recovered signer must equal the nonzero seller address.

## Payment checks and spending policy

`validateOffer(offer, expected)` checks the message without submitting a transaction. `expected` must come from buyer policy, not simply be copied from an untrusted seller response. It contains `buyer`, `seller`, `chainId`, `contractAddress`, `values`, `maxPaymentWei`, and `nowSeconds`.

The validator checks protocol and service versions, numeric representations, buyer and seller addresses, expected network and contract, request and result fingerprints, signature, and expiry. Its result is the quote ID. Successful validation proves that the offer matches those expectations and signature rules; it does not prove payment occurred.

`payOffer(offer, {wallet, provider, expected, maxGasWei, maxTotalWei})` adds payment. It copies the input before awaiting network operations so callers cannot alter the offer halfway through authorization. It requires the expected buyer to match the wallet and the wallet’s provider to be the same object as `provider`.

**Gas** measures contract execution work. The network charges a price per unit of gas. The helper estimates that work, adds a 20% allowance rounded upward, and sets that result as the transaction’s gas limit. It then enforces three limits:

| Limit | Check |
|---|---|
| `maxPaymentWei` | Signed payment amount must be no larger |
| `maxGasWei` | Gas limit multiplied by the maximum price per gas must be no larger |
| `maxTotalWei` | Payment plus that maximum transaction fee must be no larger |

All three limits are decimal strings in wei. The helper uses `maxFeePerGas` when available, otherwise `gasPrice`, and includes those fee settings and the gas limit in the signed transaction. Actual fee can be lower than this maximum. A transaction that executes and fails can still consume a network fee.

These are limits for one purchase call. There is no daily allowance or durable shared balance policy. A **process** is one running program: calls using the same wallet are queued within this process so they run in order. Separate programs do not share that queue. Pending transaction numbers are read directly from the provider before submission to reduce stale-cache errors. This transaction number is also called a nonce, but it is distinct from the random nonce inside the seller’s quote.

## Contract behavior and receipt

The contract exposes:

```solidity
pay(Quote quote, bytes signature) external payable
paid(bytes32 quoteId) external view returns (bool)
```

`payable` means the call can carry native currency. The contract independently verifies the submitting buyer, nonzero seller, exact positive amount, expiry, signature, signing domain, and whether this quote was already paid. It marks the quote paid before forwarding funds. If the recipient rejects the transfer, the whole call reverts: its value transfer and paid marker are undone.

A successful call emits an **event**, a record included with the transaction:

```solidity
Paid(
  bytes32 indexed quoteId,
  address indexed buyer,
  address indexed seller,
  uint256 amount,
  bytes32 requestHash,
  bytes32 resultHash
)
```

`indexed` means the event can be searched using that field. The helper waits for inclusion in one block, checks transaction success, and returns:

```text
{quoteId, transactionHash, blockNumber, amountWei, gasCostWei, reused}
```

A **transaction hash** identifies the submitted transaction. `blockNumber` identifies the containing block, a numbered batch of network transactions. `gasCostWei` is the transaction’s actual execution fee. `reused` is false for a new successful payment and true when recovering an existing one. A recovered receipt reports the original transaction’s fee; recovery itself submits no new payment transaction. One local block confirms execution in this test environment; it does not establish an appropriate finality policy for a public network, whose accepted history can change.

## Retry, expiry, and delivery

A repeated call with the same signed offer must recover its existing payment rather than submit another charge. The helper first checks all offer bindings and the signature while temporarily deferring the expiry check. It then reads `paid(quoteId)` at a concrete current block. If paid, it finds the unique matching `Paid` event and successful transaction receipt. If either is unavailable, recovery fails without deliberately submitting a replacement payment.

Only an unpaid offer proceeds to the ordinary expiry check and possible transaction submission. The payment clock is the latest of the caller’s time, the current block time, and the machine’s current time. Supplying an old caller timestamp therefore cannot revive an expired unpaid offer. The contract also checks the time when the transaction executes.

After payment, delivery uses:

```text
POST /deliver
body: {"offer": <the complete signed offer>}
```

The seller revalidates the offer against its configured seller, chain, contract, supported service, price limit, and request. Delivery intentionally ignores payment expiry because the purchase may already have happened. The seller then checks the contract’s paid marker before releasing a result. An unpaid offer receives HTTP status 402. Invalid messages receive status 400. A paid valid offer receives status 200 with `{quoteId,result,resultHash}`.

HTTP means Hypertext Transfer Protocol, the request-and-response mechanism used by web clients. This implementation’s use of status 402 does not establish compatibility with another payment protocol.

The buyer checks the returned quote ID and recalculates the result fingerprint. The seller can recalculate the same result after restarting, provided it reconnects to the same network, contract, and seller configuration. Resetting the disposable chain erases its payment history; delivery recovery does not survive that reset.

Delivery is a **bearer capability**: anyone holding the full valid paid offer can present it to obtain the result. The delivery request has no fresh buyer signature or encrypted response. The purchase is bound to the buyer for payment, but result access is not restricted to that buyer. Do not use this flow for confidential results without a separate authenticated delivery design.

If communication fails after submission, retain the original offer and retry it. The contract prevents two successful payments for one quote, but competing processes can still submit redundant transactions and spend failed-transaction fees. There is no automatic pending-transaction replacement or timeout-resolution system.

## Reference endpoints and trust boundaries

The reference seller serves `GET /health`, `GET /.well-known/accord.json`, `POST /quote`, and `POST /deliver`. Its discovery response describes the service, seller, network, contract, and price; that response alone is not a reason to trust those identities. The buyer’s local configuration supplies expected addresses and network settings.

The launcher’s default listeners are the development chain on `127.0.0.1:8545`, seller on `127.0.0.1:4318`, and demonstration website on `127.0.0.1:4317`. This address refers to the local machine. The website is a demonstration interface; its endpoints are not part of the payment contract or the signed quote format.

The contract’s payment record survives a seller-process restart while the chain persists. It proves payment under that chain’s rules. It does not prove delivery, answer quality, seller availability, or arrival of a physical item. **Escrow** means holding funds until a release condition is met; this contract implements no escrow. It forwards payment immediately and has no refund function or dispute mechanism.

Accord 0.1 does not claim interoperability with x402, L402, or Agent Payments Protocol (AP2). Independent implementations, public-network operation, confidential delivery, public finality rules, cross-process spending controls, and a security audit remain separate work.

## Evidence and implementation locations

The payment suite completed 14 passing tests against a disposable Anvil development chain. Anvil runs Ethereum-compatible contract execution locally. The tests cover signed-field and domain checks, numeric validation, payment and fee budgets, exact balance changes, replay and concurrent purchase behavior, expiry recovery, rejected transfer rollback, and provider identity checks. These observations validate the tested local paths; they do not establish production safety.

The implementation is in `contracts/AccordPayments.sol` and `lib/protocol.mjs`. The seller and buyer flows are in `runtime/seller.mjs` and `runtime/buyer.mjs`; payment tests are in `test/protocol.test.mjs`. The project’s linked logs record the research, alternatives, decisions, and remaining questions behind this prototype.
