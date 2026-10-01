# RES-0004 — Evaluate Machine Payments Protocol

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant research; not selected.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project is comparing existing rules for software paying software. Machine Payments Protocol is another candidate for expressing a request for payment and presenting the resulting proof across different payment methods.

## Terms used in this record

- **Machine Payments Protocol (MPP):** A payment protocol for programs using HTTP requests and responses.
- **Payment challenge:** A seller’s message describing the payment needed to access a resource.
- **Credential:** Information the buyer presents for the seller to check, such as payment evidence.
- **Payment method:** The specific way money moves, such as a transfer on a particular network.
- **Receipt:** A record of a payment result; its meaning depends on what was verified.
- **HTTP:** The request-and-response protocol used by many internet services.

## Concrete example

An agent requests a paid calculation, receives a payment challenge, pays using a mutually supported method, and retries with payment evidence.

## Why this log exists

I am writing this log to avoid comparing only one existing machine-payment standard.

## Question

Does MPP offer a useful foundation for the agent payment protocol?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Evaluate MPP alongside x402 and L402 | Broader comparison; requires method-specific checks. | watch |
| Ignore alternative standards | Less research but risks duplicating an existing solution. | reject |

## Recommendation or decision

Compare MPP’s method and receipt rules with the project’s independence and retry requirements.

## Reasons

- Its documented structure separates a payment challenge from the method used to satisfy it.
- Supporting many payment methods does not mean each method avoids centralized operators.

## Evidence and references

- [SRC-0008 — Machine Payments Protocol overview](../SOURCES.md#src-0008): The retrieved official overview describes challenge, credential, verification, and payment-method extensions.

## Uncertainties and next evidence needed

- The source was retrieved through Exa; direct page opening failed in the built-in browser tool.
- No method implementation or failure-recovery behavior has been tested.

## Revisit when

We select a currency and evaluate the actual software supporting that payment method.

## Connected records

- **depends_on** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- **informed_by** → [RES-0002 — Evaluate x402 for paid agent services](RES-0002-x402-internet-payments.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- ← **informed_by** from [DEC-0015 — Recommend a public research release with explicit existing-protocol comparisons](DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0008
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
