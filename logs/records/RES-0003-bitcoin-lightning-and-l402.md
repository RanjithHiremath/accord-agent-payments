# RES-0003 — Evaluate Bitcoin, Lightning, and L402

Status: **investigated** · Recorded: 2026-09-30T05:51:29Z

Decision authority: Assistant research; not a selected payment network.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The project needs a way for AI agents to send money without entrusting their funds to the project operator. Bitcoin provides a shared money network. Lightning adds payment channels for transfers that do not put every payment directly on Bitcoin’s blockchain. L402 connects Lightning payments to access to online services.

## Terms used in this record

- **Bitcoin:** A digital currency and a distributed network recording ownership and transfers of that currency.
- **Settlement network:** The system whose rules establish whether a transfer of money has completed.
- **Native bitcoin:** Bitcoin itself, rather than a separate token that promises to represent bitcoin held elsewhere.
- **Noncustodial operation:** The owner controls the secret keys needed to spend the funds instead of a service provider controlling them.
- **Payment channel:** An arrangement in which participants lock bitcoin into a jointly enforced spending arrangement and exchange updates to their balances.
- **Liquidity:** Funds available in the right place and direction to send or receive a payment.
- **Outbound liquidity:** Capacity available for sending from a participant through a channel.
- **Inbound liquidity:** Capacity available for receiving from the other side of a channel.
- **Routing:** Finding connected channels with enough available capacity to carry a payment to its recipient.
- **Online operation:** Keeping the required payment software reachable to exchange messages; channel state must also be monitored or monitoring delegated to protect against stale closes.
- **Invoice:** A payment request specifying the payment details.
- **Payment proof:** Evidence that the requested payment was made; it does not prove the purchased work was good.
- **L402:** A standard that combines Lightning invoices and access tokens so programs can pay for digital services.
- **Satoshi:** One hundred-millionth of a bitcoin.

## Concrete example

Suppose a channel has 10,000 satoshis, with 8,000 currently spendable from Alice’s side and 2,000 from Bob’s. Ignoring fees and reserved balances, Alice can send Bob 3,000 through this channel, but Bob cannot send Alice 3,000 yet. For a payment to a third agent, every channel on the chosen route also needs enough capacity in the required direction. These are illustrative numbers, not measured performance.

## Why this log exists

I am writing this log to assess whether Bitcoin payments fit the project’s independence requirement and to explain their operational burden.

## Question

Should the first agent-payment implementation use Lightning and L402?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Participant-controlled Lightning nodes with L402 | Avoids entrusting funds to a required provider, but requires channels, capacity management, and reliable operation. | watch |
| Bitcoin payments recorded directly on its blockchain | Avoids channel routing but makes each payment depend on on-chain fees and confirmation timing. | watch |
| Custodial Lightning provider | Simplifies operation but the provider controls funds and becomes a dependency. | reject |

## Recommendation or decision

Keep independently operated Lightning plus L402 as a candidate. Do not select it until payment size and operational requirements are tested.

## Reasons

- L402 supplies a documented payment-to-service-access flow.
- A wallet balance alone does not guarantee that a Lightning route can carry a payment.
- Avoiding custody by a provider shifts operating responsibility to the participant.

## Evidence and references

- [SRC-0005 — L402 official documentation](../SOURCES.md#src-0005): L402 connects an invoice and proof of payment with access to a service.
- [SRC-0006 — Lightning liquidity explained](../SOURCES.md#src-0006): Lightning sending and receiving depend on directional channel capacity and peer availability.

## Uncertainties and next evidence needed

- No node or channel was started; no payment, fee, failure recovery, or availability was measured.
- The exact monitoring and backup setup must be checked against the chosen Lightning implementation.

## Revisit when

We know the first service, typical payment size, and who can operate the nodes.

## Connected records

- **depends_on** → [DEC-0003 — Research existing money and a new blockchain](DEC-0003-research-both-settlement-paths.md)
- **informed_by** → [RES-0001 — Define independence from central servers](RES-0001-independence-from-central-servers.md)
- ← **informed_by** from [DEC-0004 — Propose a protocol separable from its money network](DEC-0004-proposed-settlement-independent-design.md)
- ← **informed_by** from [DEC-0007 — Use an Ethereum-compatible local chain for version 0.1](DEC-0007-existing-network-first-implementation.md)
- ← **informed_by** from [DEC-0015 — Recommend a public research release with explicit existing-protocol comparisons](DEC-0015-public-research-release-and-existing-protocol-overlap.md)

## How this conclusion was reached

- **Method:** Primary documentation review and design comparison; no implementation experiment.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0005; SRC-0006
- **Options compared (not an exhaustive search):** 3
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Initial record, reconstructed from this session. User requirements and assistant recommendations are identified separately.
- **What this permits next:** This record documents research or an authorized project practice. It does not authorize a public launch or establish real-money safety.
