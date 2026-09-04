import crypto from "crypto";
import { getConfig } from "./config.mjs";
import { fetchFeePayer, verifyAndSettle } from "./facilitator.mjs";

const delivered = new Map();

function canonicalJson(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

function decodePaymentHeader(req) {
  const raw =
    req.headers["x-payment"] ||
    req.headers["X-PAYMENT"] ||
    req.headers["payment-signature"] ||
    req.headers["PAYMENT-SIGNATURE"];
  if (!raw) return null;
  try {
    const json = Buffer.from(String(raw), "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function handleLookup(req, res) {
  let cfg;
  try {
    cfg = getConfig();
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }

  const feePayer = await fetchFeePayer(cfg.facilitatorUrl);
  const requirements = {
    scheme: "exact",
    network: cfg.network,
    amount: cfg.amount,
    payTo: cfg.payTo,
    maxTimeoutSeconds: cfg.maxTimeoutSeconds,
    asset: cfg.asset,
    extra: { feePayer },
  };

  const paymentPayload = decodePaymentHeader(req);
  if (!paymentPayload) {
    res.status(402).json({
      x402Version: 2,
      accepts: [requirements],
      error: "PAYMENT_REQUIRED",
      note: "Pay exact HBAR on hedera:testnet via hosted Blocky402, then retry with X-PAYMENT",
    });
    return;
  }

  const accepted = paymentPayload.accepted || requirements;
  if (String(accepted.amount) !== String(cfg.amount) || accepted.payTo !== cfg.payTo) {
    res.status(402).json({
      x402Version: 2,
      accepts: [requirements],
      error: "AMOUNT_OR_PAYTO_MISMATCH",
    });
    return;
  }

  const settle = await verifyAndSettle(cfg.facilitatorUrl, paymentPayload, accepted);
  if (!settle.ok) {
    res.status(402).json({
      x402Version: 2,
      accepts: [requirements],
      error: settle.error,
      facilitator_claim: settle.claim,
      note: "Facilitator response is a claim, not independent ledger evidence",
    });
    return;
  }

  const txId = settle.transactionId || "unknown";
  if (delivered.has(txId)) {
    res.status(200).json(delivered.get(txId));
    return;
  }

  const payload = {
    service: "paid-lookup",
    query: "ethonline-2026-demo",
    result: {
      network: "hedera:testnet",
      facilitator: cfg.facilitatorUrl,
      feePayer,
      payTo: cfg.payTo,
      amount_tinybar: cfg.amount,
      message: "lookup ok",
    },
    payment: {
      facilitator_claim_success: true,
      transactionId: txId,
      note: "Facilitator settle JSON is a claim. Confirm CRYPTOTRANSFER SUCCESS on HashScan/Mirror independently.",
    },
    outcome: { state: "DELIVERED" },
  };
  const digest = crypto.createHash("sha256").update(canonicalJson(payload)).digest("hex");
  const body = { ...payload, response: { sha256: digest } };
  delivered.set(txId, body);
  res.status(200).json(body);
}
