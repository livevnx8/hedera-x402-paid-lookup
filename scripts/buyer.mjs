/**
 * Non-human buyer: unpaid GET → 402 → sign → retry with X-PAYMENT.
 * Seller verifies+settles via hosted Blocky402.
 * Do NOT settle in the buyer — double-settle causes DUPLICATE_TRANSACTION.
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

  const xPayment = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");
  console.log("3) retry GET with X-PAYMENT (seller verifies+settles via Blocky402)");
  res = await fetch(LOOKUP_URL, { headers: { "X-PAYMENT": xPayment } });
  const paid = await res.json();
  console.log("   status", res.status);
  console.log(JSON.stringify(paid, null, 2));
  if (res.status !== 200) process.exit(2);

  const tx = paid?.payment?.transactionId;
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
