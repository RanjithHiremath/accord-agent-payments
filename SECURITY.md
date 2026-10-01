# Security boundaries for Accord 0.1

This prototype demonstrates payment behavior on one computer using valueless
development funds. Do not connect valuable wallets, confidential datasets, or
public-facing services to it. No independent security audit has been performed.

## What each component is trusted to do

| Component | Trust placed in it |
| --- | --- |
| Buyer wallet | Holds the buyer's development key and signs transactions |
| Seller signing key | Authorizes the specific offer; does not prove a real-world identity |
| Payment contract | Checks exact quote terms and records one payment per quote |
| Blockchain provider | Reports the local chain accurately and accepts transactions |
| Seller process | Remains available and returns the promised result after payment |
| Local operating system | Protects development keys and processes from other local users and software |

The **provider** is the connection to the blockchain. The library requires the
same provider object for checking and submitting payment; two different networks
can share the same numerical chain ID. This binding prevents accidental mixing of
providers, but it does not make a malicious provider trustworthy. The prototype's
chain-ID restriction is a development guard, not proof that a network is safe.

## Payment checks

The seller signs structured terms using EIP-712, a format that binds a signature
to named fields and a particular application, chain, and contract. The contract
checks the buyer, amount, expiry, seller signature, and whether the quote was
already paid. It updates the payment state before calling the seller to transfer
funds. If that transfer fails, the transaction reverts and the payment state rolls
back.

The JavaScript library additionally checks the expected seller, request, result
fingerprint, network, and payment contract. The owner or calling application must
provide trusted expectations; copying them from an untrusted offer defeats those
checks. The library accepts ordinary signing-key wallets, not seller wallets
whose signature rules require another contract.

## Spending limits and retries

Before a new payment, the buyer checks a maximum payment amount, a maximum
transaction fee, and a maximum combined cost. The submitted transaction includes
the calculated fee and execution limits. This bounds that attempted purchase;
it is not a durable allowance shared by several agent processes.

Within one process, calls using the same wallet are queued to reduce conflicts.
The contract prevents the same signed quote from paying twice across processes.
Two independently submitted attempts can still cause a failed transaction or
unnecessary network fees; application-level coordination and durable spending
reservations are future work.

Recovery first validates the offer's signature and bindings, then checks existing
payment state and its receipt. A previously paid offer remains recoverable after
its expiry; an unpaid expired offer cannot be newly paid. A failed response does
not mean a transfer failed. Check the receipt before deciding to send another
payment.

## Delivery is a separate promise

Payment precedes delivery. There is no escrow, automatic refund, or arbitration.
The seller can stop responding after receiving payment. A fingerprint proves that
received content matches the signed commitment, not that an arbitrary service is
correct or useful.

The example's dataset result is deterministic and recomputed by both programs.
This helps test the payment and recovery flow. It is not a general verification
method for research reports, model outputs, or physical deliveries.

A paid offer is a **bearer credential** in this version: anyone possessing it can
request its result. The HTTP caller is not required to prove control of the
buyer's private key. The example uses nonprivate numerical data; private services
would require authenticated or encrypted delivery.

## Local network exposure

The website and seller bind to `127.0.0.1`, check request Host and Origin headers,
reject cross-site browser requests, limit JSON request size, and serve only
explicitly listed public files. The website does not serve keys or arbitrary
project files. Only one website demonstration runs at a time.

Anvil's blockchain API is a separate development administration interface. It is
bound to loopback with browser cross-origin sharing disabled and no unlocked
accounts, but it does **not** implement the website's Host/Origin checks. A review
probe confirmed that a raw JSON request with foreign Host and Origin headers can
invoke development commands such as changing chain time. Disabling cross-origin
response access does not by itself authenticate incoming requests. Local programs
and some hostile-browser techniques can tamper with this disposable chain.

Consequently, this runtime is for a trusted local development environment. Never
expose any of its ports through tunnels, router forwarding, or public hosting.
The test funds have no value. Before broader use, replace the development node
with an appropriately isolated and authenticated production or test-network
connection; a loopback address alone is not a complete security boundary.

## State and recovery

The full local chain is ephemeral. Restarting the launcher deliberately discards
its balances and receipts and creates new keys and a new contract. Restarting the
seller alone can recover delivery because payment evidence remains on the running
chain and the service can reproduce its result.

Normal shutdown releases the runtime lock. A forced kill can leave a stale lock
or child process. Check process ownership before cleaning up a lock; do not delete
one belonging to an active run. Startup rejects an occupied chain port and waits
for its own Anvil process to report listening before treating the chain as ready.

The website health response identifies the configured local services; it is not
continuous monitoring of payment-network availability. A stopped chain causes an
exchange error, not a validated payment.

## Dependencies and review scope

The initial Ganache dependency was replaced by Anvil after an advisory review.
The compiler's temporary-file dependency is pinned to a patched release through
an npm override. `package-lock.json` captures the installation. The final npm
advisory check and test results are recorded in the decision network; repeat the
check as dependencies or advisories change.

Tests and a separate-agent code review covered selected failure cases. They do
not prove the absence of vulnerabilities, perform a consensus audit, or establish
production safety. Cryptographic primitives are supplied by existing libraries;
no new cryptography is proposed.
