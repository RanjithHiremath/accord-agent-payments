# DEC-0011 — Build a local site that shows the working prototype

Status: **accepted** · Recorded: 2026-09-30T05:58:45Z

Decision authority: Assistant implementation choice under the user’s website request.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The user requested a locally hosted website marketing the agent-payment technology. The site should explain the intended protocol while letting visitors inspect what the current implementation actually does.

## Terms used in this record

- **Localhost:** A network address that points back to this computer.
- **Static frontend:** Website files served directly without a separate framework build system.
- **Live demonstration:** An interaction that runs the local payment code and displays the observed result.
- **API:** A program-accessible interface between the website and the local demonstration software.

## Concrete example

Click “Run local exchange” to trigger an actual development payment. The site displays the returned transaction identifier and numerical service result, while labeling the funds as test-only.

## Why this log exists

I am writing this log to select the website’s purpose and implementation approach.

## Question

How should the site market the technology without overstating its current status?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Plain web files with a local demonstration API | Small dependency footprint and a direct connection to observed behavior. | accept |
| Promotional mockup without working actions | Visually presentable but does not demonstrate the requested technology. | reject |
| Full application framework | Useful for a larger product, but not needed for this site’s initial interactions. | watch |

## Recommendation or decision

Build a polished local website with a working payment demonstration, protocol explanation, and browsable decision network. Use Accord as a provisional project name, not a claim of a registered brand.

## Reasons

- The website can make the protocol understandable and the prototype inspectable.
- No public adoption, transaction volume, speed benchmark, or audited-security claims are supported yet.

## Evidence and references

- [SRC-0019 — User delegation and local website request](../SOURCES.md#src-0019): The user requested a locally hosted marketing website.
- [SRC-0022 — Local implementation contract](../SOURCES.md#src-0022): The integration design connects the website to local demonstration and log APIs.

## Uncertainties and next evidence needed

- Brand availability has not been investigated.
- The site must be checked on desktop and mobile layouts once it is running.

## Revisit when

The site needs publishing, additional services, or functionality beyond the simple local interface.

## Connected records

- **depends_on** → [DEC-0006 — Deliver a local prototype and marketing website](DEC-0006-autonomous-local-prototype-and-website.md)
- **informed_by** → [DEC-0010 — Apply Kalidasa to documentation and website copy](DEC-0010-kalidasa-reader-first-writing.md)
- ← **implements** from [EXP-0002 — Verify the website and readable decision network](EXP-0002-website-and-decision-network-browser-checks.md)

## How this conclusion was reached

- **Method:** Recorded user delegation and made an implementation choice; test results are recorded separately.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0019; SRC-0022
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the decentralized agent-payment objective and the user’s independent-reader logging requirement.
- **What this permits next:** Proceed with local development and testing using valueless development funds. No claim of public-network readiness.
