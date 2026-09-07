# ETHOnline 2026 — submission draft

Track: **Hedera AI & Agentic Payments**  
Deadline: **Sunday Sep 13, 2026 — noon EDT** (submit early; do not wait for the last hour)

## One-liner

Paid HTTP lookup on Hedera testnet: unpaid requests get exact x402 402s; a script buyer signs; the seller settles once via hosted Blocky402; delivery is proven by Mirror CRYPTOTRANSFER SUCCESS — not facilitator JSON alone.

## Description (form paste)

hedera-x402-paid-lookup is a greenfield ETHOnline 2026 demo (started 2026-09-04) for agentic micropayments on Hedera.

A public Railway seller exposes GET /lookup. Without payment it returns HTTP 402 with exact requirements: network hedera:testnet, amount 100000 tinybar, payTo 0.0.10239119, feePayer 0.0.7162784 from hosted Blocky402 (https://api.testnet.blocky402.com).

A non-human buyer script signs an exact Hedera payment payload and retries with X-PAYMENT. **SETTLE-ONCE:** only the resource server calls /verify and /settle. The buyer must not settle (double-settle causes DUPLICATE_TRANSACTION). Delivery returns a hashed JSON body with outcome DELIVERED. Facilitator settle JSON is treated as a claim; independent HashScan/Mirror CRYPTOTRANSFER SUCCESS is the settlement evidence.

Wet receipts include Railway DELIVERED tx 0.0.7162784-1788800815-386309402. Regression tests freeze the settle-once buyer contract.

## Links

| What | URL |
| --- | --- |
| Repo | https://github.com/livevnx8/hedera-x402-paid-lookup |
| Public seller | https://hedera-x402-paid-lookup-production.up.railway.app |
| Health | https://hedera-x402-paid-lookup-production.up.railway.app/health |
| Facilitator | https://api.testnet.blocky402.com |
| Demo script | [DEMO.md](./DEMO.md) |
| HashScan (Railway DELIVERED) | https://hashscan.io/testnet/transaction/0.0.7162784-1788800815-386309402 |
| HashScan (tunnel DELIVERED) | https://hashscan.io/testnet/transaction/0.0.7162784-1788527094-585874638 |
| HashScan (double-settle leftover) | https://hashscan.io/testnet/transaction/0.0.7162784-1788526960-563831785 |

## Submit checklist (Sep 13 noon EDT)

- [ ] Repo public on GitHub main; latest docs (DEMO.md, SUBMISSION.md, README) pushed
- [ ] Railway host up: GET /health → 200; unpaid GET /lookup → 402 with exact accepts
- [ ] Walk DEMO.md four beats once more (unpaid 402 → buyer signs-only → HashScan SUCCESS → fail without X-PAYMENT)
- [ ] Paste one-liner + description into ETHOnline form
- [ ] Attach repo + live seller + HashScan Railway DELIVERED link
- [ ] Note SETTLE-ONCE + hosted Blocky402 (not self-hosted :4020)
- [ ] Confirm track: Hedera AI & Agentic Payments
- [ ] Submit **before** Sunday Sep 13, 2026 12:00 EDT (noon), not at the deadline

## Out of scope (v0)

- Mainnet / real money
- Self-hosted facilitator on :4020
- Marketplace, MAU product, or multi-seller catalog
- Buyer-side settle (forbidden; causes DUPLICATE_TRANSACTION)
- Copy of prior VNX paid-swarm / NVIDIA / carbon trees work
- Treating facilitator JSON as ledger proof without Mirror SUCCESS
