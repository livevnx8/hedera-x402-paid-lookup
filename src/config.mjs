/** Shared config. Testnet + hosted Blocky402 only. */
export function getConfig() {
  const network = process.env.HEDERA_NETWORK || "testnet";
  if (network !== "testnet" && network !== "hedera:testnet") {
    throw new Error(`v0 is testnet-only. Got HEDERA_NETWORK=${network}`);
  }
  const facilitatorUrl = (process.env.FACILITATOR_URL || "https://api.testnet.blocky402.com").replace(/\/$/, "");
  if (!facilitatorUrl.includes("api.testnet.blocky402.com")) {
    throw new Error(`Gate 5: FACILITATOR_URL must be hosted Blocky402 testnet. Got: ${facilitatorUrl}`);
  }
  const payTo = process.env.PAY_TO || "0.0.10239119";
  if (!/^0\.0\.\d+$/.test(payTo)) {
    throw new Error("PAY_TO must be a Hedera account id like 0.0.12345");
  }
  const amount = process.env.AMOUNT_TINYBAR || "100000";
  return {
    facilitatorUrl,
    payTo,
    amount,
    asset: "0.0.0",
    network: "hedera:testnet",
    maxTimeoutSeconds: 300,
  };
}
