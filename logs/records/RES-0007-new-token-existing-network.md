# RES-0007 — Evaluate a new token on an existing network

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant research; token issuance not selected.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

Creating a project currency does not necessarily require creating a blockchain. Existing networks can hold a program that maintains the balances of a newly issued token. This is a separate choice from a new independently operated money network.

## Terms used in this record

- **Token:** A transferable unit whose balance and transfer rules are defined by software.
- **Smart contract:** A program whose execution and stored state are checked by a blockchain network.
- **ERC-20:** A common interface for fungible tokens on Ethereum; fungible means units of the same token are interchangeable.
- **Host chain:** The existing blockchain executing the token program.

## Concrete example

A program could issue project credits on Ethereum. Transfers would still rely on Ethereum’s transaction ordering and fees, even though the credits have a new name.

## Why this log exists

I am writing this log to distinguish creating a currency from operating a new blockchain.

## Question

Would a new token solve a requirement that existing money cannot?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| New token on an existing network | Allows custom issuance without building consensus, but creates adoption and value questions. | watch |
| Existing money | Avoids another currency dependency and focuses effort on agent exchange. | watch |

## Recommendation or decision

Do not issue a token merely because the participants are agents. Require a concrete need for custom monetary rules first.

## Reasons

- ERC-20 tokens are contract state on an existing network.
- A new token adds an economic adoption problem without inherently improving agent interoperability.

## Evidence and references

- [SRC-0011 — Ethereum ERC-20 token standard](../SOURCES.md#src-0011): ERC-20 defines token balances and transfers in an Ethereum contract.

## Uncertainties and next evidence needed

- No need for custom currency supply or distribution has been established.

## Revisit when

A specific incentive or monetary requirement cannot be met with existing assets.

## Connected records

- **depends_on** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- **informed_by** → [RES-0006 — Separate currency control from network control](RES-0006-currency-control-and-value.md)
- ← **informed_by** from [RES-0008 — Evaluate a new independently operated blockchain](RES-0008-new-blockchain-security-and-operations.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0011
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
