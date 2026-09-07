# ETHOnline 2026 — Hacker Dashboard (paste-ready)

Deadline: **Sunday Sep 13, 2026 — 12:00pm EDT** (submit early; do not wait for the last hour).

Submission option: **Partner Prizes Only** is enough if not chasing finalist stage; choose **Finalist and Partner** if you want to present.

---

## Project title

hedera-x402-paid-lookup

## Tagline / one-liner

Paid HTTP lookup on Hedera testnet via x402 exact + hosted Blocky402 — settle once, prove on HashScan.

## Description

hedera-x402-paid-lookup is a greenfield ETHOnline 2026 demo (started 2026-09-04) for agentic micropayments on Hedera.

A public Railway seller exposes GET /lookup. Without payment it returns HTTP 402 with exact requirements: network hedera:testnet, amount 100000 tinybar, payTo 0.0.10239119, feePayer 0.0.7162784 from hosted Blocky402 (https://api.testnet.blocky402.com).

A non-human buyer script signs an exact Hedera payment payload and retries with X-PAYMENT. **SETTLE-ONCE:** only the resource server calls /verify and /settle. The buyer must not settle (double-settle causes DUPLICATE_TRANSACTION). Delivery returns a hashed JSON body with outcome DELIVERED. Facilitator settle JSON is treated as a claim; independent HashScan/Mirror CRYPTOTRANSFER SUCCESS is the settlement evidence.

Wet receipts include Railway DELIVERED tx 0.0.7162784-1788800815-386309402. Regression tests freeze the settle-once buyer contract.

## Repository URL

https://github.com/livevnx8/hedera-x402-paid-lookup

## Demo / live URL

https://hedera-x402-paid-lookup-production.up.railway.app/lookup

## Demo video

Record from [DEMO-SCRIPT.md](./DEMO-SCRIPT.md) (2–4 min required). Walk the four beats in [DEMO.md](./DEMO.md): unpaid 402 → buyer signs → HashScan SUCCESS → honest fail / SETTLE-ONCE.

## Track / partner prize

**Hedera AI & Agentic Payments** (select as partner prize)

## How you used Hedera / partner tools

(paste for partner prize step)

Native HBAR exact (asset 0.0.0) on hedera:testnet. x402 v2. Hosted Blocky402 fee-payer 0.0.7162784 from GET /supported. Seller verifies+settles once. Evidence: CRYPTOTRANSFER SUCCESS on HashScan e.g. 0.0.7162784-1788800815-386309402. Not self-hosted facilitator. Not mainnet.

## Feedback / comments for Hedera partner

Hosted Blocky402 testnet worked for exact HBAR. Discover feePayer at /supported each run. SETTLE-ONCE matters — buyer+seller both settling causes DUPLICATE_TRANSACTION. Facilitator JSON must stay a claim vs Mirror SUCCESS.

## Technologies

Hedera, x402, Blocky402, Node/Express, Railway

## Team

livevnx8

## Quick links

| What | URL |
| --- | --- |
| Repo | https://github.com/livevnx8/hedera-x402-paid-lookup |
| Live /lookup | https://hedera-x402-paid-lookup-production.up.railway.app/lookup |
| Health | https://hedera-x402-paid-lookup-production.up.railway.app/health |
| Facilitator | https://api.testnet.blocky402.com |
| HashScan (Railway DELIVERED) | https://hashscan.io/testnet/transaction/0.0.7162784-1788800815-386309402 |
| Spoken demo script | [DEMO-SCRIPT.md](./DEMO-SCRIPT.md) |
| Four-beat demo | [DEMO.md](./DEMO.md) |
| Longer draft | [SUBMISSION.md](./SUBMISSION.md) |

