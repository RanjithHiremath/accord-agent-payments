# OPS-0002 — Record development dependency and research-tool checks

Status: **tested** · Recorded: 2026-09-30T06:16:32Z

Decision authority: Assistant implementation decision and recorded evidence under delegated project authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The local project installed libraries for signing, compiling, and running its development chain. Agent Reach was also used for web research. Their verification results should be recorded without implying that installation or a clean advisory report proves overall correctness.

## Terms used in this record

- **Lockfile:** A file recording exact installed dependency versions for repeatable installation.
- **Advisory scan:** A check against a database of known package issues.
- **Version check:** A read-only comparison of an installed tool with the release known to its updater.

## Concrete example

The final npm audit reported zero advisories after the dependency changes. The project still documents a raw local RPC exposure because package advisories do not measure that design boundary.

## Why this log exists

I am writing this log to preserve the final package-check result and Agent Reach version observation.

## Question

What did the tooling checks establish at handoff?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Record precise versions and time-specific results | Supports future rechecking without asserting permanent safety. | accept |
| Treat installed or up-to-date tools as automatically safe | Not supported by the observations. | reject |

## Recommendation or decision

Keep the lockfile, final advisory response, and test output. Repeat checks when dependencies change. Agent Reach reported v1.5.0 current; no update was needed.

## Reasons

- The final advisory tree reports zero known issues.
- The executable test provides evidence that the native chain dependency works on this machine.
- The version check is separate from the earlier successful Exa search.

## Evidence and references

- [SRC-0026 — Dependency advisory response](../SOURCES.md#src-0026): The final npm advisory response was saved.
- [SRC-0029 — Anvil executable and current installation](../SOURCES.md#src-0029): The native Anvil installation was actually exercised.
- [SRC-0030 — Agent Reach version check](../SOURCES.md#src-0030): Agent Reach check-update reported its installed version current.

## Uncertainties and next evidence needed

- Package databases can change and undisclosed vulnerabilities are not detected by this check.

## Revisit when

A dependency or tool is updated, or a new advisory is published.

## Connected records

- **depends_on** → [DEC-0012 — Replace the initial development-chain dependency](DEC-0012-anvil-and-patched-development-dependencies.md)
- **informed_by** → [OPS-0001 — Verify Agent Reach search access](OPS-0001-agent-reach-search-validation.md)

## How this conclusion was reached

- **Method:** Executed package advisory scan, installed-binary verification, and read-only Agent Reach version check.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0026; SRC-0029; SRC-0030
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the accepted local-prototype scope; records observed local results separately from public-network claims.
- **What this permits next:** Local use with valueless development funds. Public operation and real-money safety remain unverified.
