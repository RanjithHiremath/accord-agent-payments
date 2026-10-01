# RES-0006 — Separate currency control from network control

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant research; no currency selected.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

A payment protocol can avoid a company-operated server while still transferring an asset controlled by a company. We must choose both the payment network and the money transferred, rather than assuming their control properties are identical.

## Terms used in this record

- **Asset:** The unit or token being transferred as payment.
- **Stablecoin:** A token designed to track a reference value, commonly a national currency; the target value is not a guarantee.
- **Issuer:** The organization or mechanism that creates an asset.
- **Blocklisting:** Preventing specified addresses from transferring an asset under its rules.
- **Volatility:** Changes in the asset’s market price over time.

## Concrete example

Two agents might communicate directly yet pay in USDC, whose issuer can block certain transfers. Removing our payment server would not remove that issuer’s control.

## Why this log exists

I am writing this log to make asset-level dependencies visible before choosing a currency.

## Question

Does the project prioritize price stability, issuer independence, or some combination?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Native cryptocurrency such as bitcoin | Avoids a stablecoin issuer but its purchasing value changes. | watch |
| Issuer-backed stablecoin such as USDC | Targets familiar currency pricing but retains issuer and reserve dependencies. | watch |
| New project currency | Allows custom issuance rules but has no established acceptance or stable value by default. | watch |

## Recommendation or decision

Evaluate currency properties separately from the network. Do not describe all blockchain payments as free of centralized control.

## Reasons

- USDC’s issuer documents transfer blocklisting.
- A newly created currency does not acquire economic value merely because it can be transferred.

## Evidence and references

- [SRC-0010 — Circle USDC terms](../SOURCES.md#src-0010): Circle documents its ability to block USDC transfers involving specified addresses.
- [SRC-0014 — Bitcoin whitepaper](../SOURCES.md#src-0014): Bitcoin describes incentives and proof of work rather than an issuer-backed stable-value promise.

## Uncertainties and next evidence needed

- The user has not ranked price stability against issuer independence.
- No asset pricing, liquidity, or redemption conditions were measured.

## Revisit when

The project sets its required currency properties.

## Connected records

- **depends_on** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- **informed_by** → [RES-0001 — Define independence from central servers](RES-0001-independence-from-central-servers.md)
- ← **informed_by** from [RES-0007 — Evaluate a new token on an existing network](RES-0007-new-token-existing-network.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0010; SRC-0014
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
