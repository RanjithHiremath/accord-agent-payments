# EXP-0002 — Verify the website and readable decision network

Status: **tested** · Recorded: 2026-09-30T06:16:32Z

Decision authority: Assistant implementation decision and recorded evidence under delegated project authority.

[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)

## Background — read this first

The marketing site is connected to the actual local buyer and seller. Its results and decision pages must remain understandable and usable, including on a narrow screen and without the original chat.

## Terms used in this record

- **Browser acceptance check:** Operating the visible website and inspecting its actual response.
- **Accessible name:** The label assistive technology uses to identify a control.
- **Viewport:** The visible width and height used to lay out the page.
- **Backlink:** A link from a record to another record that refers to it.

## Concrete example

Searching for Lightning and opening its research record displays definitions of settlement, custody, channels, liquidity, routing, and satoshis, followed by a numerical example and source references.

## Why this log exists

I am writing this log to record user-facing verification separately from backend tests.

## Question

Does the website expose real results and understandable linked records?

## Available options

| Option | Tradeoff | Current mark |
| --- | --- | --- |
| Operate each demonstration path and read records through the interface | Checks the delivered user experience. | accept |
| Only inspect source code | Misses output labels and layout problems. | reject |

## Recommendation or decision

Accept the current website for local use after checking success, retry, budget rejection, invalid input, record search, and desktop/phone layouts.

## Reasons

- The browser displayed actual local transaction identifiers and matching service results.
- Budget rejection displayed no payment receipt.
- The discovered button-name drift was fixed; service results and payment receipts now have distinct headings and exact readable Test ETH amounts.
- The phone layouts had equal document and viewport widths, with no unintended page overflow in the checked views.

## Evidence and references

- [SRC-0027 — Browser acceptance observations](../SOURCES.md#src-0027): Saved observations and screenshots document the browser checks.

## Uncertainties and next evidence needed

- This was not a comprehensive accessibility audit or a cross-browser test matrix.
- The relationship diagram has a text list alternative for small screens and keyboard use.

## Revisit when

Page structure, interaction logic, result fields, or log rendering changes.

## Connected records

- **implements** → [DEC-0011 — Build a local site that shows the working prototype](DEC-0011-local-marketing-site-and-working-demo.md)
- **implements** → [DEC-0009 — Require names that explain their purpose](DEC-0009-clear-domain-names-and-output-labels.md)
- **implements** → [DEC-0010 — Apply Kalidasa to documentation and website copy](DEC-0010-kalidasa-reader-first-writing.md)
- **informed_by** → [EXP-0001 — Verify payments and recovery across separate agent processes](EXP-0001-local-payment-and-agent-integration-tests.md)
- ← **informed_by** from [DEC-0014 — Accept the local prototype milestone](DEC-0014-local-milestone-handoff.md)

## How this conclusion was reached

- **Method:** In-app browser interaction, keyboard activation, record reading, screenshots, and layout inspection at 1440px and 390px.
- **Previously accepted choice:** None
- **Previously unresolved candidates:** None
- **New evidence:** SRC-0027
- **Options compared (not an exhaustive search):** 2
- **Tests run:** 0
- **Independent successful tests:** 0
- **Consistency with earlier records:** Continues the accepted local-prototype scope; records observed local results separately from public-network claims.
- **What this permits next:** Local use with valueless development funds. Public operation and real-money safety remain unverified.
