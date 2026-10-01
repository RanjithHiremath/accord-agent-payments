# DEC-0005 — Propose the first demonstration and its success criteria

Status: **proposed** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant proposed milestone; service and settlement implementation remain open.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project goal is a decentralized protocol for AI-agent purchases. Before attempting a public network, a small demonstration should show the agreed payment behavior and the failures it can handle. A local demonstration alone cannot establish production readiness or independent network operation.

## Terms used in this record

- **Local demonstration:** Software run on development machines to exercise behavior without claiming a public service exists.
- **Test network:** A network intended for testing, using assets that must not be represented as real-money settlement.
- **Replay:** Reusing an old message in an attempt to repeat an action such as charging a payment.
- **Retry-safe:** Repeating a request after an interruption does not improperly duplicate its charge or effects.
- **Signed offer:** An offer accompanied by cryptographic evidence linking its contents to the signer’s key.

## Concrete example

A buyer agent purchases one specified digital result. Disconnect the buyer after payment, then retry: it should recover the result or a defined failure outcome without an unintended second charge.

## Why this log exists

I am writing this log to define what the first implementation should prove and what it cannot prove.

## Question

What evidence is needed before calling the first prototype successful?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Small payment-and-delivery demonstration with failure cases | Produces concrete evidence without claiming a live economy. | watch |
| Immediately launch a public currency and marketplace | Adds many unvalidated assumptions before basic behavior is checked. | reject |

## Recommendation or decision

Specify and test one offer, bounded payment authorization, settlement verification, delivery, and receipt flow; include altered offers, expired offers, retries, and interrupted delivery.

## Reasons

- The core behavior must work before network-scale claims are justified.
- Handling failure is essential because an interrupted response does not mean the payment failed.
- Independent operation must later be tested across operators, not only copies on one computer.

## Evidence and references

- [SRC-0001 — User goal: agents exchanging money without a central server](../SOURCES.md#src-0001): The user’s goal requires actual agent-to-agent exchange.
- [SRC-0004 — x402 official repository](../SOURCES.md#src-0004): Existing payment flows distinguish authorization, settlement, and the returned resource.

## Uncertainties and next evidence needed

- No payment code or integration test exists yet.
- The first service and settlement component remain undecided.

## Revisit when

Implementation scope is selected or a failure exposes a missing protocol rule.

## Connected records

- **depends_on** → [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- **informed_by** → [RES-0010 — Distinguish payment from successful service delivery](RES-0010-payment-versus-service-delivery.md)
- **informed_by** → [RES-0001 — Define independence from central servers](RES-0001-independence-from-central-servers.md)
- ← **informed_by** from [DEC-0006 — Deliver a local prototype and marketing website](DEC-0006-autonomous-local-prototype-and-website.md)
- ← **implements** from [EXP-0001 — Verify payments and recovery across separate agent processes](EXP-0001-local-payment-and-agent-integration-tests.md)
- ← **supersedes** from [DEC-0014 — Accept the local prototype milestone](DEC-0014-local-milestone-handoff.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0001; SRC-0004
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
