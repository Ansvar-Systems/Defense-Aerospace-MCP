"use strict";

const fs = require("node:fs");
const path = require("node:path");
const seed = require("../../src/data/seed");

function esc(value) {
  const str = String(value ?? "");
  return str.replace(/"/g, '\\"');
}

const lines = [];
lines.push("version: \"1.0\"");
lines.push(`dataset_version: \"${esc(seed.DATASET_VERSION)}\"`);
lines.push(`knowledge_baseline_date: \"${esc(seed.KNOWLEDGE_BASELINE.baseline_date)}\"`);
lines.push("sources:");

for (const source of seed.sources) {
  lines.push(`  - id: \"${esc(source.id)}\"`);
  lines.push(`    name: \"${esc(source.name)}\"`);
  lines.push(`    source_type: \"${esc(source.source_type)}\"`);
  lines.push(`    provenance: \"${esc(source.provenance)}\"`);
  lines.push(`    content: \"${esc(source.content)}\"`);
  lines.push(`    license: \"${esc(source.license)}\"`);
  lines.push(`    refresh_cadence: \"${esc(source.refresh_cadence)}\"`);
  lines.push(`    source_url: \"${esc(source.source_url)}\"`);
  lines.push(`    effective_date: \"${esc(source.effective_date || "") }\"`);
  lines.push(`    last_verified: \"${esc(source.last_verified || "") }\"`);
  lines.push(`    knowledge_tier: \"${esc(source.knowledge_tier || "authoritative")}\"`);
}

const output = `${lines.join("\n")}\n`;
const outPath = path.join(process.cwd(), "sources.yml");
fs.writeFileSync(outPath, output);
process.stdout.write(`Wrote source registry: ${outPath}\n`);
