# DEC-0010 — Apply Kalidasa to documentation and website copy

Status: **accepted** · Recorded: 2026-09-30T05:58:45Z

Decision authority: User explicitly requested the installed Kalidasa skill.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The user wants each decision log understandable without prior chat context. Kalidasa is a local writing skill that diagnoses a reader’s needs before drafting. It can guide explanations, but it is not proof that the protocol or its reasoning is correct.

## Terms used in this record

- **Reader diagnosis:** Identifying who will read the text, what they already know, what they need to do, and what is actually known.
- **Evidence:** An observed result or source supporting a specific claim.
- **Design judgment:** A recommendation based on requirements and tradeoffs rather than a measured result.

## Concrete example

Before describing Lightning’s capacity requirements, define a payment channel and show a numerical example of why a payment can fail even when the sender owns bitcoin.

## Why this log exists

I am writing this log to explain how the requested writing skill will affect the project records.

## Question

How can Kalidasa improve the logs without disguising uncertain claims?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Reader-first drafting and a cold reread | Helps define terms and connect reasons to conclusions; still needs technical verification. | accept |
| Mechanical style scoring alone | Can catch surface problems but cannot verify meaning or evidence. | reject |

## Recommendation or decision

Use concrete examples, local definitions, clear recommendations, and specific uncertainty. Read each finished record as if encountering the project for the first time.

## Reasons

- The skill specifically addresses missing background knowledge and unexplained references.
- Its own limits distinguish writing guidance from evidence that a process works.

## Evidence and references

- [SRC-0021 — Kalidasa writing skill](../SOURCES.md#src-0021): Kalidasa recommends diagnosing readers, naming concepts before relying on them, and testing prose with a cold reread.
- [SRC-0003 — User instruction: connected and self-contained logs](../SOURCES.md#src-0003): The user requires standalone understanding.

## Uncertainties and next evidence needed

- No controlled comparison of writing quality or model reasoning has been performed.

## Revisit when

A reader still needs hidden context or confuses an assumption with a verified result.

## Connected records

- **implements** → [DEC-0002 — Maintain self-contained linked decision logs](DEC-0002-self-contained-linked-decision-logs.md)
- **informed_by** → [DEC-0009 — Require names that explain their purpose](DEC-0009-clear-domain-names-and-output-labels.md)
- ← **informed_by** from [DEC-0011 — Build a local site that shows the working prototype](DEC-0011-local-marketing-site-and-working-demo.md)
- ← **implements** from [EXP-0002 — Verify the website and readable decision network](EXP-0002-website-and-decision-network-browser-checks.md)

## How this conclusion was reached

- **Method:** Recorded user delegation and made an implementation choice; test results are recorded separately.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0021; SRC-0003
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the decentralized agent-payment objective and the user’s independent-reader logging requirement.
- **What this permits next:** Proceed with local development and testing using valueless development funds. No claim of public-network readiness.
