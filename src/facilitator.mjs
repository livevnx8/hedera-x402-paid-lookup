/** Blocky402 hosted facilitator helpers. Facilitator JSON is a claim. */
export async function fetchFeePayer(facilitatorUrl) {
  const res = await fetch(`${facilitatorUrl}/supported`);
  if (!res.ok) throw new Error(`GET /supported HTTP ${res.status}`);
  const data = await res.json();
  const kind = (data.kinds || []).find((k) => k.network === "hedera:testnet");
  const feePayer = kind?.extra?.feePayer || data.signers?.["hedera:*"]?.[0];
  if (!feePayer) throw new Error("Blocky402 did not advertise hedera:testnet feePayer");
  return feePayer;
}

export async function verifyAndSettle(facilitatorUrl, paymentPayload, paymentRequirements) {
  const body = JSON.stringify({
    x402Version: 2,
    paymentPayload,
    paymentRequirements,
  });
  const verifyRes = await fetch(`${facilitatorUrl}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const verification = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok || !verification.isValid) {
    return {
      ok: false,
      stage: "verify",
      claim: verification,
      error: verification.invalidMessage || verification.invalidReason || `verify HTTP ${verifyRes.status}`,
    };
  }
  const settleRes = await fetch(`${facilitatorUrl}/settle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const settlement = await settleRes.json().catch(() => ({}));
  if (!settleRes.ok || !settlement.success) {
    return {
      ok: false,
      stage: "settle",
      claim: settlement,
      error: settlement.errorMessage || settlement.errorReason || `settle HTTP ${settleRes.status}`,
    };
  }
  return {
    ok: true,
    claim: settlement,
    transactionId: settlement.transaction || settlement.transactionId || null,
  };
}
