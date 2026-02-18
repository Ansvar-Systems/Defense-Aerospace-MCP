"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const test = require("node:test");

const ROOT = path.join(__dirname, "..");

test("drift hash script emits combined fingerprint file", () => {
  execFileSync("node", ["scripts/quality/drift-hashes.js"], {
    cwd: ROOT,
    stdio: "pipe"
  });

  const filePath = path.join(ROOT, "data", "drift-hashes.json");
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  assert.equal(payload.dataset_version, "1.2.0");
  assert.ok(payload.combined_fingerprint.startsWith("sha256:"));
});

test("source registry export writes sources.yml", () => {
  execFileSync("node", ["scripts/quality/export-sources-yaml.js"], {
    cwd: ROOT,
    stdio: "pipe"
  });

  const filePath = path.join(ROOT, "sources.yml");
  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes("dataset_version: \"1.2.0\""));
  assert.ok(content.includes("id: \"dod-cmmc-32cfr170\""));
});

test("golden standard audit returns A grade", () => {
  execFileSync("node", ["scripts/quality/golden-standard-audit.js"], {
    cwd: ROOT,
    stdio: "pipe"
  });

  const filePath = path.join(ROOT, "data", "golden-standard-report.json");
  const report = JSON.parse(fs.readFileSync(filePath, "utf8"));
  assert.equal(report.grade, "A");
  assert.equal(report.summary.fail_count, 0);
});
