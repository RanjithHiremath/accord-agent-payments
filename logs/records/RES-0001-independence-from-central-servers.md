# RES-0001 — Define independence from central servers

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant interpretation of the user’s requirement; proposed acceptance test.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project must let two AI agents pay one another without relying on its creator to operate a service. A distributed network still needs participant computers, internet connections, and a way for participants to find each other.

## Terms used in this record

- **Node:** A participant computer running software that checks or exchanges network information.
- **Gateway:** A service through which software contacts a payment network.
- **Discovery:** Finding another participant’s address or offered service.
- **Bootstrapping:** How a new participant initially finds working peers.
- **Private key:** A secret used to authorize actions such as spending money.

## Concrete example

Turn off our website and every machine we operate. Two agents already run by other people should still exchange offers and payments. Separately test whether a brand-new agent can join without our directory.

## Why this log exists

I am writing this log to turn “nobody’s server” into a testable requirement.

## Question

Which dependencies would violate the requested independence?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Participant-operated nodes and replaceable discovery | More operating responsibility but removes a required company service. | watch |
| One mandatory hosted gateway and directory | Simpler setup but creates a central dependency. | reject |

## Recommendation or decision

Require a working path without our keys, database, directory, or gateway; test ongoing use and new-participant joining separately.

## Reasons

- The absence of a company website does not matter if payments still require its hidden gateway.
- Running several machines owned by one party does not demonstrate independence between operators.

## Evidence and references

- [SRC-0001 — User goal: agents exchanging money without a central server](../SOURCES.md#src-0001): The user requires independence from a central server.
- [SRC-0007 — Ethereum nodes and clients](../SOURCES.md#src-0007): An Ethereum participant can operate a node rather than require a particular hosted gateway.

## Uncertainties and next evidence needed

- Direct addresses, network access through home routers, discovery choices, and operating costs need implementation testing.

## Revisit when

A proposed component becomes mandatory for all participants.

## Connected records

- **depends_on** → [DEC-0001 — Define the agent payment protocol goal](DEC-0001-agent-payment-protocol-goal.md)
- ← **informed_by** from [RES-0002 — Evaluate x402 for paid agent services](RES-0002-x402-internet-payments.md)
- ← **informed_by** from [RES-0003 — Evaluate Bitcoin, Lightning, and L402](RES-0003-bitcoin-lightning-and-l402.md)
- ← **informed_by** from [RES-0006 — Separate currency control from network control](RES-0006-currency-control-and-value.md)
- ← **informed_by** from [RES-0008 — Evaluate a new independently operated blockchain](RES-0008-new-blockchain-security-and-operations.md)
- ← **informed_by** from [DEC-0005 — Propose the first demonstration and its success criteria](DEC-0005-first-demonstration-success-criteria.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0001; SRC-0007
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
