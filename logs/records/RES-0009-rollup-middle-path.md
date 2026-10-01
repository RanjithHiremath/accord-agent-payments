# RES-0009 — Evaluate a rollup as an intermediate option

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant research; not selected.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

Between using an existing network directly and starting an independent blockchain, the project could operate a separate transaction-processing system that settles results on a parent chain. This can allow specialized execution while retaining parent-chain dependencies.

## Terms used in this record

- **Rollup:** A system that processes transactions separately and submits the information or proofs needed for its parent-chain settlement rules.
- **Parent chain:** The blockchain used to settle the rollup’s results.
- **Sequencer:** A component that orders transactions for processing.
- **Data availability:** Whether participants can obtain the transaction data needed to verify or reconstruct the state.
- **Upgrade authority:** Who can change the programs or rules used by the system.

## Concrete example

Agents could transact on a dedicated rollup, while its results are settled on Ethereum. If one company runs the only sequencer, fast operation may still depend on that company even when slower recovery paths exist.

## Why this log exists

I am writing this log to examine an option between full reuse and a fully separate chain.

## Question

Does a dedicated rollup provide needed control without taking on an independent consensus network?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Operate a rollup | More execution control, but adds sequencing, proof, data, and upgrade responsibilities. | watch |
| Use an existing network directly | Fewer components for the first demonstration. | watch |

## Recommendation or decision

Treat a rollup as a later option unless measured requirements justify its additional components.

## Reasons

- A parent chain can support settlement without removing every operator dependency.
- The architecture must assess transaction ordering and upgrade control as well as settlement.

## Evidence and references

- [SRC-0015 — OP Stack architecture](../SOURCES.md#src-0015): OP Stack documents separate transaction-processing and parent-settlement roles.

## Uncertainties and next evidence needed

- No specific rollup configuration, forced-inclusion behavior, cost, or recovery path has been evaluated.

## Revisit when

The project has evidence that dedicated execution capacity or custom processing is needed.

## Connected records

- **depends_on** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- **informed_by** → [RES-0008 — Evaluate a new independently operated blockchain](RES-0008-new-blockchain-security-and-operations.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0015
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
