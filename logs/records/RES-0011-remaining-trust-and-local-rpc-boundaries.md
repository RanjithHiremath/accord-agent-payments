# RES-0011 — Record the remaining local trust boundaries

Status: **investigated** · Recorded: 2026-09-30T06:16:32Z

Decision authority: Assistant implementation decision and recorded evidence under delegated project authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The website and seller reject inappropriate browser requests, but the local Anvil blockchain is a separate development administration service. The project must distinguish those protections and state what payment and delivery still trust.

## Terms used in this record

- **RPC:** Remote procedure call: a program asks another process to run a named operation.
- **Host header:** The hostname a web request says it is addressing.
- **Origin header:** The web origin that sent a browser request.
- **CORS:** Browser rules controlling whether a website may read responses from another origin; this is not general request authentication.
- **Bearer credential:** A credential usable by whoever possesses it.
- **Ephemeral chain:** A development chain whose current history is discarded when the whole launcher restarts.

## Concrete example

A direct probe sent a JSON development command to a temporary Anvil chain with foreign Host and Origin headers and changed its clock. The website guards did not apply because this request addressed the separate chain service.

## Why this log exists

I am writing this log to preserve unresolved boundaries instead of describing a passing test suite as complete security.

## Question

Which assumptions must remain explicit when the local prototype is used?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Keep the prototype restricted to disposable local data and test funds | Matches the validated scope while openly retaining development administration capabilities. | accept |
| Expose the runtime publicly as a payment product | Would expose unreviewed control and delivery assumptions. | reject |
| Add isolated authenticated network infrastructure before broader trials | Appropriate next-stage work requiring its own design and tests. | watch |

## Recommendation or decision

Treat the raw blockchain API as trusted local administration. Document bearer delivery, ephemeral history, per-purchase budgets, and no automatic refunds.

## Reasons

- A observed direct probe demonstrates the raw RPC limitation.
- A paid offer proves payment but the delivery endpoint does not separately authenticate buyer-key possession.
- A full launcher restart deliberately discards the development history; seller-only restart recovery is a narrower guarantee.

## Evidence and references

- [SRC-0028 — Independent code review and disposable-chain probes](../SOURCES.md#src-0028): The independent review and disposable-chain probe established these boundaries.
- [SRC-0024 — Current contract and protocol implementation](../SOURCES.md#src-0024): Code review shows the current payment and delivery model.

## Uncertainties and next evidence needed

- No hostile-browser exploit or public deployment test was conducted.
- Real funds and private service data are outside the current safe-use scope.

## Revisit when

The project moves beyond trusted local development or needs private results, persistent budgets, or public service exposure.

## Connected records

- **constrains** → [DEC-0006 — Deliver a local prototype and marketing website](DEC-0006-autonomous-local-prototype-and-website.md)
- **informed_by** → [EXP-0001 — Verify payments and recovery across separate agent processes](EXP-0001-local-payment-and-agent-integration-tests.md)
- **informed_by** → [RES-0010 — Distinguish payment from successful service delivery](RES-0010-payment-versus-service-delivery.md)
- ← **informed_by** from [DEC-0014 — Accept the local prototype milestone](DEC-0014-local-milestone-handoff.md)

## How this conclusion was reached

- **Method:** Independent source review and targeted disposable-chain probes; remaining findings are documented in SECURITY.md.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0028; SRC-0024
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the accepted local-prototype scope; records observed local results separately from public-network claims.
- **What this permits next:** Local use with valueless development funds. Public operation and real-money safety remain unverified.
