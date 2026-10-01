# RES-0005 — Evaluate spending authorization with AP2

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant research; not selected.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

An AI agent may suggest a purchase, but the system still needs to enforce what its owner has permitted it to spend. Agent Payments Protocol provides a model for representing authorization; this is a different problem from moving money.

## Terms used in this record

- **Agent Payments Protocol (AP2):** A protocol describing evidence that an agent is authorized to make a particular purchase and payment.
- **Mandate:** A signed statement giving authority to perform a constrained action.
- **Deterministic validation:** Checking the same rules in ordinary code so the same inputs produce the same result, rather than asking a language model to judge each payment.
- **Spending policy:** Rules such as maximum total amount, allowed recipients, and expiry time.

## Concrete example

An owner allows an agent to spend up to a small budget on weather data. The agent’s payment request is checked against that permission before any money can leave the wallet.

## Why this log exists

I am writing this log to separate permission to spend from the mechanism that transfers funds.

## Question

How should owner permission be enforced when agents can decide to buy services?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Signed, limited permissions checked by ordinary code | Provides explicit constraints but needs careful handling of concurrent spending. | watch |
| Let the language model decide whether spending is allowed | Simple but cannot reliably enforce a hard spending boundary. | reject |

## Recommendation or decision

Use explicit spending limits outside the language model; evaluate AP2 concepts before selecting an authorization format.

## Reasons

- AP2 distinguishes authority to purchase from payment execution.
- A spending limit must remain effective even if an agent misunderstands a seller’s message.

## Evidence and references

- [SRC-0009 — Agent Payments Protocol specification](../SOURCES.md#src-0009): The specification defines mandates and requires validation in deterministic code.

## Uncertainties and next evidence needed

- Delegation, budget reservation, fees, and concurrent requests need a concrete design.
- No compatibility with AP2 is claimed.

## Revisit when

The wallet integration and owner permission model are specified.

## Connected records

- **depends_on** → [DEC-0001 — Define the agent payment protocol goal](DEC-0001-agent-payment-protocol-goal.md)
- **informed_by** → [RES-0002 — Evaluate x402 for paid agent services](RES-0002-x402-internet-payments.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- ← **informed_by** from [DEC-0015 — Recommend a public research release with explicit existing-protocol comparisons](DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0009
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
