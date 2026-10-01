# DEC-0003 — Research existing money and a new blockchain

Status: **accepted** · Recorded: 2026-09-30T05:51:29Z

Decision authority: User explicitly chose “Research both before choosing”.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The agent payment protocol needs a way to transfer money and prevent the same funds from being spent twice. The user has asked us to compare using established networks with creating a new currency and network before choosing.

## Terms used in this record

- **Settlement:** Recording a payment under a money network’s rules, with the required level of confidence that it will not be reversed.
- **Blockchain:** A shared transaction history whose participants follow rules for agreeing which transactions are valid.
- **Currency:** The unit of value being transferred; a currency and the network carrying it are separate choices.

## Concrete example

Two agents could exchange existing bitcoin, or exchange a newly issued project currency. Either way, they need rules that establish which agent owns the funds after payment.

## Why this log exists

I am writing this log to preserve the instruction to compare both directions before selecting the architecture.

## Question

Should the project adopt existing money networks or create a new one?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Compare both before selecting | Requires research but avoids making the foundational choice on an assumption. | accept |
| Immediately select an established network | Faster but skips the requested comparison. | reject |
| Immediately launch a new currency and chain | Assumes new monetary infrastructure is necessary before establishing that need. | reject |

## Recommendation or decision

Compare existing currency, a new token on an existing network, a separate blockchain, and a rollup before making an implementation choice.

## Reasons

- The user chose research rather than either architecture.
- Separating currency from network avoids treating token issuance as equivalent to building a blockchain.

## Evidence and references

- [SRC-0002 — User instruction: research both settlement approaches](../SOURCES.md#src-0002): The user requested research of both approaches before choosing.

## Uncertainties and next evidence needed

- Target payment size, volume, privacy, and tolerance for currency price changes have not been specified.

## Revisit when

The comparison is complete and enough concrete requirements exist to select a first implementation.

## Connected records

- **depends_on** → [DEC-0001 — Define the agent payment protocol goal](DEC-0001-agent-payment-protocol-goal.md)
- ← **depends_on** from [RES-0002 — Evaluate x402 for paid agent services](RES-0002-x402-internet-payments.md)
- ← **depends_on** from [RES-0003 — Evaluate Bitcoin, Lightning, and L402](RES-0003-bitcoin-lightning-and-l402.md)
- ← **depends_on** from [RES-0004 — Evaluate Machine Payments Protocol](RES-0004-machine-payments-protocol.md)
- ← **depends_on** from [RES-0006 — Separate currency control from network control](RES-0006-currency-control-and-value.md)
- ← **depends_on** from [RES-0007 — Evaluate a new token on an existing network](RES-0007-new-token-existing-network.md)
- ← **depends_on** from [RES-0008 — Evaluate a new independently operated blockchain](RES-0008-new-blockchain-security-and-operations.md)
- ← **depends_on** from [RES-0009 — Evaluate a rollup as an intermediate option](RES-0009-rollup-middle-path.md)
- ← **depends_on** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- ← **implements** from [OPS-0001 — Verify Agent Reach search access](OPS-0001-agent-reach-search-validation.md)

## How this conclusion was reached

- **Method:** Recorded the user’s explicit research direction.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0002
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
