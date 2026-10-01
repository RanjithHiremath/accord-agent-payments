# DEC-0013 — Bind the offer to its exact payment context

Status: **accepted** · Recorded: 2026-09-30T06:16:32Z

Decision authority: Assistant implementation decision and recorded evidence under delegated project authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

An agent must not authorize a price that can be redirected to another seller, request, or network. The first implementation therefore signs named offer fields and separately records whether that exact offer has already been paid.

## Terms used in this record

- **EIP-712:** An established format for hashing and signing named structured fields in an Ethereum application.
- **Domain separation:** Including the application, version, chain, and contract in the signed context so a signature is not silently reused elsewhere.
- **Digest:** The fixed-length hash used to identify the exact signed message.
- **Replay:** Repeating a previously authorized message to try to repeat its effect.
- **Low-S signature:** A restricted signature representation used to avoid equivalent alternative encodings.

## Concrete example

A seller signs a quote for one buyer’s dataset. Changing the recipient or dataset produces a different expected digest. Paying that same valid digest again is rejected by the contract’s paid-state record.

## Why this log exists

I am writing this log to explain why the signed message and one-payment state are separate mechanisms.

## Question

How should agents bind an agreement and prevent repeated payment?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Typed offer bound to application and network, plus a paid-offer mapping | Explicit context and a concrete repeat-payment check. | accept |
| Sign an unstructured message without defined encoding | Invites disagreements over what exact bytes or fields were authorized. | reject |
| Use structured signing without tracking paid offers | Binds data but does not prevent repeating the same valid authorization. | reject |

## Recommendation or decision

Use EIP-712 for the precise quote fields and a separate contract mapping for one payment per digest. Accept only the contract’s supported signature representation.

## Reasons

- The standard provides structured signing but explicitly does not supply replay protection.
- The contract, signer, and validator use the same field order and domain.
- Actual tests cover changed terms, wrong domains, and repeated submissions.

## Evidence and references

- [SRC-0023 — EIP-712 structured-data signing standard](../SOURCES.md#src-0023): EIP-712 defines structured encoding and domain context while leaving replay handling to the application.
- [SRC-0024 — Current contract and protocol implementation](../SOURCES.md#src-0024): The implementation contains the exact encoding and paid-state check.
- [SRC-0025 — Full local automated test output](../SOURCES.md#src-0025): The corresponding negative and payment tests passed.

## Uncertainties and next evidence needed

- Contract-based seller wallet signatures are not supported in this version.
- This is a custom experimental offer format, not a tested x402 adapter.

## Revisit when

Another wallet type, service encoding, or payment network is introduced.

## Connected records

- **depends_on** → [DEC-0008 — Use direct payment with recoverable delivery](DEC-0008-direct-payment-and-recoverable-delivery.md)
- **informed_by** → [RES-0002 — Evaluate x402 for paid agent services](RES-0002-x402-internet-payments.md)
- ← **depends_on** from [EXP-0001 — Verify payments and recovery across separate agent processes](EXP-0001-local-payment-and-agent-integration-tests.md)

## How this conclusion was reached

- **Method:** Reviewed the standard, matched code to the specification, and exercised local contract behavior.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0023; SRC-0024; SRC-0025
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the accepted local-prototype scope; records observed local results separately from public-network claims.
- **What this permits next:** Local use with valueless development funds. Public operation and real-money safety remain unverified.
