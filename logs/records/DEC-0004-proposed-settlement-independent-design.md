# DEC-0004 — Propose a protocol separable from its money network

Status: **proposed** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant recommendation following research; not a user-approved architecture.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project is comparing ways for independent AI agents to exchange money. Research found existing payment protocols and several ways to supply the underlying money network. We can keep the agreement between agents separate from the particular payment system used.

## Terms used in this record

- **Settlement adapter:** Software translating an agreed payment request into one specific money network’s operations and checking the result.
- **Interoperability:** Different implementations can understand and correctly use the same rules.
- **Reference implementation:** Example working software showing how a specification can be implemented.
- **Noncustodial:** The participant controls the keys that spend its funds rather than giving control to a provider.

## Concrete example

Two agents agree on the task, price, recipient, and currency. A Bitcoin-specific payment component handles a Bitcoin payment; a different component could later handle another network without changing the description of the task.

## Why this log exists

I am writing this log to turn the comparison into a provisional engineering recommendation.

## Question

Which first architecture best advances the goal without prematurely creating a new currency?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Existing money with separately specified agent agreement rules | Focuses on exchange and interoperability while retaining established network dependencies. | watch |
| New token on an existing chain | Adds monetary control without network independence. | watch |
| Own chain | Maximum rule control with substantial security and operational obligations. | watch |
| Own rollup | Adds processing control while retaining parent-chain and operator dependencies. | watch |

## Recommendation or decision

Provisionally favor an existing-money prototype with replaceable settlement components. Keep a new chain available if concrete requirements justify it. No network or currency is selected by this record.

## Reasons

- Existing standards cover substantial portions of payment request and proof exchange.
- A new network is not necessary solely because buyers and sellers are AI agents.
- Keeping the payment component separate makes later comparison possible without rewriting every agent interaction.

## Evidence and references

- [SRC-0004 — x402 official repository](../SOURCES.md#src-0004): x402 demonstrates a reusable internet-payment flow.
- [SRC-0005 — L402 official documentation](../SOURCES.md#src-0005): L402 provides an existing Bitcoin-based service-payment pattern.
- [SRC-0012 — Cosmos SDK official repository](../SOURCES.md#src-0012): A separate chain can be constructed with a framework, but construction is a distinct responsibility.

## Uncertainties and next evidence needed

- Required payment size, rate, privacy, and delivery guarantees still need definition.
- The recommendation is based on architecture review, not comparative performance tests.

## Revisit when

A concrete requirement or comparative experiment makes the proposed first approach unsuitable.

## Connected records

- **depends_on** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- **informed_by** → [RES-0002 — Evaluate x402 for paid agent services](RES-0002-x402-internet-payments.md)
- **informed_by** → [RES-0003 — Evaluate Bitcoin, Lightning, and L402](RES-0003-bitcoin-lightning-and-l402.md)
- **informed_by** → [RES-0004 — Evaluate Machine Payments Protocol](RES-0004-machine-payments-protocol.md)
- **informed_by** → [RES-0005 — Evaluate spending authorization with AP2](RES-0005-agent-payment-authorization.md)
- **informed_by** → [RES-0006 — Separate currency control from network control](RES-0006-currency-control-and-value.md)
- **informed_by** → [RES-0007 — Evaluate a new token on an existing network](RES-0007-new-token-existing-network.md)
- **informed_by** → [RES-0008 — Evaluate a new independently operated blockchain](RES-0008-new-blockchain-security-and-operations.md)
- **informed_by** → [RES-0009 — Evaluate a rollup as an intermediate option](RES-0009-rollup-middle-path.md)
- **informed_by** → [RES-0010 — Distinguish payment from successful service delivery](RES-0010-payment-versus-service-delivery.md)
- ← **depends_on** from [DEC-0005 — Propose the first demonstration and its success criteria](DEC-0005-first-demonstration-success-criteria.md)
- ← **supersedes** from [DEC-0007 — Use an Ethereum-compatible local chain for version 0.1](DEC-0007-existing-network-first-implementation.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0004; SRC-0005; SRC-0012
- **Options compared (not an exhaustive search):** 4
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
