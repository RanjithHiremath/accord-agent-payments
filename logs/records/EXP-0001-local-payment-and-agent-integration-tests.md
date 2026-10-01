# EXP-0001 — Verify payments and recovery across separate agent processes

Status: **tested** · Recorded: 2026-09-30T06:16:32Z

Decision authority: Assistant implementation decision and recorded evidence under delegated project authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

Accord now contains a buyer program, seller program, and payment contract. To distinguish a working local exchange from a mockup, the tests execute real contract transactions on temporary development chains and interact with seller HTTP endpoints.

## Terms used in this record

- **Integration test:** A check exercising several components together instead of only isolated functions.
- **Transaction fee:** The amount charged by the chain for executing a transaction.
- **Nonce:** For an account transaction, a sequence number that distinguishes and orders its submissions; this differs from the quote’s random distinguishing value.
- **Revert:** A failed contract execution that rolls back its state changes.
- **Provider:** The software connection used to read and submit blockchain operations.
- **Regression test:** A test preserving evidence that a previously discovered bug remains fixed.

## Concrete example

One test pays an offer, starts a fresh seller process against the still-running chain, and requests the result again. Other tests intentionally alter signatures or exceed budgets and confirm rejection.

## Why this log exists

I am writing this log to record the observed behavior and defects corrected before the local handoff.

## Question

Does the implementation enforce its stated payment rules and recover from the tested interruptions?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Exercise real local contract and HTTP behavior | Provides direct evidence for the scoped implementation. | accept |
| Rely on happy-path screenshots or a simulated balance table | Would not validate payment state or failure behavior. | reject |

## Recommendation or decision

Accept the current implementation for the local prototype: all 17 tests passed. Keep the documented trust limits and do not generalize these results to a public network.

## Reasons

- The tests check exact value transfer, wrong terms, expiry, fees, retries, and independent seller-process recovery.
- Review found and fixed sparse-array validation, signature length mismatch, stale block/nonce reads, mixed providers, and occupied-port startup.
- The chain startup regression confirms the original running chain is not modified when its port is occupied.

## Evidence and references

- [SRC-0025 — Full local automated test output](../SOURCES.md#src-0025): The saved full suite shows 17 passes and zero failures.
- [SRC-0028 — Independent code review and disposable-chain probes](../SOURCES.md#src-0028): A separate review reproduced provider and startup issues before their fixes.

## Uncertainties and next evidence needed

- The cases are not exhaustive or statistically independent proof of security.
- No independent implementation, public network, or external security audit was tested.

## Revisit when

Payment code, runtime behavior, dependencies, or the service schema changes.

## Connected records

- **implements** → [DEC-0005 — Propose the first demonstration and its success criteria](DEC-0005-first-demonstration-success-criteria.md)
- **depends_on** → [DEC-0012 — Replace the initial development-chain dependency](DEC-0012-anvil-and-patched-development-dependencies.md)
- **depends_on** → [DEC-0013 — Bind the offer to its exact payment context](DEC-0013-structured-offers-and-single-payment-record.md)
- ← **informed_by** from [RES-0011 — Record the remaining local trust boundaries](RES-0011-remaining-trust-and-local-rpc-boundaries.md)
- ← **informed_by** from [EXP-0002 — Verify the website and readable decision network](EXP-0002-website-and-decision-network-browser-checks.md)
- ← **informed_by** from [DEC-0014 — Accept the local prototype milestone](DEC-0014-local-milestone-handoff.md)

## How this conclusion was reached

- **Method:** Executed the complete 17-case local suite; individual assertions exercise actual state and HTTP behavior.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0025; SRC-0028
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 17
- **Independent successful tests:** 17
- **Consistency with earlier records:** Continues the accepted local-prototype scope; records observed local results separately from public-network claims.
- **What this permits next:** Local use with valueless development funds. Public operation and real-money safety remain unverified.
