# How the project logs work

Start at [the decision network](INDEX.md). Each topic has a specifically named
page showing why it was explored, alternatives, the recommendation, reasons,
evidence, uncertainties, and related records. Both outgoing links and backlinks
are generated automatically. [Sources](SOURCES.md) link back to the records that
use them.

The initial entries reconstruct research from this chat. Their timestamps are
the time they were recorded, not invented times for the earlier research.

Every record stands alone: it repeats the necessary background, defines its
specialized terms, and includes an example. Readers should not need this chat
or another page to understand the choice. Links provide evidence and history.

## Naming and status

- `DEC-NNNN-descriptive-topic`: a decision, including one still proposed.
- `RES-NNNN-descriptive-topic`: research into one topic.
- `EXP-NNNN-descriptive-topic`: an experiment with recorded results.
- `OPS-NNNN-descriptive-topic`: tooling or operational findings.

Numbers are unique within each prefix. Status is one of `proposed`, `accepted`,
`investigated`, `tested`, `rejected`, or `deferred`. Accepted records say who made
the decision. Research recommendations remain distinct from accepted choices.
If a later entry supersedes an earlier one, the earlier page retains its original
status as historical evidence and displays the incoming supersession link.

## Recording work

Append a JSON object as one line to `ledger.jsonl`; use existing entries as examples.
The required fields are:

| Field | Meaning |
| --- | --- |
| `id`, `slug`, `title` | Stable ID and specific readable topic name |
| `created_at` | Actual UTC recording time in ISO 8601 |
| `status`, `authority` | State and who authorized or recommended it |
| `context`, `terms`, `example` | Self-contained background, plain-language definitions, and a concrete example |
| `purpose`, `question` | Why this log exists and what it resolves |
| `options` | Named alternatives, tradeoffs, and marks: accept, watch, reject, needs_replay, decay_watch |
| `recommendation`, `rationale` | Conclusion and concise public justification |
| `evidence` | Source IDs with the precise claims they support |
| `uncertainties`, `revisit_when` | Missing evidence and conditions for reconsideration |
| `links` | Typed relationships to other stable record IDs |
| `evaluation` | Review method, prior decision, candidate count, trials, coherence, and promotion gate |

Relations: `depends_on`, `informed_by`, `constrains`, `implements`,
`motivated_by`, `supersedes`. The graph may contain cycles between related topics.
A supersession must point backward to an earlier record. Every record must be
connected to the project goal through the network.

Add sources to `sources.json` using new `SRC-NNNN` IDs. Record direct URLs and
what was actually checked; user requirements and local tool results should use
explicit conversation/tool descriptions rather than fabricated web links.

Run from the project folder:

```sh
python3 scripts/decision_log.py
python3 scripts/decision_log.py --check
```

These commands generate and verify the readable pages and relationship map.
The checks catch missing fields, invalid source references, duplicate IDs,
broken relationships, disconnected topics, and stale generated pages. They
cannot establish that a cited claim is true; that requires source review.

## Preserve history

Do not edit or delete existing ledger entries to change a conclusion. Append a
new record and link it with `supersedes`, retaining the reason for the change.
Likewise, add a new source entry when a source changes materially. Human summaries
and the network map can be regenerated from the ledger and catalog.

Append-only is a project convention, not a tamper-proof storage guarantee.
Local files can still be changed. Backups or version control can provide stronger
history protection later. Do not put secrets in this ledger.
