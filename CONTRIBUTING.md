# Contributing to Accord

Accord explores payments between independently operated AI agents. The current
implementation uses local development money only. Read [README.md](README.md)
and [SECURITY.md](SECURITY.md) before changing payment behavior.

## Names should explain the work

Use names that identify the role and meaning: `buyerWallet`, `sellerAddress`,
`paymentReceipt`, and `datasetSummary`. Include units in amounts and durations,
for example `maximumPaymentWei` and `expirySeconds`. Avoid single-letter variables
and vague names when a domain name would make the code clearer.

The signed version 0.1 message retains the fields `amount` and `expiry`:
`amount` is denominated in wei, and `expiry` is Unix time in seconds. A wei is
one quintillionth of ETH. Renaming signed fields changes the signed message,
so treat that as a protocol version change, not a cosmetic cleanup.

Keep payment receipts separate from service results. State what each check proves
and what it leaves unverified. Do not imply that successful payment guarantees
delivery of arbitrary work.

## Record decisions

Read [the logging convention](logs/README.md). Append research and substantive
decisions to the ledger, including context, definitions, alternatives, reasons,
sources, and links. Preserve historical entries. Regenerate the readable pages;
do not edit generated record pages directly.

## Verify a change

```sh
npm ci --ignore-scripts
npm test
python3 scripts/decision_log.py
python3 scripts/decision_log.py --check
```

Tests launch temporary local blockchains. Never supply production wallets or
confidential datasets. For website changes, check the affected interactions in a
browser and verify both wide and narrow layouts.

Keep credentials, `.local/`, personal environment files, and dependency folders
out of commits. Explain the problem, resulting behavior, and checks in a pull
request. Compatibility with existing payment standards is a research direction,
not a property of this release.
