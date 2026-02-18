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

  const fixturePath = path.join(ROOT, "fixtures", "golden-hashes.json");
  const fixturePayload = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  assert.equal(fixturePayload.combined_fingerprint, payload.combined_fingerprint);
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

test("golden contract fixture contains at least 10 cases", () => {
  const fixturePath = path.join(ROOT, "fixtures", "golden-tests.json");
  const entries = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  assert.ok(Array.isArray(entries));
  assert.ok(entries.length >= 10);
});

test("source update check supports offline mode for deterministic CI smoke tests", () => {
  execFileSync("node", ["scripts/quality/check-source-updates.js"], {
    cwd: ROOT,
    stdio: "pipe",
    env: {
      ...process.env,
      SOURCE_CHECK_OFFLINE: "1"
    }
  });

  const reportPath = path.join(ROOT, "data", "source-updates-report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  assert.equal(report.offline_mode, true);
  assert.ok(report.summary.source_count >= 10);
});

test("server registry metadata stays in sync with package metadata", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const serverJson = JSON.parse(fs.readFileSync(path.join(ROOT, "server.json"), "utf8"));

  assert.equal(packageJson.mcpName, serverJson.name);
  assert.equal(packageJson.version, serverJson.version);
  assert.equal(packageJson.bin["defense-aerospace-mcp"], "bin/defense-aerospace-mcp.js");
});
