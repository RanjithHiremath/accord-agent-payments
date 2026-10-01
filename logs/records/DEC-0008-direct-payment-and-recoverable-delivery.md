# DEC-0008 — Use direct payment with recoverable delivery

Status: **accepted** · Recorded: 2026-09-30T05:58:45Z

Decision authority: Assistant decision under delegated implementation authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The first agent service will calculate a small numerical dataset summary. Its seller signs the requested input, price, recipient, and promised result fingerprint. The buyer pays before receiving the response. This leaves a seller-availability assumption that must be stated plainly.

## Terms used in this record

- **Hash or fingerprint:** A fixed-length value computed from data; changing the data changes the expected fingerprint.
- **Signed quote:** A price offer with cryptographic evidence of which seller authorized its exact terms.
- **Nonce:** A unique value distinguishing one offer from another.
- **Replay protection:** Preventing the same offer from being used to charge again.
- **Receipt:** A record of the completed payment.
- **Escrow:** Funds held pending an explicit release or refund condition.

## Concrete example

If the buyer loses its connection after paying, it submits the same signed offer again. The seller checks the existing payment and returns the same dataset summary without another charge.

## Why this log exists

I am writing this log to choose the version 0.1 payment and delivery guarantees.

## Question

Should the first contract pay immediately or hold funds for later approval?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Direct payment and retryable deterministic delivery | Small, testable payment flow; depends on seller availability and has no automatic refund. | accept |
| Escrow pending buyer acceptance | Adds release, timeout, and dispute rules and can allow a buyer to withhold acceptance. | watch |

## Recommendation or decision

Use direct payment, exact quote binding, repeat-payment prevention, and recoverable delivery. Document no automatic refunds and no guarantee of arbitrary service quality.

## Reasons

- This isolates the payment mechanism so its actual behavior can be tested.
- A promised result fingerprint does not by itself prove useful work.
- The service is deliberately reproducible so retries need no central order database.

## Evidence and references

- [SRC-0022 — Local implementation contract](../SOURCES.md#src-0022): The shared design specifies quote fields, payment state, and deterministic delivery.
- [SRC-0016 — Ethereum oracle documentation](../SOURCES.md#src-0016): External service truth is separate from blockchain execution.

## Uncertainties and next evidence needed

- The seller can become unavailable after payment.
- This example uses ordinary programs to stand in for agent tools; it does not require a language-model account.

## Revisit when

A selected service requires conditional payment, dispute resolution, or stronger delivery guarantees.

## Connected records

- **depends_on** → [DEC-0007 — Use an Ethereum-compatible local chain for version 0.1](DEC-0007-existing-network-first-implementation.md)
- **informed_by** → [RES-0010 — Distinguish payment from successful service delivery](RES-0010-payment-versus-service-delivery.md)
- ← **depends_on** from [DEC-0013 — Bind the offer to its exact payment context](DEC-0013-structured-offers-and-single-payment-record.md)

## How this conclusion was reached

- **Method:** Recorded user delegation and made an implementation choice; test results are recorded separately.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0022; SRC-0016
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the decentralized agent-payment objective and the user’s independent-reader logging requirement.
- **What this permits next:** Proceed with local development and testing using valueless development funds. No claim of public-network readiness.
