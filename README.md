# hedera-x402-paid-lookup

ETHOnline 2026 · Hedera AI & Agentic Payments track.

Greenfield project started **2026-09-04** (after ETHOnline from-scratch boundary).

## What this is

A public HTTP lookup that returns **402 Payment Required** for an exact HBAR payment on `hedera:testnet`, settled through hosted **Blocky402** (`https://api.testnet.blocky402.com`). A non-human script buyer completes one paid request end to end. Delivery is a hashed body. Facilitator JSON is a claim; independent Hedera CRYPTOTRANSFER SUCCESS is settlement evidence.

## What this is not

- Not a copy of prior VNX paid-swarm / NVIDIA / carbon trees
- Not a self-hosted facilitator on `:4020`
- Not mainnet (v0)
- Not a marketplace / MAU product

## Status

Gate 1 (repo bootstrap): in progress.

## License

MIT

## Durable host

Public seller: https://hedera-x402-paid-lookup-production.up.railway.app

- GET /health → 200
- unpaid GET /lookup → 402
- Wet 2026-09-07: Mirror SUCCESS 0.0.7162784-1788800815-386309402 → DELIVERED

## Docs

- [DEMO.md](./DEMO.md) — four-beat live demo (402 → buyer signs → HashScan → honest fail)
- [SUBMISSION.md](./SUBMISSION.md) — ETHOnline form draft + Sep 13 noon EDT checklist

