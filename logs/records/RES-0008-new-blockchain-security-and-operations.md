# RES-0008 — Evaluate a new independently operated blockchain

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant research; a new blockchain is not selected.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project could build its own money network to control how agents pay, how fees work, and how its currency is issued. That would also make the project responsible for establishing a network of independent operators and incentives to keep it secure.

## Terms used in this record

- **Consensus:** Rules participants use to agree on one valid transaction history.
- **Validator:** An operator that participates in checking and agreeing on transactions.
- **Voting power:** The weight assigned to a validator’s votes; counting machines alone can be misleading.
- **Proof of stake:** A design connecting participation or voting weight to value committed under the network’s rules.
- **Proof of work:** A design using costly computation to help determine the accepted transaction history.
- **Sovereign chain:** A blockchain with its own consensus and governance rather than relying on another chain to settle its history.
- **Cosmos SDK:** A software toolkit for building application-specific blockchains.
- **CometBFT:** A consensus engine that can replicate an application across participants.
- **Governance:** The process for deciding and adopting changes to the network’s rules.

## Concrete example

Running four copies of a new chain on machines we own demonstrates replicated software. It does not demonstrate four independent organizations or protect the system from us shutting everything down.

## Why this log exists

I am writing this log to assess the benefits and responsibilities of building the money network itself.

## Question

Would agent-specific rules justify operating a new blockchain?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Own chain using an established toolkit | Allows custom payment and fee rules; still needs independent operators and security incentives. | watch |
| Own proof-of-work currency | Allows a Bitcoin-like design; must attract independent computing power and finance its operation. | watch |
| Existing settlement network | Less control over network rules but avoids starting consensus security from zero. | watch |

## Recommendation or decision

Keep a new chain as a conditional option. Require a concrete unmet payment requirement and an independent-operator plan before committing.

## Reasons

- Frameworks reduce software construction work but do not supply an independent operator community.
- For CometBFT, the relevant fault assumptions concern voting power, not merely the number of servers.
- Design inference: control over rules is valuable only if it justifies the ongoing cost of security, upgrades, and participation.

## Evidence and references

- [SRC-0012 — Cosmos SDK official repository](../SOURCES.md#src-0012): Cosmos SDK supplies customizable blockchain software.
- [SRC-0013 — CometBFT introduction and voting power](../SOURCES.md#src-0013): CometBFT separates application logic and consensus and explains voting-power assumptions.
- [SRC-0014 — Bitcoin whitepaper](../SOURCES.md#src-0014): Bitcoin ties its transaction history and incentives to proof of work.

## Uncertainties and next evidence needed

- Who operates the network, how voting power is distributed, and how security is funded are unresolved.
- No chain, attack-cost model, or operator recruitment experiment has been run.

## Revisit when

A measured limitation of existing networks requires custom native rules, or independent monetary governance becomes an explicit requirement.

## Connected records

- **depends_on** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- **informed_by** → [RES-0001 — Define independence from central servers](RES-0001-independence-from-central-servers.md)
- **informed_by** → [RES-0007 — Evaluate a new token on an existing network](RES-0007-new-token-existing-network.md)
- ← **informed_by** from [RES-0009 — Evaluate a rollup as an intermediate option](RES-0009-rollup-middle-path.md)
- ← **constrains** from [RES-0010 — Distinguish payment from successful service delivery](RES-0010-payment-versus-service-delivery.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- ← **informed_by** from [DEC-0007 — Use an Ethereum-compatible local chain for version 0.1](DEC-0007-existing-network-first-implementation.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0012; SRC-0013; SRC-0014
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
