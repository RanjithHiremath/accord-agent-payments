# DEC-0012 — Replace the initial development-chain dependency

Status: **accepted** · Recorded: 2026-09-30T06:16:32Z

Decision authority: Assistant implementation decision and recorded evidence under delegated project authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The first payment demonstration needs a local blockchain process. The initial Ganache installation produced many known dependency advisories. This prompted a comparison with the Anvil development tool before completing the runtime.

## Terms used in this record

- **Dependency:** A software package the project uses instead of implementing that component itself.
- **Security advisory:** A published report of a known issue in a package; absence of advisories is not proof of safety.
- **Anvil:** A local Ethereum-compatible blockchain tool used for development and tests.
- **Dependency override:** An explicit package-version choice that replaces a version requested by another dependency.

## Concrete example

The compiler requested a temporary-file library version with a published flaw. The project pins its patched replacement and verifies that compilation and the payment tests still pass.

## Why this log exists

I am writing this log to explain the change in development tooling and preserve the reason for the added version override.

## Question

Which local chain and dependency versions should the prototype retain?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Anvil with current signing and compiler packages plus the patched temporary-file dependency | Native development binary and a smaller JavaScript dependency tree; tested on this machine. | accept |
| Keep the initial Ganache package | Already familiar but brought many reported issues in bundled dependencies. | reject |

## Recommendation or decision

Use Anvil 1.7.1, ethers 6.17.0, solc 0.8.37, and a tmp 0.2.7 override. Keep exact versions in the lockfile.

## Reasons

- The first dependency audit reported 36 vulnerabilities; the final audited tree reports zero.
- The replacement actually starts and executes the integration suite.
- No advisory count substitutes for reviewing our own contract and network boundaries.

## Evidence and references

- [SRC-0026 — Dependency advisory response](../SOURCES.md#src-0026): The final audit response records the advisory result.
- [SRC-0029 — Anvil executable and current installation](../SOURCES.md#src-0029): The installed native Anvil executable and local startup were verified.
- [SRC-0025 — Full local automated test output](../SOURCES.md#src-0025): The full test run passed with the replacement.

## Uncertainties and next evidence needed

- Only this platform’s binary was tested.
- New advisories may be published after the recorded check.

## Revisit when

A dependency changes, an advisory is published, or a new platform is supported.

## Connected records

- **depends_on** → [DEC-0007 — Use an Ethereum-compatible local chain for version 0.1](DEC-0007-existing-network-first-implementation.md)
- ← **depends_on** from [EXP-0001 — Verify payments and recovery across separate agent processes](EXP-0001-local-payment-and-agent-integration-tests.md)
- ← **depends_on** from [OPS-0002 — Record development dependency and research-tool checks](OPS-0002-dependency-and-research-tool-verification.md)

## How this conclusion was reached

- **Method:** Dependency advisory review, package replacement, and actual integration testing.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0026; SRC-0029; SRC-0025
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the accepted local-prototype scope; records observed local results separately from public-network claims.
- **What this permits next:** Local use with valueless development funds. Public operation and real-money safety remain unverified.
