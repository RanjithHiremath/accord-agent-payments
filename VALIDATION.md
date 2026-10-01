# Local validation — 30 September 2026

The local prototype passed **17 automated tests**, with no failures. Browser
checks also confirmed the three demonstration paths and the connected logs.
The final npm advisory check reported **zero known vulnerabilities** in the
installed dependency tree. These checks do not establish production safety.

## Executed checks

| Area | Observed result |
| --- | --- |
| Contract payment | Actual local account balance change matched payment plus transaction fee |
| Signed terms | Changed request, buyer, seller, amount, network, and contract were rejected |
| Spending | Payment, fee, and combined caps rejected excessive purchases before submission |
| Repeated requests | Duplicate concurrent requests recovered one payment |
| Expiry | Unpaid expired offers were rejected; paid offers remained recoverable |
| Failed recipient transfer | Payment state rolled back and a later retry succeeded |
| Provider identity | Separate provider objects were rejected even with the same chain ID |
| Development-chain startup | Occupied ports were rejected without modifying the running chain |
| Separate processes | Buyer and seller completed an exchange through their HTTP interfaces |
| Recovery | A fresh seller process recovered an already-paid result |
| Local web controls | Cross-origin requests and private-file paths were denied |
| Browser form | Success, retry, budget rejection, and invalid input produced appropriate output |
| Decision network | Search and record selection displayed definitions, evidence, and connected entries |
| Layout | Desktop at 1440px and phone at 390px were inspected; narrow documents did not overflow |

## Issues found and corrected

- Sparse JavaScript arrays could bypass the initial dataset check; validation now
  rejects missing entries as well as out-of-range values.
- The signing library accepted representations outside the contract's format;
  the interface now requires a 65-byte signature.
- Cached block or account information could interfere with rapid purchases;
  payment submission now reads concrete chain state and the current pending nonce.
- Payment checking and signing could use different providers reporting the same
  chain ID; the library now requires the same provider object.
- Startup could briefly mistake an existing chain for its newly launched process;
  the helper now rejects occupied ports and waits for its own process to listen.
- The exchange button's accessible name changed after running; the decorative
  arrow now remains outside its accessible name.
- Results now have explicit **Dataset summary** and **Payment receipt** headings,
  with readable Test ETH amounts and raw wei values. A rejected purchase shows
  **Exchange details**, not a nonexistent receipt.

## Remaining boundaries

The raw Anvil API remains a development administration service. A direct probe
confirmed it accepts commands with foreign Host and Origin headers; the website's
request protections do not cover that separate service. Keep the runtime local
and use only disposable development data and funds. Details are in
[SECURITY.md](SECURITY.md).

The demonstration does not prove public decentralization, persistent shared
spending limits, private delivery, arbitrary service quality, standard
interoperability, or a secure real-money deployment. It does not perform an
external-model evaluation or a meaningful throughput benchmark.

## Saved evidence

- [Automated test output](artifacts/test-results.txt)
- [Machine-readable validation summary](artifacts/validation-summary.json)
- [Dependency advisory response](artifacts/dependency-audit.json)
- [Desktop website screenshot](artifacts/accord-desktop.png)
- [Phone website screenshot](artifacts/accord-mobile.png)

Run `npm test`, `npm audit`, and `python3 scripts/decision_log.py --check` to repeat
the automated checks. Browser inspection is documented separately from automated
tests; it is not a comprehensive accessibility audit.

## Public release check — September 30, 2026

After clarifying internal names, the complete suite again passed all 17 tests.
The output is preserved in [public-release-tests.txt](artifacts/public-release-tests.txt).
Signed message fields and payment behavior were preserved. README installation
paths are portable and contribution guidelines document meaningful names and units.
