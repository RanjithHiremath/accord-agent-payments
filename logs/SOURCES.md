# Source catalog

Sources support the stated claims, not every recommendation in a linked record.

## SRC-0001

**User goal: agents exchanging money without a central server**

Type: conversation · Consulted: 2026-09-30

This project chat: user message beginning “No. What I want you to build is a protocol…”

User requirement; not evidence that such a system has been built.

Used by: [DEC-0001](records/DEC-0001-agent-payment-protocol-goal.md), [RES-0001](records/RES-0001-independence-from-central-servers.md), [RES-0010](records/RES-0010-payment-versus-service-delivery.md), [DEC-0005](records/DEC-0005-first-demonstration-success-criteria.md)

## SRC-0002

**User instruction: research both settlement approaches**

Type: conversation · Consulted: 2026-09-30

This project chat: response “Research both before choosing” to the existing-network versus new-blockchain question.

Direct instruction to investigate both approaches, not approval of either.

Used by: [DEC-0003](records/DEC-0003-research-both-settlement-paths.md)

## SRC-0003

**User instruction: connected and self-contained logs**

Type: conversation · Consulted: 2026-09-30

This project chat: messages beginning “Throughout the entire project maintain structured logs…” and “The log should be written so that when you read it without any context…”

Requires named, linked records of topics and decisions, reasons, alternatives, references, and local definitions.

Used by: [DEC-0002](records/DEC-0002-self-contained-linked-decision-logs.md), [DEC-0010](records/DEC-0010-kalidasa-reader-first-writing.md)

## SRC-0004

**x402 official repository**

Type: web · Consulted: 2026-09-30

