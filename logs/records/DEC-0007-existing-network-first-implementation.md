# DEC-0007 — Use an Ethereum-compatible local chain for version 0.1

Status: **accepted** · Recorded: 2026-09-30T05:58:45Z

Decision authority: Assistant decision under the user’s delegated development authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project has compared existing money networks, a new token, a new blockchain, and a rollup. The first deliverable needs a runnable agent exchange with verifiable payment behavior. A local Ethereum-compatible chain lets us exercise payment rules without issuing a public currency.

## Terms used in this record

- **Ethereum Virtual Machine (EVM):** The execution system used by Ethereum-compatible networks to run contract programs.
- **Smart contract:** A program executed under a blockchain’s rules.
- **ETH:** The currency used for payment and transaction fees on Ethereum; this demonstration uses only valueless development balances.
- **Settlement:** The payment transfer recorded under the chosen network’s rules.
- **Adapter:** A software component connecting shared protocol rules to a specific payment network.

## Concrete example

One agent signs a price offer. Another signs a transaction that pays the stated seller through a contract. A local chain executes the transfer and exposes a receipt that both programs can check.

## Why this log exists

I am writing this log to choose the first implementation after researching both existing and new money networks.

## Question

Which settlement environment should the first working prototype use?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Ethereum-compatible local chain and a small payment contract | Makes quote binding and repeat-payment prevention directly testable without real funds. | accept |
| Lightning first | A valid candidate but adds channel capacity and node-operation work before the first demonstration. | watch |
| New independent blockchain | Allows custom monetary rules but none are yet necessary for the selected service. | watch |
| New token or rollup | Adds monetary or operating components without a demonstrated current need. | watch |

## Recommendation or decision

Implement the first payment adapter against a local EVM with native development ETH. Keep the agent agreement separate from the network; create no new currency.

## Reasons

- The project can test exact payment, recipient binding, and repeated-request behavior directly.
- The research did not establish a requirement that needs a new consensus network.
- This is an engineering selection for a prototype, not evidence that Ethereum is best for every future workload.

## Evidence and references

- [SRC-0019 — User delegation and local website request](../SOURCES.md#src-0019): The user delegates the implementation decision.
- [SRC-0022 — Local implementation contract](../SOURCES.md#src-0022): The integration contract specifies the local chain and signed payment flow.

## Uncertainties and next evidence needed

- No live network is selected. A local chain operated on one machine is not decentralized.
- The first custom offer format is not claimed to interoperate with x402, L402, or AP2.

## Revisit when

Measured fees, timing, privacy, or monetary requirements favor another adapter or a separate network.

## Connected records

- **supersedes** → [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- **depends_on** → [DEC-0006 — Deliver a local prototype and marketing website](DEC-0006-autonomous-local-prototype-and-website.md)
- **informed_by** → [RES-0008 — Evaluate a new independently operated blockchain](RES-0008-new-blockchain-security-and-operations.md)
- **informed_by** → [RES-0003 — Evaluate Bitcoin, Lightning, and L402](RES-0003-bitcoin-lightning-and-l402.md)
- ← **depends_on** from [DEC-0008 — Use direct payment with recoverable delivery](DEC-0008-direct-payment-and-recoverable-delivery.md)
- ← **depends_on** from [DEC-0012 — Replace the initial development-chain dependency](DEC-0012-anvil-and-patched-development-dependencies.md)

## How this conclusion was reached

- **Method:** Recorded user delegation and made an implementation choice; test results are recorded separately.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0019; SRC-0022
- **Options compared (not an exhaustive search):** 4
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the decentralized agent-payment objective and the user’s independent-reader logging requirement.
- **What this permits next:** Proceed with local development and testing using valueless development funds. No claim of public-network readiness.
