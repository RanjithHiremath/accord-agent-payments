# OPS-0001 — Verify Agent Reach search access

Status: **tested** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant performed read-only checks within the user’s research authorization.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The user installed Agent Reach as an additional internet-research route for this project. Installed configuration alone does not establish that its external search service is reachable, so this session included an actual search.

## Terms used in this record

- **Agent Reach:** An installed skill and local tool that routes research requests to other tools and services.
- **Exa:** The external search service used by the Agent Reach search route.
- **Configuration:** Saved settings describing how to contact a tool; not proof that the connection works.
- **Network restriction:** A local execution limit that can prevent a command from reaching an internet service.

## Concrete example

The initial local search could not resolve the Exa service address. Retrying the same read-only query with network access returned actual payment-protocol search results.

## Why this log exists

I am writing this log to distinguish installed capability from observed working access.

## Question

Can the Agent Reach search route retrieve material for this project?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Use Agent Reach Exa with permitted network access | Returned useful results in this session. | accept |
| Use built-in web search | Also worked and supplied primary-source documentation. | accept |
| Assume every configured platform works | Not supported by the tool checks. | reject |

## Recommendation or decision

Use both working research routes when useful. Do not claim that Agent Reach bypasses site access requirements or that all its platforms are configured.

## Reasons

- A nonempty Exa response was observed after enabling network access for the read-only command.
- The diagnostic tool itself warned that saved configuration did not prove connectivity.

## Evidence and references

- [SRC-0017 — Agent Reach live search result in this session](../SOURCES.md#src-0017): The diagnostic, failed request, and successful retry were observed in this session.

## Uncertainties and next evidence needed

- This test says nothing about access to logged-in social platforms or long-term search availability.

## Revisit when

A research route fails, access settings change, or a new platform is needed.

## Connected records

- **implements** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- ← **informed_by** from [OPS-0002 — Record development dependency and research-tool checks](OPS-0002-dependency-and-research-tool-verification.md)

## How this conclusion was reached

- **Method:** Read-only diagnostic plus two attempts at the same search, not independent benchmark trials.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0017
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 2
- **Independent successful tests:** 1
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