[Primary source](https://github.com/x402-foundation/x402)

Read the overview, production facilitator choices, and payment flow. Source changes over time; no implementation tested here.

Used by: [RES-0002](records/RES-0002-x402-internet-payments.md), [DEC-0004](records/DEC-0004-proposed-settlement-independent-design.md), [DEC-0005](records/DEC-0005-first-demonstration-success-criteria.md)

## SRC-0005

**L402 official documentation**

Type: web · Consulted: 2026-09-30

[Primary source](https://docs.lightning.engineering/the-lightning-network/l402)

Read the request, invoice, payment proof, and token flow.

Used by: [RES-0003](records/RES-0003-bitcoin-lightning-and-l402.md), [DEC-0004](records/DEC-0004-proposed-settlement-independent-design.md)

## SRC-0006

**Lightning liquidity explained**

Type: web · Consulted: 2026-09-30

[Primary source](https://docs.lightning.engineering/the-lightning-network/liquidity/understanding-liquidity)

Reviewed inbound capacity, outbound capacity, channel allocation, and peer availability.

Used by: [RES-0003](records/RES-0003-bitcoin-lightning-and-l402.md)

## SRC-0007

**Ethereum nodes and clients**

Type: web · Consulted: 2026-09-30

[Primary source](https://ethereum.org/developers/docs/nodes-and-clients)

Consulted for independently operated nodes as an alternative to a required hosted gateway.

Used by: [RES-0001](records/RES-0001-independence-from-central-servers.md)

## SRC-0008

**Machine Payments Protocol overview**

Type: web · Consulted: 2026-09-30

[Primary source](https://mpp.dev/protocol)

Retrieved through Agent Reach Exa search; direct built-in web opening returned an error. Protocol overview covered challenges, credentials, methods, and receipts.

Used by: [RES-0004](records/RES-0004-machine-payments-protocol.md)

## SRC-0009

**Agent Payments Protocol specification**

Type: web · Consulted: 2026-09-30

[Primary source](https://ap2-protocol.org/ap2/specification/)

Consulted the specification on authorization mandates and deterministic validation; no integration tested.

Used by: [RES-0005](records/RES-0005-agent-payment-authorization.md)

## SRC-0010

**Circle USDC terms**

Type: web · Consulted: 2026-09-30

[Primary source](https://www.circle.com/legal/usdc-terms)

Consulted the issuer blocklisting provisions to assess centralized asset controls, not to provide legal advice.

Used by: [RES-0006](records/RES-0006-currency-control-and-value.md)

## SRC-0011

**Ethereum ERC-20 token standard**

Type: web · Consulted: 2026-09-30

[Primary source](https://ethereum.org/developers/docs/standards/tokens/erc-20/)

Consulted for tokens maintained by contracts on an existing chain.

Used by: [RES-0007](records/RES-0007-new-token-existing-network.md)

## SRC-0012

**Cosmos SDK official repository**

Type: web · Consulted: 2026-09-30

[Primary source](https://github.com/cosmos/cosmos-sdk)

Consulted the framework for customizable blockchains. A framework is not a supplied independent validator network.

Used by: [RES-0008](records/RES-0008-new-blockchain-security-and-operations.md), [DEC-0004](records/DEC-0004-proposed-settlement-independent-design.md)

## SRC-0013

**CometBFT introduction and voting power**

Type: web · Consulted: 2026-09-30

[Primary source](https://docs.cosmos.network/cometbft/latest/docs/introduction/intro)

Read application/consensus separation, consensus overview, and stake section clarifying voting power.

Used by: [RES-0008](records/RES-0008-new-blockchain-security-and-operations.md)

## SRC-0014

**Bitcoin whitepaper**

Type: web · Consulted: 2026-09-30

[Primary source](https://bitcoin.org/bitcoin.pdf)

Consulted the proof-of-work and incentive design as a comparison for launching a new network.

Used by: [RES-0006](records/RES-0006-currency-control-and-value.md), [RES-0008](records/RES-0008-new-blockchain-security-and-operations.md)

## SRC-0015

**OP Stack architecture**

Type: web · Consulted: 2026-09-30

[Primary source](https://docs.optimism.io/op-stack/architecture)

Consulted the roles of parent settlement, transaction processing, and supporting infrastructure for a rollup.

Used by: [RES-0009](records/RES-0009-rollup-middle-path.md)

## SRC-0016

**Ethereum oracle documentation**

Type: web · Consulted: 2026-09-30

[Primary source](https://ethereum.org/developers/docs/oracles/)

Consulted the boundary between on-chain execution and information from outside the chain.

Used by: [RES-0010](records/RES-0010-payment-versus-service-delivery.md), [DEC-0008](records/DEC-0008-direct-payment-and-recoverable-delivery.md)

## SRC-0017

**Agent Reach live search result in this session**

Type: tool_result · Consulted: 2026-09-30

This project chat: Agent Reach doctor, restricted Exa request, and network-enabled Exa retry on 2026-09-30.

Doctor found configuration but did not verify Exa. Initial request failed to resolve mcp.exa.ai; retry with network access returned nonempty AP2 and MPP search results.

Used by: [OPS-0001](records/OPS-0001-agent-reach-search-validation.md)

## SRC-0018

**Recursive decision ledger skill used for log design**

Type: local_file · Consulted: 2026-09-30

~/.agents/skills/ecc/recursive-decision-ledger/SKILL.md

Consulted append-only JSONL, human-readable summaries, evidence, option marks, and promotion gates; no optimization trials are implied.

Used by: [DEC-0002](records/DEC-0002-self-contained-linked-decision-logs.md)

## SRC-0019

**User delegation and local website request**

Type: conversation · Consulted: 2026-09-30

This project chat: “Okay I’m sleeping now. You are free to take any decisions…” and the instruction to create a locally hosted marketing website.

Authorizes development choices, local implementation, and a marketing site; this is not evidence of a completed public network.

Used by: [DEC-0006](records/DEC-0006-autonomous-local-prototype-and-website.md), [DEC-0007](records/DEC-0007-existing-network-first-implementation.md), [DEC-0011](records/DEC-0011-local-marketing-site-and-working-demo.md)

## SRC-0020

**User naming and installation requirements**

Type: conversation · Consulted: 2026-09-30

This project chat: the naming critique and “If you need any libraries or anything else that needs to be installed, you’re free to install them also for this development environment.”

Requires understandable names and authorizes development dependency installation.

Used by: [DEC-0009](records/DEC-0009-clear-domain-names-and-output-labels.md)

## SRC-0021

**Kalidasa writing skill**

Type: local_file · Consulted: 2026-09-30

~/.agents/skills/kalidasa/SKILL.md

Read the full skill. Applied reader diagnosis, definitions before reliance, concrete examples, and claims tied to evidence. No claim of increased model intelligence or guaranteed writing quality.

Used by: [DEC-0010](records/DEC-0010-kalidasa-reader-first-writing.md)

## SRC-0022

**Local implementation contract**

Type: local_file · Consulted: 2026-09-30

IMPLEMENTATION.md in this project folder

Records the initial integration boundaries and interface shared by the payment, runtime, and website work. This document describes intended behavior, not test results.

Used by: [DEC-0007](records/DEC-0007-existing-network-first-implementation.md), [DEC-0008](records/DEC-0008-direct-payment-and-recoverable-delivery.md), [DEC-0011](records/DEC-0011-local-marketing-site-and-working-demo.md)

## SRC-0023

**EIP-712 structured-data signing standard**

Type: web · Consulted: 2026-09-30

[Primary source](https://eips.ethereum.org/EIPS/eip-712)

Read domain separation, typed fields, and the explicit statement that the standard does not itself provide replay protection.

Used by: [DEC-0013](records/DEC-0013-structured-offers-and-single-payment-record.md)

## SRC-0024

**Current contract and protocol implementation**

Type: local_file · Consulted: 2026-09-30

contracts/AccordPayments.sol, lib/protocol.mjs, and PROTOCOL.md

Reviewed actual code for quote binding, signature encoding, fee limits, payment recording, and receipt recovery. See the tests for observed results.

Used by: [DEC-0013](records/DEC-0013-structured-offers-and-single-payment-record.md), [RES-0011](records/RES-0011-remaining-trust-and-local-rpc-boundaries.md)

## SRC-0025

**Full local automated test output**

Type: local_file · Consulted: 2026-09-30

artifacts/test-results.txt

Saved full run: 17 tests passed, zero failed, using actual temporary Anvil chains and separate seller/buyer processes.

Used by: [DEC-0012](records/DEC-0012-anvil-and-patched-development-dependencies.md), [DEC-0013](records/DEC-0013-structured-offers-and-single-payment-record.md), [EXP-0001](records/EXP-0001-local-payment-and-agent-integration-tests.md), [DEC-0014](records/DEC-0014-local-milestone-handoff.md), [DEC-0015](records/DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## SRC-0026

**Dependency advisory response**

Type: local_file · Consulted: 2026-09-30

artifacts/dependency-audit.json

Final npm audit response reports zero known vulnerabilities. Initial Ganache-based tree reported 36; replacing it and updating dependencies removed those reported advisories. Not an independent software audit.

Used by: [DEC-0012](records/DEC-0012-anvil-and-patched-development-dependencies.md), [OPS-0002](records/OPS-0002-dependency-and-research-tool-verification.md), [DEC-0014](records/DEC-0014-local-milestone-handoff.md)

## SRC-0027

**Browser acceptance observations**

Type: local_file · Consulted: 2026-09-30

artifacts/validation-summary.json, artifacts/accord-desktop.png, artifacts/accord-mobile.png

Observed successful payment, retry, budget rejection, invalid-input message, connected record selection, and desktop/mobile layouts through the in-app browser.

Used by: [EXP-0002](records/EXP-0002-website-and-decision-network-browser-checks.md), [DEC-0014](records/DEC-0014-local-milestone-handoff.md)

## SRC-0028

**Independent code review and disposable-chain probes**

Type: tool_result · Consulted: 2026-09-30

This project chat: independent protocol_requirements review and development-chain regression tests on 2026-09-30. Findings are documented in SECURITY.md and VALIDATION.md.

Reproduced mixed provider identity, occupied-port startup, and raw Anvil foreign Host/Origin administration. First two fixed and regression-tested; raw local administration remains an explicit development limitation.

Used by: [EXP-0001](records/EXP-0001-local-payment-and-agent-integration-tests.md), [RES-0011](records/RES-0011-remaining-trust-and-local-rpc-boundaries.md)

## SRC-0029

**Anvil executable and current installation**

Type: tool_result · Consulted: 2026-09-30

Project-local @foundry-rs/anvil --version and --help; package.json and package-lock.json

Verified native Anvil 1.7.1 startup on this machine, chain ID 31337, no unlocked accounts, and explicit development funding.

Used by: [DEC-0012](records/DEC-0012-anvil-and-patched-development-dependencies.md), [OPS-0002](records/OPS-0002-dependency-and-research-tool-verification.md)

## SRC-0030

**Agent Reach version check**

Type: tool_result · Consulted: 2026-09-30

Agent Reach check-update run in this project session on 2026-09-30

Read-only check reported installed v1.5.0 as current; no update performed.

Used by: [OPS-0002](records/OPS-0002-dependency-and-research-tool-verification.md)

## SRC-0031

**x402 current public implementation**

Type: web · Consulted: 2026-09-30

[Primary source](https://github.com/x402-foundation/x402)

Verified open payment standard, existing implementations, and options to run a facilitator or self-facilitate.

Used by: [DEC-0015](records/DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## SRC-0032

**L402 current payment and access flow**

Type: web · Consulted: 2026-09-30

[Primary source](https://docs.lightning.engineering/the-lightning-network/l402)

Verified Lightning payment followed by proof-based access and existing Aperture implementation.

Used by: [DEC-0015](records/DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## SRC-0033

**Machine Payments Protocol specification**

Type: web · Consulted: 2026-09-30

[Primary source](https://github.com/tempoxyz/mpp-specs)

Verified machine-to-machine payment challenge, payment credential, resource access, and multiple payment methods.

Used by: [DEC-0015](records/DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## SRC-0034

**Agent Payments Protocol overview**

Type: web · Consulted: 2026-09-30

[Primary source](https://ap2-protocol.org/)

Verified focus on authorization, authenticity, accountability, and agent commerce.

Used by: [DEC-0015](records/DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## SRC-0035

**User authorization for public repository**

Type: conversation · Consulted: 2026-09-30

Project conversation, September 30, 2026: user authorizes public push after clear naming and simple project explanation.

Authorizes publishing this project to the supplied GitHub account; development keys and personal environment files are not release material.

Used by: [DEC-0016](records/DEC-0016-publish-accord-agent-payments-research-repository.md)

## SRC-0036

**Public release naming review and regression tests**

Type: local_file · Consulted: 2026-09-30

CONTRIBUTING.md and artifacts/public-release-tests.txt

Reviewed naming in protocol, runtime, contract, tests, and website; clarified identifiers in five JavaScript modules and units in contract comments. All 17 regression tests passed after changes.

Used by: [DEC-0016](records/DEC-0016-publish-accord-agent-payments-research-repository.md)
