# Decision network

Generated from the append-only ledger. Proposals are not accepted architecture.

[Project goal](../GOAL.md) · [How to use the logs](README.md) · [Source catalog](SOURCES.md)

| Record | Status | Purpose |
| --- | --- | --- |
| [DEC-0001 — Define the agent payment protocol goal](records/DEC-0001-agent-payment-protocol-goal.md) | accepted | I am writing this log to establish the objective that later design decisions must serve. |
| [DEC-0002 — Maintain self-contained linked decision logs](records/DEC-0002-self-contained-linked-decision-logs.md) | accepted | I am writing this log to choose a durable format for the user-required decision network. |
| [DEC-0003 — Research existing money and a new blockchain](records/DEC-0003-research-both-settlement-paths.md) | accepted | I am writing this log to preserve the instruction to compare both directions before selecting the architecture. |
| [RES-0001 — Define independence from central servers](records/RES-0001-independence-from-central-servers.md) | investigated | I am writing this log to turn “nobody’s server” into a testable requirement. |
| [RES-0002 — Evaluate x402 for paid agent services](records/RES-0002-x402-internet-payments.md) | investigated | I am writing this log to determine how much of the payment exchange already exists. |
| [RES-0003 — Evaluate Bitcoin, Lightning, and L402](records/RES-0003-bitcoin-lightning-and-l402.md) | investigated | I am writing this log to assess whether Bitcoin payments fit the project’s independence requirement and to explain their operational burden. |
| [RES-0004 — Evaluate Machine Payments Protocol](records/RES-0004-machine-payments-protocol.md) | investigated | I am writing this log to avoid comparing only one existing machine-payment standard. |
| [RES-0005 — Evaluate spending authorization with AP2](records/RES-0005-agent-payment-authorization.md) | investigated | I am writing this log to separate permission to spend from the mechanism that transfers funds. |
| [RES-0006 — Separate currency control from network control](records/RES-0006-currency-control-and-value.md) | investigated | I am writing this log to make asset-level dependencies visible before choosing a currency. |
| [RES-0007 — Evaluate a new token on an existing network](records/RES-0007-new-token-existing-network.md) | investigated | I am writing this log to distinguish creating a currency from operating a new blockchain. |
| [RES-0008 — Evaluate a new independently operated blockchain](records/RES-0008-new-blockchain-security-and-operations.md) | investigated | I am writing this log to assess the benefits and responsibilities of building the money network itself. |
| [RES-0009 — Evaluate a rollup as an intermediate option](records/RES-0009-rollup-middle-path.md) | investigated | I am writing this log to examine an option between full reuse and a fully separate chain. |
| [RES-0010 — Distinguish payment from successful service delivery](records/RES-0010-payment-versus-service-delivery.md) | investigated | I am writing this log to prevent a payment guarantee from being mistaken for a guarantee about arbitrary goods or work. |
| [DEC-0004 — Propose a protocol separable from its money network](records/DEC-0004-proposed-settlement-independent-design.md) | proposed | I am writing this log to turn the comparison into a provisional engineering recommendation. |
| [DEC-0005 — Propose the first demonstration and its success criteria](records/DEC-0005-first-demonstration-success-criteria.md) | proposed | I am writing this log to define what the first implementation should prove and what it cannot prove. |
| [OPS-0001 — Verify Agent Reach search access](records/OPS-0001-agent-reach-search-validation.md) | tested | I am writing this log to distinguish installed capability from observed working access. |
| [DEC-0006 — Deliver a local prototype and marketing website](records/DEC-0006-autonomous-local-prototype-and-website.md) | accepted | I am writing this log to make the delivery scope and delegated decision authority explicit. |
| [DEC-0007 — Use an Ethereum-compatible local chain for version 0.1](records/DEC-0007-existing-network-first-implementation.md) | accepted | I am writing this log to choose the first implementation after researching both existing and new money networks. |
| [DEC-0008 — Use direct payment with recoverable delivery](records/DEC-0008-direct-payment-and-recoverable-delivery.md) | accepted | I am writing this log to choose the version 0.1 payment and delivery guarantees. |
| [DEC-0009 — Require names that explain their purpose](records/DEC-0009-clear-domain-names-and-output-labels.md) | accepted | I am writing this log to turn the user’s naming requirement into a reviewable project convention. |
| [DEC-0010 — Apply Kalidasa to documentation and website copy](records/DEC-0010-kalidasa-reader-first-writing.md) | accepted | I am writing this log to explain how the requested writing skill will affect the project records. |
| [DEC-0011 — Build a local site that shows the working prototype](records/DEC-0011-local-marketing-site-and-working-demo.md) | accepted | I am writing this log to select the website’s purpose and implementation approach. |
| [DEC-0012 — Replace the initial development-chain dependency](records/DEC-0012-anvil-and-patched-development-dependencies.md) | accepted | I am writing this log to explain the change in development tooling and preserve the reason for the added version override. |
| [DEC-0013 — Bind the offer to its exact payment context](records/DEC-0013-structured-offers-and-single-payment-record.md) | accepted | I am writing this log to explain why the signed message and one-payment state are separate mechanisms. |
| [EXP-0001 — Verify payments and recovery across separate agent processes](records/EXP-0001-local-payment-and-agent-integration-tests.md) | tested | I am writing this log to record the observed behavior and defects corrected before the local handoff. |
| [RES-0011 — Record the remaining local trust boundaries](records/RES-0011-remaining-trust-and-local-rpc-boundaries.md) | investigated | I am writing this log to preserve unresolved boundaries instead of describing a passing test suite as complete security. |
| [EXP-0002 — Verify the website and readable decision network](records/EXP-0002-website-and-decision-network-browser-checks.md) | tested | I am writing this log to record user-facing verification separately from backend tests. |
| [OPS-0002 — Record development dependency and research-tool checks](records/OPS-0002-dependency-and-research-tool-verification.md) | tested | I am writing this log to preserve the final package-check result and Agent Reach version observation. |
| [DEC-0014 — Accept the local prototype milestone](records/DEC-0014-local-milestone-handoff.md) | accepted | I am writing this log to distinguish the completed local deliverable from the broader public-network ambition. |
| [DEC-0015 — Recommend a public research release with explicit existing-protocol comparisons](records/DEC-0015-public-research-release-and-existing-protocol-overlap.md) | proposed | I am writing this log to decide how to describe and potentially publish Accord honestly in light of existing work. |
| [DEC-0016 — Publish Accord with clear names and a reproducible research scope](records/DEC-0016-publish-accord-agent-payments-research-repository.md) | accepted | I am writing this log to record the public release authorization, repository naming, readable code conventions, and packaging boundary. |

