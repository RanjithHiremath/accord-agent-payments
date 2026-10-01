# RES-0010 — Distinguish payment from successful service delivery

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant design analysis; delivery guarantee remains undecided.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The user wants agents to exchange money for anything. General payment messages can describe many purchases, but recording payment does not establish that an answer was correct or a physical delivery happened.

## Terms used in this record

- **Payment receipt:** Evidence of a payment result, under the network and software that checked it.
- **Escrow:** Funds held under specified release or refund conditions.
- **Oracle:** A source or mechanism that supplies information from outside a blockchain to its programs.
- **Arbitration:** A chosen party or process resolving a disagreement.
- **Fair exchange:** A property where neither side can obtain the other’s item without providing the agreed exchange, under explicit assumptions.

## Concrete example

An agent pays for a market report and receives an empty file. The money transfer may be valid even though the service was not delivered as promised. A rule checking only that some file arrived would not resolve the problem.

## Why this log exists

I am writing this log to prevent a payment guarantee from being mistaken for a guarantee about arbitrary goods or work.

## Question

What can the first version honestly guarantee about the purchased service?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Payment plus explicitly stated seller trust | Broad applicability, but buyer can be disappointed after paying. | watch |
| Release payment only for a narrowly checkable result | Stronger guarantee for some tasks; requires a precise verification rule. | watch |
| Escrow with buyer acceptance or a chosen dispute process | Supports more subjective work but adds disputes, timeouts, and trust assumptions. | watch |

## Recommendation or decision

Choose one clearly defined digital service for the first demonstration and state its delivery assumption. Do not promise trustless exchange for arbitrary services.

## Reasons

- A blockchain cannot independently observe every fact about work performed outside it.
- Holding funds does not tell the system whether a disputed answer is useful.
- A new currency or blockchain does not by itself solve this verification problem.

## Evidence and references

- [SRC-0016 — Ethereum oracle documentation](../SOURCES.md#src-0016): Oracle documentation describes the need for mechanisms to bring external information to blockchain programs.
- [SRC-0001 — User goal: agents exchanging money without a central server](../SOURCES.md#src-0001): The user’s intended scope includes goods and services generally.

## Uncertainties and next evidence needed

- The first service, refund policy, and acceptable dispute assumptions remain unspecified.

## Revisit when

A particular service and verifiable delivery condition are selected.

## Connected records

- **depends_on** → [DEC-0001 — Define the agent payment protocol goal](DEC-0001-agent-payment-protocol-goal.md)
- **constrains** → [RES-0008 — Evaluate a new independently operated blockchain](RES-0008-new-blockchain-security-and-operations.md)
- **constrains** → [RES-0002 — Evaluate x402 for paid agent services](RES-0002-x402-internet-payments.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- ← **informed_by** from [DEC-0005 — Propose the first demonstration and its success criteria](DEC-0005-first-demonstration-success-criteria.md)
- ← **informed_by** from [DEC-0008 — Use direct payment with recoverable delivery](DEC-0008-direct-payment-and-recoverable-delivery.md)
- ← **informed_by** from [RES-0011 — Record the remaining local trust boundaries](RES-0011-remaining-trust-and-local-rpc-boundaries.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0016; SRC-0001
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
