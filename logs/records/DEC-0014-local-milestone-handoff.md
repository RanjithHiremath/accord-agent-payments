# DEC-0014 — Accept the local prototype milestone

Status: **accepted** · Recorded: 2026-09-30T06:16:32Z

Decision authority: Assistant implementation decision and recorded evidence under delegated project authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project now has a runnable local agent-payment prototype, a locally hosted marketing site, a complete protocol document, operating instructions, and a connected decision ledger. The original ambition of public independent operation remains a further engineering stage.

## Terms used in this record

- **Milestone:** A specific delivered and checked portion of a larger project.
- **Reference prototype:** An implementation showing the proposed rules work in the stated test environment.
- **Public decentralization:** Operation by independent participants without dependence on one project operator; it is not demonstrated by several processes on one machine.

## Concrete example

The user can open the local website, run an exchange, inspect its receipt, read what the receipt guarantees, and follow the records explaining why this version uses an existing-chain design.

## Why this log exists

I am writing this log to distinguish the completed local deliverable from the broader public-network ambition.

## Question

Is the promised local prototype and website ready to inspect?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Hand off the tested local version with explicit remaining work | Provides a runnable result and preserves honest scope. | accept |
| Claim a production decentralized money network is complete | Unsupported by the local tests and operator model. | reject |

## Recommendation or decision

Hand off Accord 0.1 as the tested local prototype. Keep the website running and provide restart instructions. Next-stage work is a real service and a test-network exchange between independent operators.

## Reasons

- All 17 automated tests passed, the website interactions were checked, and the final dependency scan reported zero known advisories.
- Protocol, security, operating instructions, and linked logs are saved in the project.
- The user can review the result without needing the original conversation.

## Evidence and references

- [SRC-0025 — Full local automated test output](../SOURCES.md#src-0025): Automated behavior checks passed.
- [SRC-0027 — Browser acceptance observations](../SOURCES.md#src-0027): The website and linked records were operated in the browser.
- [SRC-0026 — Dependency advisory response](../SOURCES.md#src-0026): The final dependency advisory response has zero reported issues.

## Uncertainties and next evidence needed

- No public deployment, new currency, independent operator trial, or real-money audit was performed.
- The raw Anvil local administration boundary remains documented.

## Revisit when

The user selects the next public-test-network milestone or changes the service requirements.

## Connected records

- **supersedes** → [DEC-0005 — Propose the first demonstration and its success criteria](DEC-0005-first-demonstration-success-criteria.md)
- **depends_on** → [DEC-0006 — Deliver a local prototype and marketing website](DEC-0006-autonomous-local-prototype-and-website.md)
- **informed_by** → [EXP-0001 — Verify payments and recovery across separate agent processes](EXP-0001-local-payment-and-agent-integration-tests.md)
- **informed_by** → [EXP-0002 — Verify the website and readable decision network](EXP-0002-website-and-decision-network-browser-checks.md)
- **informed_by** → [RES-0011 — Record the remaining local trust boundaries](RES-0011-remaining-trust-and-local-rpc-boundaries.md)
- ← **informed_by** from [DEC-0015 — Recommend a public research release with explicit existing-protocol comparisons](DEC-0015-public-research-release-and-existing-protocol-overlap.md)
- ← **informed_by** from [DEC-0016 — Publish Accord with clear names and a reproducible research scope](DEC-0016-publish-accord-agent-payments-research-repository.md)

## How this conclusion was reached

- **Method:** Compared the delivered files and observed checks against the accepted local milestone.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0025; SRC-0027; SRC-0026
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the accepted local-prototype scope; records observed local results separately from public-network claims.
- **What this permits next:** Local use with valueless development funds. Public operation and real-money safety remain unverified.
