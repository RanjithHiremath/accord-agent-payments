# DEC-0001 — Define the agent payment protocol goal

Status: **accepted** · Recorded: 2026-09-30T05:51:29Z

Decision authority: User specified the objective; assistant recorded it.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project aims to let independently operated AI agents exchange money for goods or services without needing a company-operated payment platform. No payment software has been implemented in this folder yet.

## Terms used in this record

- **AI agent:** Software that selects and performs actions toward a goal, potentially using a language model.
- **Protocol:** Public rules defining the messages and behavior that independently written programs use to communicate.
- **Decentralized:** Control is distributed across independent participants rather than resting with one required operator.

## Concrete example

A research agent buys access to a weather result from another agent. They can complete the exchange even if the company that originally published the protocol shuts down.

## Why this log exists

I am writing this log to establish the objective that later design decisions must serve.

## Question

What are we building and what does independence from our servers mean?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Open protocol operated by independent participants | Requires shared rules and compatible implementations. | accept |
| Company-operated payment marketplace | Easier central coordination but depends on our continued operation. | reject |

## Recommendation or decision

Build an open agent payment protocol with an independently operable path. Do not claim that software can run without computers.

## Reasons

- The user explicitly requested an agent-to-agent money exchange protocol.
- A company-operated service would not meet the stated independence requirement.

## Evidence and references

- [SRC-0001 — User goal: agents exchanging money without a central server](../SOURCES.md#src-0001): The requested outcome is agent-to-agent exchange without reliance on a central server.

## Uncertainties and next evidence needed

- Currency, payment network, first service, and delivery guarantees remain undecided.

## Revisit when

The user changes the objective or a design would introduce a required central operator.

## Connected records

- ← **implements** from [DEC-0002 — Maintain self-contained linked decision logs](DEC-0002-self-contained-linked-decision-logs.md)
- ← **depends_on** from [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- ← **depends_on** from [RES-0001 — Define independence from central servers](RES-0001-independence-from-central-servers.md)
- ← **depends_on** from [RES-0005 — Evaluate spending authorization with AP2](RES-0005-agent-payment-authorization.md)
- ← **depends_on** from [RES-0010 — Distinguish payment from successful service delivery](RES-0010-payment-versus-service-delivery.md)
- ← **depends_on** from [DEC-0006 — Deliver a local prototype and marketing website](DEC-0006-autonomous-local-prototype-and-website.md)

## How this conclusion was reached

- **Method:** Recorded the user requirement; no technical test.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0001
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
