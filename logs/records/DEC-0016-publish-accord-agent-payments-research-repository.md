# DEC-0016 — Publish Accord with clear names and a reproducible research scope

Status: **accepted** · Recorded: 2026-10-01T02:34:11.308330+00:00

Decision authority: User explicitly authorized a public GitHub push; assistant selects routine repository packaging details under that authorization.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

Accord is a local agent-payment experiment. The user has now authorized publication to RanjithHiremath on GitHub and requires clear variable names and a simple explanation of the goal. The release must remain understandable to readers who did not participate in development.

## Terms used in this record

- **Repository:** A versioned collection of source code and documentation.
- **Regression test:** A check that previously working behavior still works after an edit.
- **MIT license:** The permission notice included with this release allowing reuse subject to its stated terms.
- **Signed message:** Named data authenticated with a cryptographic signature; changing its field names can change what is signed.

## Concrete example

The public reader clones accord-agent-payments, starts the local demo, and sees a buyer pay a seller with valueless funds. In the code, paymentReceipt and serviceDelivery identify different outputs. The signed amount field remains stable and is documented in wei.

## Why this log exists

I am writing this log to record the public release authorization, repository naming, readable code conventions, and packaging boundary.

## Question

How should the existing prototype be packaged for public inspection?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Publish accord-agent-payments as a documented local research prototype | Provides a clear purpose and reproducible example while leaving public-network guarantees unproven. | accept |
| Publish the whole development directory without reviewing its contents | Could disclose disposable keys, private environment files, and irrelevant assistant state. | reject |
| Rename every signed field during cosmetic cleanup | Would change the protocol format unnecessarily; retain established fields and document units. | reject |

## Recommendation or decision

Publish the reviewed code, documentation, test evidence, screenshots, and connected decision history under the MIT license in RanjithHiremath/accord-agent-payments. Exclude local keys, credentials, dependency folders, and assistant state.

## Reasons

- The repository name describes agent payments without asserting a new currency.
- The README now begins with the user goal and gives portable installation instructions, existing alternatives, and limits.
- Role-specific internal identifiers improve readability without changing public messages.
- The contract already uses an MIT identifier; the root license supplies explicit reuse terms for original project material.

## Evidence and references

- [SRC-0035 — User authorization for public repository](../SOURCES.md#src-0035): Explicit authorization for public publication and naming cleanup.
- [SRC-0036 — Public release naming review and regression tests](../SOURCES.md#src-0036): Reviewed identifiers and 17 passing regression tests.

## Uncertainties and next evidence needed

- Publication does not establish novelty, production security, or independence across operators.
- Automated secret-pattern checks are supplementary, not proof that arbitrary sensitive information cannot exist.

## Revisit when

Protocol fields change, a real-network adapter is added, or external contributors identify unclear names or reproduction failures.

## Connected records

- **supersedes** → [DEC-0015 — Recommend a public research release with explicit existing-protocol comparisons](DEC-0015-public-research-release-and-existing-protocol-overlap.md)
- **depends_on** → [DEC-0009 — Require names that explain their purpose](DEC-0009-clear-domain-names-and-output-labels.md)
- **informed_by** → [DEC-0014 — Accept the local prototype milestone](DEC-0014-local-milestone-handoff.md)

## How this conclusion was reached

- **Method:** Read code names and public documentation, rerun the full test suite, and inspect the explicit release file set before upload.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0035; SRC-0036
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 1
- **Independent successful tests:** 1
- **Consistency with earlier records:** Implements the user publication request while retaining the existing local-only scope.
- **What this permits next:** Upload only the reviewed release set after all regression tests and ledger validation pass.
