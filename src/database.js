"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const seed = require("./data/seed");

function computeFingerprint(data) {
  const digest = crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
  return `sha256:${digest}`;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function getMetadataMap(db) {
  const rows = db.prepare("SELECT key, value FROM db_metadata").all();
  const metadata = {};
  for (const row of rows) {
    metadata[row.key] = row.value;
  }
  return metadata;
}

function createSchema(db) {
  db.exec(`
    PRAGMA journal_mode=DELETE;
    PRAGMA foreign_keys=OFF;

    CREATE TABLE IF NOT EXISTS architecture_patterns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      components TEXT NOT NULL,
      trust_boundaries TEXT NOT NULL,
      data_flows TEXT NOT NULL,
      integration_points TEXT NOT NULL,
      known_weaknesses TEXT,
      applicable_standards TEXT,
      regulatory_hot_spots TEXT,
      citations TEXT,
      last_updated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS data_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      boundary_conditions TEXT,
      jurisdiction_protections TEXT NOT NULL,
      deidentification_requirements TEXT,
      cross_border_constraints TEXT,
      required_controls TEXT,
      permitted_uses TEXT,
      citations TEXT,
      last_updated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS threat_scenarios (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      attack_narrative TEXT,
      mitre_mapping TEXT,
      affected_patterns TEXT,
      affected_data_categories TEXT,
      likelihood_factors TEXT,
      impact_dimensions TEXT,
      severity TEXT,
      regulation_refs TEXT,
      control_refs TEXT,
      detection_indicators TEXT,
      historical_incidents TEXT,
      citations TEXT,
      last_updated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS technical_standards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      version TEXT,
      publisher TEXT NOT NULL,
      scope TEXT NOT NULL,
      key_clauses TEXT,
      control_mappings TEXT,
      regulation_mappings TEXT,
      implementation_guidance TEXT,
      licensing_restrictions TEXT,
      citations TEXT,
      last_updated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS applicability_rules (
      id TEXT PRIMARY KEY,
      condition_json TEXT NOT NULL,
      obligation_json TEXT NOT NULL,
      rationale TEXT NOT NULL,
      citations TEXT,
      last_updated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS evidence_artifacts (
      id TEXT PRIMARY KEY,
      audit_type TEXT NOT NULL,
      artifact_name TEXT NOT NULL,
      description TEXT NOT NULL,
      mandatory INTEGER NOT NULL,
      retention_period TEXT,
      template_ref TEXT,
      regulation_basis TEXT,
      citations TEXT,
      last_updated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source_type TEXT NOT NULL,
      content TEXT NOT NULL,
      provenance TEXT NOT NULL,
      license TEXT,
      refresh_cadence TEXT,
      source_url TEXT NOT NULL,
      effective_date TEXT,
      last_verified TEXT,
      knowledge_tier TEXT,
      last_updated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clause_references (
      id TEXT PRIMARY KEY,
      regulation_id TEXT NOT NULL,
      provision_ref TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      source_id TEXT NOT NULL,
      source_url TEXT NOT NULL,
      legal_force TEXT NOT NULL,
      jurisdiction_scope TEXT NOT NULL,
      effective_date TEXT,
      last_verified TEXT,
      status TEXT NOT NULL,
      last_updated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expert_playbooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      scenario TEXT NOT NULL,
      jurisdictions TEXT,
      data_types TEXT,
      when_to_use TEXT,
      steps TEXT NOT NULL,
      common_failure_modes TEXT,
      evidence_outputs TEXT,
      regulation_basis TEXT,
      citations TEXT,
      last_verified TEXT,
      last_updated TEXT NOT NULL
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS architecture_patterns_fts USING fts5(
      id UNINDEXED,
      name,
      description,
      components
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS threat_scenarios_fts USING fts5(
      id UNINDEXED,
      name,
      description,
      attack_narrative
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS technical_standards_fts USING fts5(
      id UNINDEXED,
      name,
      scope,
      key_clauses
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS data_categories_fts USING fts5(
      id UNINDEXED,
      name,
      description,
      boundary_conditions
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS clause_references_fts USING fts5(
      id UNINDEXED,
      regulation_id,
      provision_ref,
      title,
      summary
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS expert_playbooks_fts USING fts5(
      id UNINDEXED,
      name,
      scenario,
      steps,
      common_failure_modes
    );

    CREATE TABLE IF NOT EXISTS db_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Forward-compatible migrations for users with an older local database file.
  ensureColumn(db, "sources", "effective_date TEXT");
  ensureColumn(db, "sources", "last_verified TEXT");
  ensureColumn(db, "sources", "knowledge_tier TEXT");
}

function ensureColumn(db, tableName, columnDefinition) {
  const columnName = columnDefinition.trim().split(/\s+/)[0];
  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
  const existing = new Set(rows.map((row) => row.name));
  if (existing.has(columnName)) {
    return;
  }
  db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`);
}

function clearData(db) {
  db.exec(`
    DELETE FROM architecture_patterns;
    DELETE FROM data_categories;
    DELETE FROM threat_scenarios;
    DELETE FROM technical_standards;
    DELETE FROM applicability_rules;
    DELETE FROM evidence_artifacts;
    DELETE FROM sources;
    DELETE FROM clause_references;
    DELETE FROM expert_playbooks;
    DELETE FROM architecture_patterns_fts;
    DELETE FROM threat_scenarios_fts;
    DELETE FROM technical_standards_fts;
    DELETE FROM data_categories_fts;
    DELETE FROM clause_references_fts;
    DELETE FROM expert_playbooks_fts;
    DELETE FROM db_metadata;
  `);
}

function insertSeedData(db, fingerprint) {
  const now = seed.LAST_UPDATED;

  const insertArchitecturePattern = db.prepare(`
    INSERT INTO architecture_patterns (
      id, name, category, description, components, trust_boundaries, data_flows,
      integration_points, known_weaknesses, applicable_standards, regulatory_hot_spots,
      citations, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDataCategory = db.prepare(`
    INSERT INTO data_categories (
      id, name, description, boundary_conditions, jurisdiction_protections,
      deidentification_requirements, cross_border_constraints, required_controls,
      permitted_uses, citations, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertThreat = db.prepare(`
    INSERT INTO threat_scenarios (
      id, name, category, description, attack_narrative, mitre_mapping, affected_patterns,
      affected_data_categories, likelihood_factors, impact_dimensions, severity,
      regulation_refs, control_refs, detection_indicators, historical_incidents,
      citations, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertStandard = db.prepare(`
    INSERT INTO technical_standards (
      id, name, version, publisher, scope, key_clauses, control_mappings,
      regulation_mappings, implementation_guidance, licensing_restrictions, citations,
      last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertRule = db.prepare(`
    INSERT INTO applicability_rules (
      id, condition_json, obligation_json, rationale, citations, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertArtifact = db.prepare(`
    INSERT INTO evidence_artifacts (
      id, audit_type, artifact_name, description, mandatory, retention_period,
      template_ref, regulation_basis, citations, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSource = db.prepare(`
    INSERT INTO sources (
      id, name, source_type, content, provenance, license, refresh_cadence,
      source_url, effective_date, last_verified, knowledge_tier, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertClauseReference = db.prepare(`
    INSERT INTO clause_references (
      id, regulation_id, provision_ref, title, summary, source_id, source_url,
      legal_force, jurisdiction_scope, effective_date, last_verified, status, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertExpertPlaybook = db.prepare(`
    INSERT INTO expert_playbooks (
      id, name, scenario, jurisdictions, data_types, when_to_use, steps,
      common_failure_modes, evidence_outputs, regulation_basis, citations,
      last_verified, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPatternFts = db.prepare(
    "INSERT INTO architecture_patterns_fts (id, name, description, components) VALUES (?, ?, ?, ?)"
  );
  const insertThreatFts = db.prepare(
    "INSERT INTO threat_scenarios_fts (id, name, description, attack_narrative) VALUES (?, ?, ?, ?)"
  );
  const insertStandardsFts = db.prepare(
    "INSERT INTO technical_standards_fts (id, name, scope, key_clauses) VALUES (?, ?, ?, ?)"
  );
  const insertDataCategoryFts = db.prepare(
    "INSERT INTO data_categories_fts (id, name, description, boundary_conditions) VALUES (?, ?, ?, ?)"
  );
  const insertClauseFts = db.prepare(
    "INSERT INTO clause_references_fts (id, regulation_id, provision_ref, title, summary) VALUES (?, ?, ?, ?, ?)"
  );
  const insertExpertPlaybookFts = db.prepare(
    "INSERT INTO expert_playbooks_fts (id, name, scenario, steps, common_failure_modes) VALUES (?, ?, ?, ?, ?)"
  );

  const insertMetadata = db.prepare("INSERT INTO db_metadata (key, value) VALUES (?, ?)");

  for (const item of seed.architecturePatterns) {
    insertArchitecturePattern.run(
      item.id,
      item.name,
      item.category,
      item.description,
      JSON.stringify(item.components || []),
      JSON.stringify(item.trust_boundaries || []),
      JSON.stringify(item.data_flows || []),
      JSON.stringify(item.integration_points || []),
      JSON.stringify(item.known_weaknesses || []),
      JSON.stringify(item.applicable_standards || []),
      JSON.stringify(item.regulatory_hot_spots || []),
      JSON.stringify(item.citations || []),
      now
    );

    insertPatternFts.run(
      item.id,
      item.name,
      item.description,
      (item.components || []).join(" ")
    );
  }

  for (const item of seed.dataCategories) {
    insertDataCategory.run(
      item.id,
      item.name,
      item.description,
      item.boundary_conditions || "",
      JSON.stringify(item.jurisdiction_protections || {}),
      JSON.stringify(item.deidentification_requirements || []),
      JSON.stringify(item.cross_border_constraints || []),
      JSON.stringify(item.required_controls || []),
      JSON.stringify(item.permitted_uses || []),
      JSON.stringify(item.citations || []),
      now
    );

    insertDataCategoryFts.run(
      item.id,
      item.name,
      item.description,
      item.boundary_conditions || ""
    );
  }

  for (const item of seed.threatScenarios) {
    insertThreat.run(
      item.id,
      item.name,
      item.category,
      item.description,
      item.attack_narrative || "",
      JSON.stringify(item.mitre_mapping || []),
      JSON.stringify(item.affected_patterns || []),
      JSON.stringify(item.affected_data_categories || []),
      JSON.stringify(item.likelihood_factors || {}),
      JSON.stringify(item.impact_dimensions || {}),
      item.severity || "medium",
      JSON.stringify(item.regulation_refs || []),
      JSON.stringify(item.control_refs || []),
      JSON.stringify(item.detection_indicators || []),
      JSON.stringify(item.historical_incidents || []),
      JSON.stringify(item.citations || []),
      now
    );

    insertThreatFts.run(
      item.id,
      item.name,
      item.description,
      item.attack_narrative || ""
    );
  }

  for (const item of seed.technicalStandards) {
    insertStandard.run(
      item.id,
      item.name,
      item.version || "",
      item.publisher,
      item.scope,
      JSON.stringify(item.key_clauses || []),
      JSON.stringify(item.control_mappings || []),
      JSON.stringify(item.regulation_mappings || []),
      item.implementation_guidance || "",
      item.licensing_restrictions || "",
      JSON.stringify(item.citations || []),
      now
    );

    insertStandardsFts.run(
      item.id,
      item.name,
      item.scope,
      (item.key_clauses || []).join(" ")
    );
  }

  for (const item of seed.applicabilityRules) {
    insertRule.run(
      item.id,
      JSON.stringify(item.condition || {}),
      JSON.stringify(item.obligation || {}),
      item.rationale,
      JSON.stringify(item.citations || []),
      now
    );
  }

  for (const item of seed.evidenceArtifacts) {
    insertArtifact.run(
      item.id,
      item.audit_type,
      item.artifact_name,
      item.description,
      item.mandatory ? 1 : 0,
      item.retention_period || "",
      item.template_ref || "",
      JSON.stringify(item.regulation_basis || []),
      JSON.stringify(item.citations || []),
      now
    );
  }

  for (const item of seed.sources) {
    insertSource.run(
      item.id,
      item.name,
      item.source_type,
      item.content,
      item.provenance,
      item.license || "",
      item.refresh_cadence || "",
      item.source_url,
      item.effective_date || "",
      item.last_verified || now,
      item.knowledge_tier || "authoritative",
      now
    );
  }

  for (const item of seed.clauseReferenceLibrary || []) {
    insertClauseReference.run(
      item.id,
      item.regulation_id,
      item.provision_ref,
      item.title,
      item.summary,
      item.source_id,
      item.source_url,
      item.legal_force,
      item.jurisdiction_scope,
      item.effective_date || "",
      item.last_verified || now,
      item.status || "effective",
      now
    );

    insertClauseFts.run(
      item.id,
      item.regulation_id,
      item.provision_ref,
      item.title,
      item.summary
    );
  }

  for (const item of seed.expertPlaybooks || []) {
    insertExpertPlaybook.run(
      item.id,
      item.name,
      item.scenario,
      JSON.stringify(item.jurisdictions || []),
      JSON.stringify(item.data_types || []),
      JSON.stringify(item.when_to_use || []),
      JSON.stringify(item.steps || []),
      JSON.stringify(item.common_failure_modes || []),
      JSON.stringify(item.evidence_outputs || []),
      JSON.stringify(item.regulation_basis || []),
      JSON.stringify(item.citations || []),
      item.last_verified || now,
      now
    );

    insertExpertPlaybookFts.run(
      item.id,
      item.name,
      item.scenario,
      (item.steps || []).join(" "),
      (item.common_failure_modes || []).join(" ")
    );
  }

  insertMetadata.run("schema_version", "1.2.0");
  insertMetadata.run("domain", "defense-aerospace");
  insertMetadata.run("dataset_version", seed.DATASET_VERSION);
  insertMetadata.run("dataset_fingerprint", fingerprint);
  insertMetadata.run("last_updated", seed.LAST_UPDATED);
  insertMetadata.run("knowledge_baseline_date", seed.KNOWLEDGE_BASELINE.baseline_date);
  insertMetadata.run(
    "coverage_notes",
    "Unclassified guidance only. No classified content, CUI, or ITAR technical data stored."
  );
  insertMetadata.run(
    "known_limitations",
    "Provides framework and obligation routing guidance; does not replace legal or export counsel."
  );
}

function initializeSeed(db) {
  const fingerprint = computeFingerprint({
    architecturePatterns: seed.architecturePatterns,
    dataCategories: seed.dataCategories,
    threatScenarios: seed.threatScenarios,
    technicalStandards: seed.technicalStandards,
    applicabilityRules: seed.applicabilityRules,
    evidenceArtifacts: seed.evidenceArtifacts,
    sources: seed.sources,
    clauseReferenceLibrary: seed.clauseReferenceLibrary,
    jurisdictionProfiles: seed.jurisdictionProfiles,
    expertPlaybooks: seed.expertPlaybooks
  });

  let shouldSeed = true;
  try {
    const metadata = getMetadataMap(db);
    if (metadata.dataset_fingerprint === fingerprint) {
      shouldSeed = false;
    }
  } catch {
    shouldSeed = true;
  }

  if (!shouldSeed) {
    return fingerprint;
  }

  db.exec("BEGIN IMMEDIATE TRANSACTION");
  try {
    clearData(db);
    insertSeedData(db, fingerprint);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return fingerprint;
}

function openDatabase(options = {}) {
  const dbPath = options.dbPath || path.join(process.cwd(), "data", "database.db");
  ensureDir(dbPath);

  const db = new DatabaseSync(dbPath);
  createSchema(db);
  const fingerprint = initializeSeed(db);
  const metadata = getMetadataMap(db);

  return {
    db,
    dbPath,
    fingerprint,
    metadata
  };
}

module.exports = {
  openDatabase,
  computeFingerprint,
  getMetadataMap
};
