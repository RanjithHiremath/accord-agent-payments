# Decentralized agent exchange protocol

Status: local prototype milestone complete. The working demonstration and locally
hosted marketing website are available at http://127.0.0.1:4317 while the launcher
is running. Public independent operation remains unvalidated; no real-money
deployment is claimed. See [validation evidence](VALIDATION.md).

## Goal

Build an open protocol through which independently operated AI agents can pay one another for goods or services without depending on a mandatory central operator, company account, or company-hosted payment server.

The protocol is a public specification and interoperable software run by participants. It necessarily runs on computers: decentralization means no mandatory single operator, not the absence of computers or networking.

## User requirements

- Designed for AI agents transacting with other AI agents online.
- Exchange money for goods or services, with a general-purpose design.
- Operate without dependence on our own server, analogous to the user's Bitcoin example.

## Selected first implementation

The user asked us to research both existing money networks and a new blockchain,
then delegated the implementation decision. The first prototype uses a local
Ethereum-compatible development chain, signed seller offers, a payment contract,
and a reproducible dataset-summary service. Currency is valueless development ETH.
No new currency is issued. See [the accepted implementation decision](logs/records/DEC-0007-existing-network-first-implementation.md).

## Delivered first milestone

A written specification and a runnable local reference demonstration with separate
buyer and seller programs. The demonstration includes a signed offer, acceptance
under a spending policy, development-chain payment, a verifiable receipt, and a
dataset-summary result. Both programs currently run on this computer. Local
execution does not establish a live decentralized payment network.

Later validation must show the same interaction across independent machines using the chosen network's test environment. A public launch, real funds, and production security are not established by a local demonstration.

## Architectural acceptance criteria to refine

1. No required platform account or centrally issued agent identity. Agents authenticate with keys; key ownership does not prove a unique person or honest reputation.
2. No required company-operated directory, relay, payment facilitator, or blockchain gateway. Optional providers must be replaceable; participants must have an independently operable path.
3. Settlement must prevent double spending through the selected money network. Signed messages alone are not money or settlement.
4. Payment authorization binds recipient, asset, network, amount, expiry, and the agreed exchange; replay and duplicate charging are addressed explicitly.
5. Spending limits are enforced outside the language model, including concurrent requests and fees. Agents do not receive unrestricted access to owner funds by default.
6. Payment finality, timeouts, retries, interrupted delivery, and refund conditions have explicit behavior.
7. Others can implement the public wire specification independently; passing interoperability tests is stronger evidence than two copies of the same client communicating.
8. Shutting down infrastructure operated by this project does not prevent existing independent participants from transacting. Discovery and new-participant bootstrapping must be assessed separately.

## Exchange limits

A payment receipt proves a payment under the settlement network's assumptions. It does not automatically prove that an answer is correct, a service is useful, or a physical item arrived. General-purpose payments can support arbitrary descriptions of goods or services; trustless delivery guarantees must be scoped to a specific verification mechanism. Escrow, arbitration, and delivery attestations each introduce their own assumptions.

## Existing foundations checked

- [x402 official repository](https://github.com/x402-foundation/x402): open internet payment standard, with multiple settlement schemes and networks. Its documented flow permits local verification and direct blockchain settlement, and its production guidance includes self-facilitation. Do not characterize a hosted facilitator as mandatory. This is a candidate foundation, not evidence that a new protocol is necessary.
- [L402 official documentation](https://docs.lightning.engineering/the-lightning-network/l402): HTTP payment challenges using Lightning invoices and tokens; payment proof grants access to digital services. Candidate if Bitcoin settlement matches the goal.
- [Ethereum nodes and clients](https://ethereum.org/developers/docs/nodes-and-clients): independently operated nodes provide a possible alternative to mandatory hosted gateways if an Ethereum-based design is chosen.

The comparison is captured in [the decision network](logs/INDEX.md), including
existing protocols, a new token, a separate blockchain, and a rollup. The prototype
does not claim wire compatibility with x402, L402, or AP2.

## Work log

- 2026-09-30: Registered the active goal, confirmed the project directory was empty, read parent workspace instructions, checked primary documentation for existing payment protocols, and requested the settlement-scope decision. No funds moved, services deployed, or protocol compatibility claimed.
- 2026-09-30: User selected research of both approaches, required connected and
  self-contained decision logs, requested Kalidasa, delegated development choices,
  authorized development dependencies, required clear naming, and requested a
  locally hosted marketing website. Recorded the resulting implementation choices
  in the append-only ledger. Payment, runtime, and website development underway.
- 2026-09-30: Completed Accord 0.1's local milestone: protocol specification,
  payment contract, separate buyer and seller programs, marketing website, and
  connected decision explorer. All 17 automated tests passed. Browser checks
  covered successful payment, duplicate-payment recovery, budget rejection,
  invalid inputs, linked explanations, and mobile layout. The ledger contains
  29 records, 30 sources, and 71 links. See [the decision network](logs/INDEX.md)
  and [validation evidence](VALIDATION.md). Independent public operation,
  durable shared budgets, interoperability, and production security remain open.

- 2026-09-30: Rechecked existing x402, L402, Machine Payments Protocol, and Agent Payments Protocol work. Recommended a public research release with explicit comparisons; novelty is not established and nothing was published. See [publication recommendation](logs/records/DEC-0015-public-research-release-and-existing-protocol-overlap.md).

- 2026-09-30: User authorized public publication. Prepared `RanjithHiremath/accord-agent-payments`, clarified role-specific names and the README, added contribution conventions and an MIT license, and reran all 17 tests successfully. See [release decision](logs/records/DEC-0016-publish-accord-agent-payments-research-repository.md).
