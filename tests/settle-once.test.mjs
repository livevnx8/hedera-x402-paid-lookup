import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractHederaTxId,
  toMirrorTxId,
  mirrorCryptoTransferSuccess,
} from "../src/facilitator.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

test("buyer.mjs never POSTs /settle or /verify (seller owns settle)", () => {
  const src = fs.readFileSync(path.join(root, "scripts/buyer.mjs"), "utf8");
  assert.equal(/\/settle/.test(src), false, "buyer must not call /settle");
  assert.equal(/\/verify/.test(src), false, "buyer must not call /verify");
  assert.match(src, /X-PAYMENT/);
  assert.match(src, /createPaymentPayload/);
});

test("extractHederaTxId reads DUPLICATE error text when transaction field is empty", () => {
  const err =
    "transaction 0.0.7162784@1788526960.563831785 failed precheck with status DUPLICATE_TRANSACTION against node account id 0.0.7";
  assert.equal(extractHederaTxId("", null, err), "0.0.7162784@1788526960.563831785");
  assert.equal(extractHederaTxId("0.0.1@2.3"), "0.0.1@2.3");
  assert.equal(extractHederaTxId(""), null);
});

test("toMirrorTxId converts @ and trailing nanos dot", () => {
  assert.equal(
    toMirrorTxId("0.0.7162784@1788526960.563831785"),
    "0.0.7162784-1788526960-563831785",
  );
});

test("mirrorCryptoTransferSuccess: known SUCCESS from first double-settle attempt", async () => {
  const r = await mirrorCryptoTransferSuccess("0.0.7162784@1788526960.563831785");
  assert.equal(r.ok, true);
  assert.match(String(r.transactionId), /0\.0\.7162784/);
});
