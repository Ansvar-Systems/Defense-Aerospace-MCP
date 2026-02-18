"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const seed = require("../../src/data/seed");

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

const sections = {
  sources: seed.sources,
  clauseReferenceLibrary: seed.clauseReferenceLibrary,
  architecturePatterns: seed.architecturePatterns,
  dataCategories: seed.dataCategories,
  threatScenarios: seed.threatScenarios,
  technicalStandards: seed.technicalStandards,
  applicabilityRules: seed.applicabilityRules,
  evidenceArtifacts: seed.evidenceArtifacts,
  jurisdictionComparisons: seed.jurisdictionComparisons,
  jurisdictionProfiles: seed.jurisdictionProfiles,
  breachObligations: seed.breachObligations,
  controlBaselines: seed.controlBaselines,
  expertPlaybooks: seed.expertPlaybooks
};

const report = {
  generated_at: new Date().toISOString(),
  dataset_version: seed.DATASET_VERSION,
  dataset_baseline_date: seed.KNOWLEDGE_BASELINE.baseline_date,
  hashes: Object.fromEntries(Object.entries(sections).map(([name, value]) => [name, `sha256:${hash(value)}`])),
  combined_fingerprint: `sha256:${hash(sections)}`
};

const outPath = path.join(process.cwd(), "data", "drift-hashes.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

process.stdout.write(`Wrote drift hashes: ${outPath}\n`);
process.stdout.write(`${report.combined_fingerprint}\n`);
