# DEC-0006 — Deliver a local prototype and marketing website

Status: **accepted** · Recorded: 2026-09-30T05:58:45Z

Decision authority: User delegated development decisions and requested a local website.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The user wants a protocol through which AI agents exchange money without a required central operator. The user has now delegated development decisions and requested a locally hosted marketing website by the next day.

## Terms used in this record

- **Local prototype:** A working demonstration on this computer; it does not establish a live public network.
- **Marketing website:** A site explaining the technology and its demonstrated uses.
- **Development funds:** Valueless test balances created only to exercise payment software.

## Concrete example

The user can open a local website, run a payment demonstration, inspect its actual receipt, and follow the decisions explaining how it was built.

## Why this log exists

I am writing this log to make the delivery scope and delegated decision authority explicit.

## Question

What should be ready for the user next?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Working local prototype, documentation, and site | Provides usable evidence and clear limits within the available development window. | accept |
| Research report only | Useful but would not meet the newly requested build scope. | reject |
| Public real-money launch | Would imply operational and security validation not established by this work. | reject |

## Recommendation or decision

Complete and verify the local prototype and website. Make routine technical choices without waiting for the sleeping user.

## Reasons

- The user explicitly delegated judgment and requested the website.
- A demonstrable implementation is the next useful step beyond research.

## Evidence and references

- [SRC-0019 — User delegation and local website request](../SOURCES.md#src-0019): The user authorizes autonomous development and asks for the local site.

## Uncertainties and next evidence needed

- Public deployment, independent network operators, and real-money safety remain outside what a local demonstration can establish.

## Revisit when

The user changes the scope or a selected component prevents local verification.

## Connected records

- **depends_on** → [DEC-0001 — Define the agent payment protocol goal](DEC-0001-agent-payment-protocol-goal.md)
- **informed_by** → [DEC-0005 — Propose the first demonstration and its success criteria](DEC-0005-first-demonstration-success-criteria.md)
- ← **depends_on** from [DEC-0007 — Use an Ethereum-compatible local chain for version 0.1](DEC-0007-existing-network-first-implementation.md)
- ← **depends_on** from [DEC-0009 — Require names that explain their purpose](DEC-0009-clear-domain-names-and-output-labels.md)
- ← **depends_on** from [DEC-0011 — Build a local site that shows the working prototype](DEC-0011-local-marketing-site-and-working-demo.md)
- ← **constrains** from [RES-0011 — Record the remaining local trust boundaries](RES-0011-remaining-trust-and-local-rpc-boundaries.md)
- ← **depends_on** from [DEC-0014 — Accept the local prototype milestone](DEC-0014-local-milestone-handoff.md)

## How this conclusion was reached

- **Method:** Recorded user delegation and made an implementation choice; test results are recorded separately.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0019
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the decentralized agent-payment objective and the user’s independent-reader logging requirement.
- **What this permits next:** Proceed with local development and testing using valueless development funds. No claim of public-network readiness.
