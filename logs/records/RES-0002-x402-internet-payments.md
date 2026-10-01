# RES-0002 — Evaluate x402 for paid agent services

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant research; not a selected implementation.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

An AI agent buying data from another agent needs a machine-readable price request and a way to prove payment. x402 is an existing open payment standard that may supply this exchange pattern.

## Terms used in this record

- **HTTP:** The request-and-response protocol commonly used by websites and web services.
- **402:** An HTTP response code meaning Payment Required.
- **x402:** An open standard for attaching payment requirements, authorization, and results to internet requests.
- **Facilitator:** Software that checks and submits payments for a service.
- **Settlement:** Recording the transfer according to the selected money network’s rules.

## Concrete example

A weather agent requests a price before returning data. The buyer supplies a permitted payment, and the seller checks the payment before returning the result. This is an illustrative flow, not an executed test.

## Why this log exists

I am writing this log to determine how much of the payment exchange already exists.

## Question

Can we reuse x402 without requiring a company-operated payment middleman?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Use x402 with seller-operated verification and settlement | Reuses a public standard; seller must operate the necessary payment connection. | watch |
| Require a single hosted facilitator | Easier initial setup but introduces a required operator. | reject |
| Invent a replacement payment message format | More control but adds compatibility and security work. | watch |

## Recommendation or decision

Keep x402 on the shortlist and investigate its direct-settlement path before designing a new wire format.

## Reasons

- The official documentation allows local verification and direct blockchain settlement.
- An optional facilitator must not be mistaken for a mandatory dependency.
- Payment transport alone does not establish decentralized discovery or trustworthy delivery.

## Evidence and references

- [SRC-0004 — x402 official repository](../SOURCES.md#src-0004): The production guidance and flow permit self-facilitation and direct settlement.

## Uncertainties and next evidence needed

- No package versions, particular asset support, or end-to-end compatibility have been tested.

## Revisit when

The selected currency or service requires a flow not supported by a compatible x402 implementation.

## Connected records

- **informed_by** → [RES-0001 — Define independence from central servers](RES-0001-independence-from-central-servers.md)
- **depends_on** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- ← **informed_by** from [RES-0004 — Evaluate Machine Payments Protocol](RES-0004-machine-payments-protocol.md)
- ← **informed_by** from [RES-0005 — Evaluate spending authorization with AP2](RES-0005-agent-payment-authorization.md)
- ← **constrains** from [RES-0010 — Distinguish payment from successful service delivery](RES-0010-payment-versus-service-delivery.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- ← **informed_by** from [DEC-0013 — Bind the offer to its exact payment context](DEC-0013-structured-offers-and-single-payment-record.md)
- ← **informed_by** from [DEC-0015 — Recommend a public research release with explicit existing-protocol comparisons](DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0004
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
