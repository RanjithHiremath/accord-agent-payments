# DEC-0009 — Require names that explain their purpose

Status: **accepted** · Recorded: 2026-09-30T05:58:45Z

Decision authority: User requested meaningful names; assistant applies the convention project-wide.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The protocol contains similar concepts such as a requested payment, a completed transfer, and a delivered service result. Ambiguous names would make both the code and the user interface difficult to review.

## Terms used in this record

- **Identifier:** A name used for a value, function, or field in a program.
- **Unit suffix:** A unit written in the name, such as amountWei, to prevent confusing amounts measured differently.
- **Wei:** The smallest unit of ETH; one ETH equals 10^18 wei.
- **Semantic name:** A name describing the thing’s role, such as sellerAddress or transactionHash.

## Concrete example

Use buyerAddress and sellerAddress instead of address1 and address2; show “Payment receipt” and “Dataset summary” as separate results.

## Why this log exists

I am writing this log to turn the user’s naming requirement into a reviewable project convention.

## Question

How should program values and returned results be named?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Domain-specific names with explicit roles and units | Longer names, but code and output explain their purpose. | accept |
| Single-letter and generic temporary names | Shorter typing but forces readers to infer context. | reject |

## Recommendation or decision

Use descriptive names, explicit wallet roles, and amount/time units. Review website labels and return objects as carefully as internal code.

## Reasons

- The user explicitly identified unclear names as a recurring problem.
- Payment code is easier to review when quantities and roles cannot be confused.

## Evidence and references

- [SRC-0020 — User naming and installation requirements](../SOURCES.md#src-0020): The user requires context-related names in code and outputs.

## Uncertainties and next evidence needed

- Naming quality requires manual review; a structural check alone cannot judge whether a term is understandable.

## Revisit when

A reviewer cannot explain a field without tracing unrelated code.

## Connected records

- **implements** → [DEC-0002 — Maintain self-contained linked decision logs](DEC-0002-self-contained-linked-decision-logs.md)
- **depends_on** → [DEC-0006 — Deliver a local prototype and marketing website](DEC-0006-autonomous-local-prototype-and-website.md)
- ← **informed_by** from [DEC-0010 — Apply Kalidasa to documentation and website copy](DEC-0010-kalidasa-reader-first-writing.md)
- ← **implements** from [EXP-0002 — Verify the website and readable decision network](EXP-0002-website-and-decision-network-browser-checks.md)
- ← **depends_on** from [DEC-0016 — Publish Accord with clear names and a reproducible research scope](DEC-0016-publish-accord-agent-payments-research-repository.md)

## How this conclusion was reached

- **Method:** Recorded user delegation and made an implementation choice; test results are recorded separately.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0020
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the decentralized agent-payment objective and the user’s independent-reader logging requirement.
- **What this permits next:** Proceed with local development and testing using valueless development funds. No claim of public-network readiness.
