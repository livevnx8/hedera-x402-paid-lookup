import express from "express";
import { handleLookup } from "./src/lookup.mjs";

const app = express();
app.get("/health", (_req, res) => res.json({ ok: true, network: "hedera:testnet" }));
app.get("/lookup", (req, res) => {
  handleLookup(req, res).catch((e) => {
    console.error(e);
    res.status(500).json({ error: String(e.message || e) });
  });
});
app.get("/", (_req, res) => {
  res.type("text").send(
    "hedera-x402-paid-lookup\nGET /health\nGET /lookup  → 402 unpaid / 200 paid\nFacilitator: https://api.testnet.blocky402.com\n",
  );
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`listening on :${port}`));
