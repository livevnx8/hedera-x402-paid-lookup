/**
 * Non-human buyer: unpaid GET → 402 → sign → Blocky402 verify/settle → retry with X-PAYMENT.
 */
import { ExactHederaScheme } from "@x402/hedera/exact/client";
import { createClientHederaSigner, PrivateKey } from "@x402/hedera";

const LOOKUP_URL = process.env.LOOKUP_URL;
const FACILITATOR = (process.env.FACILITATOR_URL || "https://api.testnet.blocky402.com").replace(/\/$/, "");
const accountId = process.env.HEDERA_ACCOUNT_ID;
const pk = process.env.HEDERA_PRIVATE_KEY;

if (!LOOKUP_URL) throw new Error("LOOKUP_URL required");
if (!accountId || !pk) throw new Error("HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY required");
if (!FACILITATOR.includes("api.testnet.blocky402.com")) {
  throw new Error("FACILITATOR_URL must be hosted Blocky402 testnet");
}

async function main() {
  console.log("1) unpaid GET", LOOKUP_URL);
  let res = await fetch(LOOKUP_URL);
  console.log("   status", res.status);
  const body402 = await res.json();
  if (res.status !== 402) {
    console.log(body402);
    throw new Error("expected 402 on unpaid request");
  }
  const requirements = body402.accepts?.[0];
  if (!requirements) throw new Error("402 missing accepts[0]");
  console.log("2) requirements", JSON.stringify(requirements));

  const signer = createClientHederaSigner(
    accountId,
    PrivateKey.fromStringECDSA(pk),
    { network: "hedera:testnet" },
  );
  const scheme = new ExactHederaScheme(signer);
  const signed = await scheme.createPaymentPayload(2, requirements);
  const paymentPayload = {
    x402Version: 2,
    scheme: "exact",
    network: "hedera:testnet",
    accepted: requirements,
    payload: signed.payload,
  };
  const envelope = { x402Version: 2, paymentPayload, paymentRequirements: requirements };

  console.log("3) POST /verify (facilitator claim)");
  const verify = await fetch(`${FACILITATOR}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(envelope),
  }).then((r) => r.json());
  console.log("   isValid", verify.isValid, verify.invalidMessage || verify.invalidReason || "");
  if (!verify.isValid) process.exit(2);

  console.log("4) POST /settle (facilitator claim — confirm on HashScan independently)");
  const settle = await fetch(`${FACILITATOR}/settle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(envelope),
  }).then((r) => r.json());
  console.log("   success", settle.success, "tx", settle.transaction || settle.transactionId);
  if (!settle.success) {
    console.log(settle);
    process.exit(2);
  }

  const xPayment = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");
  console.log("5) retry GET with X-PAYMENT");
  res = await fetch(LOOKUP_URL, { headers: { "X-PAYMENT": xPayment } });
  const paid = await res.json();
  console.log("   status", res.status);
  console.log(JSON.stringify(paid, null, 2));
  if (res.status !== 200) process.exit(2);

  const tx = settle.transaction || settle.transactionId;
  if (tx) {
    const dash = String(tx).replace("@", "-").replace(/\.(?=\d+$)/, "-");
    console.log("HashScan (confirm SUCCESS yourself):");
    console.log(`https://hashscan.io/testnet/transaction/${dash}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
