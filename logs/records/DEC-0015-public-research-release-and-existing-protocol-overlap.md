# DEC-0015 — Recommend a public research release with explicit existing-protocol comparisons

Status: **proposed** · Recorded: 2026-10-01T01:23:48.653470+00:00

Decision authority: Assistant recommendation in response to the user asking whether similar projects exist and whether publishing is worthwhile; no public upload authorized or performed by this record.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

Accord is a local prototype in which separate buyer and seller programs exchange signed terms, development money, a receipt, and a dataset summary. The user is considering sharing it publicly. Existing payment projects already address much of this broad problem, so publication should explain overlap and measured limits rather than imply the idea is unprecedented.

## Terms used in this record

- **Protocol:** Shared rules for messages exchanged by independently written programs.
- **Research release:** Code and an explanation offered for inspection and criticism, without claiming production readiness.
- **Interoperability:** Different implementations can exchange messages successfully using the same rules.
- **HTTP:** Hypertext Transfer Protocol, the request-and-response rules commonly used by web services.
- **Payment network:** The system that records transfers and enforces its rules about spending balances.

## Concrete example

A buyer requests a dataset, receives a price, pays, and presents evidence of payment to receive access. Existing x402, L402, and Machine Payments Protocol designs already cover versions of this pattern. Accord adds our particular local implementation and tests; that does not establish a new category of invention.

## Why this log exists

I am writing this log to decide how to describe and potentially publish Accord honestly in light of existing work.

## Question

Does related work exist, and what kind of public release is justified?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Publish the reproducible local experiment and invite technical review | Lets others inspect and run the work, but requires clear documentation of prior work, exclusions of private local files, and a release license. | accept |
| Contribute an integration or improvement to an existing protocol | May provide more practical adoption than maintaining a separate message format; the useful improvement still needs validation. | watch |
| Keep exploring privately until there is stronger evidence of a distinct contribution | Allows refinement but delays outside feedback. | watch |
| Launch it as an unprecedented production money network | Neither originality nor public-network safety is supported by present evidence. | reject |

## Recommendation or decision

Publish a clearly labelled research prototype once a public release package is prepared. Prefer compatibility work with an existing protocol as the next engineering target. Do not claim novel agent payments, proven decentralization, or real-money readiness.

## Reasons

- Current primary documentation confirms substantial overlap with existing open payment projects.
- The local implementation, readable decision history, and reproducible tests are still useful material for review and learning.
- A public code host can distribute copies without becoming a required server for future participant transactions; actual independent operation still needs testing.

## Evidence and references

- [SRC-0031 — x402 current public implementation](../SOURCES.md#src-0031): Verified open payment standard, existing implementations, and options to run a facilitator or self-facilitate.
- [SRC-0032 — L402 current payment and access flow](../SOURCES.md#src-0032): Verified Lightning payment followed by proof-based access and existing Aperture implementation.
- [SRC-0033 — Machine Payments Protocol specification](../SOURCES.md#src-0033): Verified machine-to-machine payment challenge, payment credential, resource access, and multiple payment methods.
- [SRC-0034 — Agent Payments Protocol overview](../SOURCES.md#src-0034): Verified focus on authorization, authenticity, accountability, and agent commerce.
- [SRC-0025 — Full local automated test output](../SOURCES.md#src-0025): Previously saved 17-test local result; no tests rerun for this recommendation.

## Uncertainties and next evidence needed

- This is a focused related-work check, not an exhaustive novelty or intellectual-property search.
- No independent implementation has demonstrated interoperability with Accord.
- No release license, public repository destination, or public site deployment is selected by this recommendation.

## Revisit when

A release is requested, an independent developer identifies a useful difference, or an existing-protocol integration is tested.

## Connected records

- **informed_by** → [RES-0002 — Evaluate x402 for paid agent services](RES-0002-x402-internet-payments.md)
- **informed_by** → [RES-0003 — Evaluate Bitcoin, Lightning, and L402](RES-0003-bitcoin-lightning-and-l402.md)
- **informed_by** → [RES-0004 — Evaluate Machine Payments Protocol](RES-0004-machine-payments-protocol.md)
- **informed_by** → [RES-0005 — Evaluate spending authorization with AP2](RES-0005-agent-payment-authorization.md)
- **informed_by** → [DEC-0014 — Accept the local prototype milestone](DEC-0014-local-milestone-handoff.md)
- ← **supersedes** from [DEC-0016 — Publish Accord with clear names and a reproducible research scope](DEC-0016-publish-accord-agent-payments-research-repository.md)

## How this conclusion was reached

- **Method:** Compared current primary project documentation with the delivered local scope.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0031; SRC-0032; SRC-0033; SRC-0034
- **Options compared (not an exhaustive search):** 4
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Keeps the completed local milestone distinct from originality and public deployment claims.
- **What this permits next:** A public release requires a reproducible package, clear attribution and license, and exclusion of keys and private development files; no publication occurs in this research step.