## Relationship map

Arrows read “source depends on / is informed by / implements target”. Each record page also lists incoming links.

```mermaid
flowchart TD
    DEC_0001["DEC-0001: Define the agent payment protocol goal (accepted)"]
    DEC_0002["DEC-0002: Maintain self-contained linked decision logs (accepted)"]
    DEC_0003["DEC-0003: Research existing money and a new blockchain (accepted)"]
    RES_0001["RES-0001: Define independence from central servers (investigated)"]
    RES_0002["RES-0002: Evaluate x402 for paid agent services (investigated)"]
    RES_0003["RES-0003: Evaluate Bitcoin, Lightning, and L402 (investigated)"]
    RES_0004["RES-0004: Evaluate Machine Payments Protocol (investigated)"]
    RES_0005["RES-0005: Evaluate spending authorization with AP2 (investigated)"]
    RES_0006["RES-0006: Separate currency control from network control (investigated)"]
    RES_0007["RES-0007: Evaluate a new token on an existing network (investigated)"]
    RES_0008["RES-0008: Evaluate a new independently operated blockchain (investigated)"]
    RES_0009["RES-0009: Evaluate a rollup as an intermediate option (investigated)"]
    RES_0010["RES-0010: Distinguish payment from successful service delivery (investigated)"]
    DEC_0004["DEC-0004: Propose a protocol separable from its money network (proposed)"]
    DEC_0005["DEC-0005: Propose the first demonstration and its success criteria (proposed)"]
    OPS_0001["OPS-0001: Verify Agent Reach search access (tested)"]
    DEC_0006["DEC-0006: Deliver a local prototype and marketing website (accepted)"]
    DEC_0007["DEC-0007: Use an Ethereum-compatible local chain for version 0.1 (accepted)"]
    DEC_0008["DEC-0008: Use direct payment with recoverable delivery (accepted)"]
    DEC_0009["DEC-0009: Require names that explain their purpose (accepted)"]
    DEC_0010["DEC-0010: Apply Kalidasa to documentation and website copy (accepted)"]
    DEC_0011["DEC-0011: Build a local site that shows the working prototype (accepted)"]
    DEC_0012["DEC-0012: Replace the initial development-chain dependency (accepted)"]
    DEC_0013["DEC-0013: Bind the offer to its exact payment context (accepted)"]
    EXP_0001["EXP-0001: Verify payments and recovery across separate agent processes (tested)"]
    RES_0011["RES-0011: Record the remaining local trust boundaries (investigated)"]
    EXP_0002["EXP-0002: Verify the website and readable decision network (tested)"]
    OPS_0002["OPS-0002: Record development dependency and research-tool checks (tested)"]
    DEC_0014["DEC-0014: Accept the local prototype milestone (accepted)"]
    DEC_0015["DEC-0015: Recommend a public research release with explicit existing-protocol comparisons (proposed)"]
    DEC_0016["DEC-0016: Publish Accord with clear names and a reproducible research scope (accepted)"]
    DEC_0002 -->|implements| DEC_0001
    DEC_0003 -->|depends_on| DEC_0001
    RES_0001 -->|depends_on| DEC_0001
    RES_0002 -->|informed_by| RES_0001
    RES_0002 -->|depends_on| DEC_0003
    RES_0003 -->|depends_on| DEC_0003
    RES_0003 -->|informed_by| RES_0001
    RES_0004 -->|depends_on| DEC_0003
    RES_0004 -->|informed_by| RES_0002
    RES_0005 -->|depends_on| DEC_0001
    RES_0005 -->|informed_by| RES_0002
    RES_0006 -->|depends_on| DEC_0003
    RES_0006 -->|informed_by| RES_0001
    RES_0007 -->|depends_on| DEC_0003
    RES_0007 -->|informed_by| RES_0006
    RES_0008 -->|depends_on| DEC_0003
    RES_0008 -->|informed_by| RES_0001
    RES_0008 -->|informed_by| RES_0007
    RES_0009 -->|depends_on| DEC_0003
    RES_0009 -->|informed_by| RES_0008
    RES_0010 -->|depends_on| DEC_0001
    RES_0010 -->|constrains| RES_0008
    RES_0010 -->|constrains| RES_0002
    DEC_0004 -->|depends_on| DEC_0003
    DEC_0004 -->|informed_by| RES_0002
    DEC_0004 -->|informed_by| RES_0003
    DEC_0004 -->|informed_by| RES_0004
    DEC_0004 -->|informed_by| RES_0005
    DEC_0004 -->|informed_by| RES_0006
    DEC_0004 -->|informed_by| RES_0007
    DEC_0004 -->|informed_by| RES_0008
    DEC_0004 -->|informed_by| RES_0009
    DEC_0004 -->|informed_by| RES_0010
    DEC_0005 -->|depends_on| DEC_0004
    DEC_0005 -->|informed_by| RES_0010
    DEC_0005 -->|informed_by| RES_0001
    OPS_0001 -->|implements| DEC_0003
    DEC_0006 -->|depends_on| DEC_0001
    DEC_0006 -->|informed_by| DEC_0005
    DEC_0007 -->|supersedes| DEC_0004
    DEC_0007 -->|depends_on| DEC_0006
    DEC_0007 -->|informed_by| RES_0008
    DEC_0007 -->|informed_by| RES_0003
    DEC_0008 -->|depends_on| DEC_0007
    DEC_0008 -->|informed_by| RES_0010
    DEC_0009 -->|implements| DEC_0002
    DEC_0009 -->|depends_on| DEC_0006
    DEC_0010 -->|implements| DEC_0002
    DEC_0010 -->|informed_by| DEC_0009
    DEC_0011 -->|depends_on| DEC_0006
    DEC_0011 -->|informed_by| DEC_0010
    DEC_0012 -->|depends_on| DEC_0007
    DEC_0013 -->|depends_on| DEC_0008
    DEC_0013 -->|informed_by| RES_0002
    EXP_0001 -->|implements| DEC_0005
    EXP_0001 -->|depends_on| DEC_0012
    EXP_0001 -->|depends_on| DEC_0013
    RES_0011 -->|constrains| DEC_0006
    RES_0011 -->|informed_by| EXP_0001
    RES_0011 -->|informed_by| RES_0010
    EXP_0002 -->|implements| DEC_0011
    EXP_0002 -->|implements| DEC_0009
    EXP_0002 -->|implements| DEC_0010
    EXP_0002 -->|informed_by| EXP_0001
    OPS_0002 -->|depends_on| DEC_0012
    OPS_0002 -->|informed_by| OPS_0001
    DEC_0014 -->|supersedes| DEC_0005
    DEC_0014 -->|depends_on| DEC_0006
    DEC_0014 -->|informed_by| EXP_0001
    DEC_0014 -->|informed_by| EXP_0002
    DEC_0014 -->|informed_by| RES_0011
    DEC_0015 -->|informed_by| RES_0002
    DEC_0015 -->|informed_by| RES_0003
    DEC_0015 -->|informed_by| RES_0004
    DEC_0015 -->|informed_by| RES_0005
    DEC_0015 -->|informed_by| DEC_0014
    DEC_0016 -->|supersedes| DEC_0015
    DEC_0016 -->|depends_on| DEC_0009
    DEC_0016 -->|informed_by| DEC_0014
```
