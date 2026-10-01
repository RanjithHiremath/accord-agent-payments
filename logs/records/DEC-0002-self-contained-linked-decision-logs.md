# DEC-0002 — Maintain self-contained linked decision logs

Status: **accepted** · Recorded: 2026-09-30T05:51:29Z

Decision authority: User required connected, understandable logs; assistant selected the storage format within that scope.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

This project is researching a decentralized payment protocol for AI agents. Its decisions must remain understandable after the chat context is gone, including the meaning of technical terms and the evidence behind each choice.

## Terms used in this record

- **Decision record:** A named explanation of a question, alternatives, conclusion, evidence, and remaining uncertainty.
- **Decision network:** Records connected by named relationships such as depends on, informed by, or replaces.
- **JSONL:** A text format containing one structured JSON object per line.
- **Append-only:** Add new records without rewriting old conclusions; this is a working convention, not protection against file tampering.
- **Generated view:** A readable page recreated from the structured records.
- **Supersedes:** A newer record replaces an earlier conclusion while preserving the earlier explanation.

## Concrete example

If a later experiment shows that Lightning cannot meet the chosen payment size, we add a new decision linking to the original Lightning research. A reader sees both the original reasons and the new evidence.

## Why this log exists

I am writing this log to choose a durable format for the user-required decision network.

## Question

How should every topic and decision be recorded and connected?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Structured ledger plus generated readable pages and map | One source of truth, searchable links, and automatic consistency checks. | accept |
| Unstructured notes in chat | Easy to write but hard to revisit and disconnected from files. | reject |
| Independent manually maintained pages | Readable but links and summaries can drift apart. | watch |

## Recommendation or decision

Use an append-only JSONL ledger, a source catalog, and generated topic pages with backlinks and a relationship map. Every page includes local definitions and an example.

## Reasons

- This implements the user’s explicit request for named, interconnected, self-contained logs.
- Structured records allow missing references and broken links to be detected.
- Retaining earlier records makes changed conclusions explainable.

## Evidence and references

- [SRC-0003 — User instruction: connected and self-contained logs](../SOURCES.md#src-0003): The user required connected logs with alternatives, reasons, references, and definitions understandable without chat context.
- [SRC-0018 — Recursive decision ledger skill used for log design](../SOURCES.md#src-0018): The skill recommends append-only structured records and readable summaries.

## Uncertainties and next evidence needed

- Automated checks can enforce required fields, but humans must review clarity and whether the evidence supports the claim.
- Local files do not provide tamper-proof history.

## Revisit when

The format becomes difficult to understand, independent editing becomes common, or stronger history protection is required.

## Connected records

- **implements** → [DEC-0001 — Define the agent payment protocol goal](DEC-0001-agent-payment-protocol-goal.md)
- ← **implements** from [DEC-0009 — Require names that explain their purpose](DEC-0009-clear-domain-names-and-output-labels.md)
- ← **implements** from [DEC-0010 — Apply Kalidasa to documentation and website copy](DEC-0010-kalidasa-reader-first-writing.md)

## How this conclusion was reached

- **Method:** Compared logging formats against the user’s stated needs; selected a reversible implementation.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0003; SRC-0018
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
