# Demo script (spoken, 2–4 min)

Record this for the ETHOnline demo video. Match the four beats in [DEMO.md](./DEMO.md).

**Target length:** ~3:30 (ok range 2:00–4:00)

---

## On-screen checklist (keep visible or cut between)

1. Unpaid `GET /lookup` → **HTTP 402** exact accepts
2. Buyer signs only → seller **SETTLE-ONCE** → **DELIVERED**
3. HashScan / Mirror → **CRYPTOTRANSFER SUCCESS**
4. No `X-PAYMENT` → still 402; facilitator JSON ≠ ledger proof

---

## Exact URLs to show

| Label | URL |
| --- | --- |
| Live lookup | https://hedera-x402-paid-lookup-production.up.railway.app/lookup |
| Health | https://hedera-x402-paid-lookup-production.up.railway.app/health |
| Facilitator | https://api.testnet.blocky402.com |
| HashScan SUCCESS | https://hashscan.io/testnet/transaction/0.0.7162784-1788800815-386309402 |
| Repo | https://github.com/livevnx8/hedera-x402-paid-lookup |

---

## 0:00–0:30 — Intro

**Say:**

> This is hedera-x402-paid-lookup — a greenfield ETHOnline 2026 demo for Hedera AI and Agentic Payments.
> A public HTTP lookup on Hedera testnet returns 402 Payment Required, takes an exact x402 HBAR payment through hosted Blocky402, settles once on the seller, and proves settlement on HashScan — not facilitator JSON alone.
> Live URL is on screen: the Railway `/lookup` endpoint.

**Show:** browser or terminal with
`https://hedera-x402-paid-lookup-production.up.railway.app/lookup`

---

## 0:30–1:00 — Beat 1: unpaid 402

**Say:**

> Beat one: unpaid request. No payment header. We expect HTTP 402 with exact requirements — network hedera testnet, one hundred thousand tinybar, payTo our seller account, and the Blocky402 fee payer from `/supported`.

**On screen:**

```bash
curl -sS https://hedera-x402-paid-lookup-production.up.railway.app/lookup | jq .
```

**Point at:** `scheme: exact`, `network: hedera:testnet`, `amount: 100000`, `payTo: 0.0.10239119`, `extra.feePayer: 0.0.7162784`

---

## 1:00–2:00 — Beat 2: buyer pays (or cut to result)

**Say:**

> Beat two: a non-human buyer script. It signs an exact payment payload and retries with X-PAYMENT. Important: the buyer does not settle. Only the resource server calls verify and settle — SETTLE-ONCE. If both sides settle, Hedera returns DUPLICATE_TRANSACTION.

**On screen (live if keys available, otherwise cut to a prior successful run):**

Follow DEMO.md Beat 2 buyer flow against the live Railway /lookup (or cut to a prior successful run).

**Point at:** HTTP 200, outcome.state DELIVERED, and payment.transactionId.

---

## 2:00–3:00 — Beat 3: HashScan SUCCESS

**Say:**

> Beat three: independent ledger evidence. Facilitator settle JSON is a claim. We open HashScan and confirm CRYPTOTRANSFER SUCCESS for the fee-payer transaction from hosted Blocky402 — account 0.0.7162784.

**On screen:** open in browser
https://hashscan.io/testnet/transaction/0.0.7162784-1788800815-386309402

**Point at:** SUCCESS status, CRYPTOTRANSFER, fee payer `0.0.7162784`.

---

## 3:00–3:30 — Beat 4: honest fail / SETTLE-ONCE / claim vs ledger

**Say:**

> Beat four: honesty checks. Without X-PAYMENT we still get 402 — no header, no delivery. SETTLE-ONCE matters: buyer plus seller both settling causes DUPLICATE_TRANSACTION. And facilitator success JSON alone is not enough — Mirror SUCCESS is the settlement evidence.

**On screen:** unpaid GET /lookup again (same curl as Beat 1) — expect HTTP 402 / PAYMENT_REQUIRED.

Optional flash of Fake vs real table from DEMO.md (claim vs Mirror SUCCESS).

---

## 3:30–4:00 — Close

**Say:**

> Repo is github.com/livevnx8/hedera-x402-paid-lookup. Live seller on Railway. Track: Hedera AI and Agentic Payments — partner prize. Testnet only, hosted Blocky402, settle once, prove on HashScan. Thanks.

**Show:** repo URL + prize track name on screen.

---

## Recording tips

- Keep terminal font large; jq the 402 body so accepts are readable.
- Prefer one continuous take; cut to wet HashScan if live buyer is slow.
- Do not demo buyer-side settle.
- Do not claim mainnet or self-hosted facilitator.

