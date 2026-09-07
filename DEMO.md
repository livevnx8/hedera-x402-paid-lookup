# Live demo (four beats)

Public seller: https://hedera-x402-paid-lookup-production.up.railway.app  
Facilitator: https://api.testnet.blocky402.com  

## SETTLE-ONCE

Only the **resource server** calls Blocky402 `/verify` then `/settle`.  
The buyer **signs** and retries with `X-PAYMENT` — it must **not** settle.  
Double-settle from the buyer yields `DUPLICATE_TRANSACTION` on Hedera; the leftover tx below is that residue. Seller-side DUPLICATE + Mirror `CRYPTOTRANSFER SUCCESS` can still authorize delivery.

---

### Beat 1 — unpaid 402 (exact requirements)

```bash
curl -sS https://hedera-x402-paid-lookup-production.up.railway.app/lookup | jq .
```

Expect **HTTP 402** with `accepts[0]`:

| field | value |
| --- | --- |
| scheme | `exact` |
| network | `hedera:testnet` |
| amount | `100000` (tinybar) |
| payTo | `0.0.10239119` |
| extra.feePayer | `0.0.7162784` |

---

### Beat 2 — buyer signs only (seller settles)

```bash
export LOOKUP_URL=https://hedera-x402-paid-lookup-production.up.railway.app/lookup
# also: HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY, FACILITATOR_URL=https://api.testnet.blocky402.com
npm run buyer
```

Buyer flow: unpaid GET → 402 → `createPaymentPayload` → retry with `X-PAYMENT`.  
**Do not** POST `/settle` or `/verify` from the buyer (enforced by `tests/settle-once.test.mjs`).  
Expect **HTTP 200** with `outcome.state: "DELIVERED"` and a `payment.transactionId`.

---

### Beat 3 — HashScan (independent ledger evidence)

Facilitator JSON is a **claim**. Confirm `CRYPTOTRANSFER` **SUCCESS** on HashScan/Mirror yourself:

| role | HashScan |
| --- | --- |
| Railway DELIVERED (wet) | https://hashscan.io/testnet/transaction/0.0.7162784-1788800815-386309402 |
| tunnel DELIVERED | https://hashscan.io/testnet/transaction/0.0.7162784-1788527094-585874638 |
| double-settle leftover | https://hashscan.io/testnet/transaction/0.0.7162784-1788526960-563831785 |

Fee payer on these txs: `0.0.7162784` (Blocky402 testnet).

---

### Beat 4 — honest fail without `X-PAYMENT`

```bash
curl -sS -o /tmp/unpaid.json -w "%{http_code}\n" \
  https://hedera-x402-paid-lookup-production.up.railway.app/lookup
# → 402
cat /tmp/unpaid.json | jq '.error'   # PAYMENT_REQUIRED
```

No header → no delivery. Payment ≠ delivery: settle claim alone is not enough without Mirror SUCCESS when handling duplicates.

---

## Fake vs real

| Fake / claim | Real / evidence |
| --- | --- |
| Facilitator `/settle` JSON `success: true` | Hedera Mirror `CRYPTOTRANSFER` **SUCCESS** |
| Buyer calling `/settle` | Buyer signs + `X-PAYMENT` only; seller settles once |
| Tunnel-only "works on my machine" | Durable Railway host returning 402 / DELIVERED |
| Mainnet / product MAU story | Testnet v0 demo for ETHOnline |
| Self-hosted facilitator on `:4020` | Hosted Blocky402 `api.testnet.blocky402.com` |

See also [SUBMISSION.md](./SUBMISSION.md) for the ETHOnline form draft.
