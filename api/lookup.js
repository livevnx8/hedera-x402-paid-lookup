import { handleLookup } from "../src/lookup.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "GET only" });
    return;
  }
  try {
    await handleLookup(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e.message || e) });
  }
}
