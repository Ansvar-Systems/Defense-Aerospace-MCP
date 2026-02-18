"use strict";

const fs = require("node:fs");
const path = require("node:path");
const seed = require("../../src/data/seed");
const { openDatabase } = require("../../src/database");
const { makeTools } = require("../../src/domain-service");

function hasCitations(record) {
  return Array.isArray(record.citations) && record.citations.length > 0;
}

function collectRecordChecks(name, records, checks, failures) {
  checks.push({ gate: `${name}_count`, status: records.length > 0 ? "pass" : "fail", details: `${records.length} records` });
  if (records.length === 0) {
    failures.push(`${name} has no records`);
  }

  const missingCitations = records.filter((record) => !hasCitations(record));
  checks.push({
    gate: `${name}_citations`,
    status: missingCitations.length === 0 ? "pass" : "fail",
    details: missingCitations.length === 0 ? "all records cite sources" : `${missingCitations.length} missing citations`
  });
  if (missingCitations.length > 0) {
    failures.push(`${name} contains records without citations`);
  }
}

function assert(condition, message, failures) {
  if (!condition) {
    failures.push(message);
  }
}

function ageDays(dateValue, referenceDateValue) {
  const date = new Date(dateValue);
  const referenceDate = new Date(referenceDateValue);
  if (Number.isNaN(date.getTime()) || Number.isNaN(referenceDate.getTime())) {
    return null;
  }
  const deltaMs = referenceDate.getTime() - date.getTime();
  return Math.floor(deltaMs / (24 * 60 * 60 * 1000));
}

async function runScenarioGates(tools, checks, failures) {
  const about = await tools.about();
  const classify = await tools.classify_data({
    data_description: "technical drawings for missile guidance system exported to UK contractor",
    jurisdictions: ["US", "UK"]
  });
  const applicability = await tools.assess_applicability({
    country: "US",
    role: "prime_contractor",
    data_types: ["cui"],
    system_types: ["da-cui-environment"],
    additional_context: { programs: ["DoD"] }
  });
  const cmmc = await tools.determine_cmmc_level({
    contract_description: "DoD program handling CUI",
    data_types: ["cui"],
    prime_or_sub: "prime_contractor"
  });
  const compare = await tools.compare_jurisdictions({
    topic: "ITAR vs EU dual-use",
    jurisdictions: ["US", "EU"]
  });
  const euApplicability = await tools.assess_applicability({
    country: "FR",
    role: "defense_subcontractor",
    data_types: ["supply-chain-data"],
    system_types: ["da-supply-chain"]
  });
  const usStateApplicability = await tools.assess_applicability({
    country: "US-CA",
    role: "prime_contractor",
    data_types: ["cui"],
    system_types: ["da-cui-environment"]
  });
  const euClassify = await tools.classify_data({
    data_description: "dual-use encryption telemetry package for aerospace supplier",
    jurisdictions: ["FR"]
  });
  const euJurisdictionProfiles = await tools.list_jurisdiction_profiles({
    region: "EU",
    coverage_level: "full",
    limit: 200
  });
  const usJurisdictionProfiles = await tools.list_jurisdiction_profiles({
    region: "US",
    coverage_level: "minimum",
    limit: 200
  });
  const natoJurisdictionProfiles = await tools.list_jurisdiction_profiles({
    region: "NATO",
    coverage_level: "focused",
    limit: 200
  });
  const frJurisdictionProfile = await tools.get_jurisdiction_profile({
    jurisdiction: "FR"
  });
  const noJurisdictionProfile = await tools.get_jurisdiction_profile({
    jurisdiction: "NO"
  });
  const coverageMatrix = await tools.get_coverage_matrix();
  const expertiseScorecard = await tools.get_expertise_scorecard({
    strict: true,
    max_source_age_days: 365
  });
  const playbookList = await tools.list_expert_playbooks({
    topic: "deemed export",
    limit: 5
  });
  const playbookDetail = await tools.get_expert_playbook({
    playbook_id: "pb-deemed-export-decision-flow"
  });
  const natoApplicability = await tools.assess_applicability({
    country: "NO",
    role: "defense_subcontractor",
    data_types: ["nato-classified"],
    system_types: ["da-classified-enclave"]
  });

  checks.push({ gate: "scenario_about", status: about.data.coverage_summary.authoritative_sources >= 10 ? "pass" : "fail" });
  checks.push({
    gate: "scenario_classification",
    status: classify.data.categories.some((entry) => entry.id === "itar-controlled") ? "pass" : "fail"
  });
  checks.push({
    gate: "scenario_applicability",
    status: applicability.data.obligations.some((entry) => entry.regulation_id === "CMMC_2_0") ? "pass" : "fail"
  });
  checks.push({ gate: "scenario_cmmc_l2", status: cmmc.data.cmmc_level === "Level 2" ? "pass" : "fail" });
  checks.push({ gate: "scenario_comparison", status: compare.data.comparison_matrix.length >= 2 ? "pass" : "fail" });
  checks.push({
    gate: "scenario_eu_applicability",
    status: euApplicability.data.obligations.some((entry) => entry.regulation_id === "NIS2_DIRECTIVE_2022_2555") ? "pass" : "fail"
  });
  checks.push({
    gate: "scenario_us_state_applicability",
    status: usStateApplicability.data.obligations.some((entry) => entry.regulation_id === "CMMC_2_0") ? "pass" : "fail"
  });
  checks.push({
    gate: "scenario_eu_classification",
    status: euClassify.data.applicable_regimes.length > 0 ? "pass" : "fail"
  });
  checks.push({
    gate: "scenario_precedence_model",
    status:
      applicability.data.precedence &&
      Array.isArray(applicability.data.obligations) &&
      applicability.data.obligations.some((entry) => entry.precedence && entry.clause_references)
        ? "pass"
        : "fail"
  });
  checks.push({
    gate: "scenario_eu_jurisdiction_profiles",
    status: euJurisdictionProfiles.data.entries.length >= 28 ? "pass" : "fail"
  });
  checks.push({
    gate: "scenario_us_jurisdiction_profiles",
    status: usJurisdictionProfiles.data.entries.length >= 52 ? "pass" : "fail"
  });
  checks.push({
    gate: "scenario_get_jurisdiction_profile",
    status:
      frJurisdictionProfile.data.profile.region === "EU" &&
      frJurisdictionProfile.data.profile.baseline_obligations.includes("NIS2_DIRECTIVE_2022_2555")
        ? "pass"
        : "fail"
  });
  checks.push({
    gate: "scenario_nato_jurisdiction_profiles",
    status:
      natoJurisdictionProfiles.data.entries.length >= 9 &&
      natoJurisdictionProfiles.data.entries.some((entry) => entry.jurisdiction === "NO")
        ? "pass"
        : "fail"
  });
  checks.push({
    gate: "scenario_nato_profile_resolution",
    status:
      noJurisdictionProfile.data.profile.region === "NATO" &&
      noJurisdictionProfile.data.profile.baseline_obligations.includes("NATO_C_M_2002_49")
        ? "pass"
        : "fail"
  });
  checks.push({
    gate: "scenario_nato_applicability",
    status: natoApplicability.data.obligations.some((entry) => entry.regulation_id === "NATO_FSC_HANDLING") ? "pass" : "fail"
  });
  checks.push({
    gate: "scenario_coverage_matrix",
    status:
      coverageMatrix.data.eu_coverage.full_coverage &&
      coverageMatrix.data.us_coverage.minimum_coverage &&
      coverageMatrix.data.nato_coverage.focused_coverage
        ? "pass"
        : "fail"
  });
  checks.push({
    gate: "scenario_expertise_scorecard",
    status:
      expertiseScorecard.data.overall_score >= 95 && expertiseScorecard.data.hard_failures.length === 0
        ? "pass"
        : "fail"
  });
  checks.push({
    gate: "scenario_expert_playbooks",
    status:
      playbookList.data.entries.length >= 1 &&
      playbookDetail.data.playbook &&
      Array.isArray(playbookDetail.data.playbook.steps) &&
      playbookDetail.data.playbook.steps.length >= 4
        ? "pass"
        : "fail"
  });

  assert(about.data.version === "1.2.0", "about.version must be 1.2.0", failures);
  assert(
    classify.data.applicable_regimes.some((entry) => /ITAR/i.test(entry)),
    "classification scenario missing ITAR mapping",
    failures
  );
  assert(
    applicability.metadata.foundation_mcp_calls.length > 0,
    "applicability should emit foundation MCP call hints",
    failures
  );
  assert(
    cmmc.data.implementation_timeline.full_phase_in_target === "2028-11-10",
    "cmmc timeline should include DFARS phase-in target date",
    failures
  );
  assert(
    euApplicability.data.obligations.some((entry) => entry.regulation_id === "NIS2_DIRECTIVE_2022_2555"),
    "EU applicability scenario missing NIS2 baseline mapping",
    failures
  );
  assert(
    usStateApplicability.data.obligations.some((entry) => entry.regulation_id === "CMMC_2_0"),
    "US state applicability scenario must map to US minimum CMMC obligations",
    failures
  );
  assert(
    applicability.data.precedence && applicability.data.precedence.considered_rules >= 1,
    "applicability should include precedence metadata",
    failures
  );
  assert(
    applicability.data.obligations.some((entry) => Array.isArray(entry.clause_references) && entry.clause_references.length > 0),
    "applicability obligations should include clause references",
    failures
  );
  assert(
    euJurisdictionProfiles.data.entries.length >= 28,
    "EU full-coverage jurisdiction profiles must include EU + all 27 member states",
    failures
  );
  assert(
    usJurisdictionProfiles.data.entries.length >= 52,
    "US minimum jurisdiction profiles must include federal plus state compatibility entries",
    failures
  );
  assert(
    frJurisdictionProfile.data.profile.baseline_obligations.includes("NIS2_DIRECTIVE_2022_2555"),
    "FR jurisdiction profile must include NIS2 baseline obligation mapping",
    failures
  );
  assert(
    natoJurisdictionProfiles.data.entries.length >= 9,
    "NATO focused jurisdiction profiles must include aggregate and non-EU member profiles",
    failures
  );
  assert(
    noJurisdictionProfile.data.profile.region === "NATO",
    "NO jurisdiction profile must resolve to NATO-focused profile",
    failures
  );
  assert(
    natoApplicability.data.obligations.some((entry) => entry.regulation_id === "NATO_FSC_HANDLING"),
    "NATO applicability scenario should include NATO_FSC_HANDLING obligations",
    failures
  );
  assert(coverageMatrix.data.eu_coverage.full_coverage, "coverage matrix must report full EU coverage", failures);
  assert(coverageMatrix.data.us_coverage.minimum_coverage, "coverage matrix must report US minimum coverage", failures);
  assert(coverageMatrix.data.nato_coverage.focused_coverage, "coverage matrix must report NATO focused coverage", failures);
  assert(expertiseScorecard.data.overall_score >= 95, "expertise scorecard strict score must be at least 95", failures);
  assert(expertiseScorecard.data.hard_failures.length === 0, "expertise scorecard strict mode must have zero hard failures", failures);
  assert(playbookList.data.entries.length >= 1, "expert playbook list should return matches for deemed export topic", failures);
  assert(
    Array.isArray(playbookDetail.data.playbook.steps) && playbookDetail.data.playbook.steps.length >= 4,
    "expert playbook detail should include actionable multi-step workflow",
    failures
  );
}

(async () => {
  const failures = [];
  const warnings = [];
  const checks = [];

  const dbPath = path.join(process.cwd(), "data", "golden-audit.db");
  const { db, metadata } = openDatabase({ dbPath });

  try {
    collectRecordChecks("architecture_patterns", seed.architecturePatterns, checks, failures);
    collectRecordChecks("data_categories", seed.dataCategories, checks, failures);
    collectRecordChecks("threat_scenarios", seed.threatScenarios, checks, failures);
    collectRecordChecks("technical_standards", seed.technicalStandards, checks, failures);
    collectRecordChecks("applicability_rules", seed.applicabilityRules, checks, failures);
    collectRecordChecks("evidence_artifacts", seed.evidenceArtifacts, checks, failures);
    collectRecordChecks("expert_playbooks", seed.expertPlaybooks || [], checks, failures);

    const requiredSourceIds = [
      "nist-800-171-r3",
      "nist-800-171a-r3",
      "dod-cmmc-32cfr170",
      "dfars-cmmc-subpart-204-75",
      "dfars-7012",
      "itar-usml",
      "ear-ccl",
      "dodi-8500-01",
      "dodi-8510-01",
      "eu-dual-use",
      "eu-nis2",
      "eu-euci-2013-488"
    ];

    const sourceIds = new Set(seed.sources.map((source) => source.id));
    for (const sourceId of requiredSourceIds) {
      checks.push({ gate: `source_${sourceId}`, status: sourceIds.has(sourceId) ? "pass" : "fail" });
      assert(sourceIds.has(sourceId), `missing required source: ${sourceId}`, failures);
    }

    const malformedSources = seed.sources.filter(
      (source) => !source.source_url || !source.effective_date || !source.last_verified || !source.knowledge_tier
    );
    checks.push({
      gate: "source_completeness",
      status: malformedSources.length === 0 ? "pass" : "fail",
      details: malformedSources.length === 0 ? "all sources complete" : `${malformedSources.length} incomplete sources`
    });
    assert(malformedSources.length === 0, "source registry has incomplete source entries", failures);

    const staleAuthoritativeSources = seed.sources.filter((source) => {
      if (source.knowledge_tier !== "authoritative") {
        return false;
      }
      const age = ageDays(source.last_verified, seed.KNOWLEDGE_BASELINE.baseline_date);
      return age === null || age > 365;
    });
    checks.push({
      gate: "source_freshness_authoritative",
      status: staleAuthoritativeSources.length === 0 ? "pass" : "fail",
      details:
        staleAuthoritativeSources.length === 0
          ? "all authoritative sources verified within 365 days"
          : `stale authoritative sources: ${staleAuthoritativeSources.map((entry) => entry.id).join(", ")}`
    });
    assert(
      staleAuthoritativeSources.length === 0,
      "authoritative source freshness exceeds 365-day threshold",
      failures
    );

    checks.push({
      gate: "clause_reference_library",
      status: Array.isArray(seed.clauseReferenceLibrary) && seed.clauseReferenceLibrary.length >= 10 ? "pass" : "fail",
      details: `${(seed.clauseReferenceLibrary || []).length} clause references`
    });
    assert(
      Array.isArray(seed.clauseReferenceLibrary) && seed.clauseReferenceLibrary.length >= 10,
      "clause reference library must contain at least 10 entries",
      failures
    );
    checks.push({
      gate: "expert_playbook_depth",
      status: Array.isArray(seed.expertPlaybooks) && seed.expertPlaybooks.length >= 8 ? "pass" : "fail",
      details: `${(seed.expertPlaybooks || []).length} expert playbooks`
    });
    assert(
      Array.isArray(seed.expertPlaybooks) && seed.expertPlaybooks.length >= 8,
      "expert playbook library must contain at least 8 entries",
      failures
    );

    const profileIndex = new Map((seed.jurisdictionProfiles || []).map((entry) => [entry.jurisdiction, entry]));
    const missingEuProfiles = seed.EU_MEMBER_STATE_CODES.filter((code) => !profileIndex.has(code));
    const missingUsStateProfiles = seed.US_STATE_CODES.filter((code) => !profileIndex.has(`US-${code}`));
    const missingNatoProfiles = seed.NATO_MEMBER_CODES.filter((code) => !profileIndex.has(code));
    const euProfileCoverageMismatch = seed.EU_MEMBER_STATE_CODES.filter((code) => {
      const profile = profileIndex.get(code);
      return !profile || profile.coverage_level !== "full";
    });
    const usProfileCoverageMismatch = seed.US_STATE_CODES.filter((code) => {
      const profile = profileIndex.get(`US-${code}`);
      return !profile || profile.coverage_level !== "minimum";
    });
    const natoProfileCoverageMismatch = seed.NATO_MEMBER_CODES.filter((code) => {
      const profile = profileIndex.get(code);
      return !profile || (profile.region !== "EU" && profile.region !== "US" && profile.coverage_level !== "focused");
    });

    checks.push({
      gate: "jurisdiction_profiles_eu_coverage",
      status: profileIndex.has("EU") && missingEuProfiles.length === 0 ? "pass" : "fail",
      details:
        missingEuProfiles.length === 0
          ? "EU profile plus all EU-27 country profiles present"
          : `missing EU profiles: ${missingEuProfiles.join(", ")}`
    });
    checks.push({
      gate: "jurisdiction_profiles_us_coverage",
      status: profileIndex.has("US") && missingUsStateProfiles.length === 0 ? "pass" : "fail",
      details:
        missingUsStateProfiles.length === 0
          ? "US federal profile plus all state compatibility profiles present"
          : `missing US state profiles: ${missingUsStateProfiles.join(", ")}`
    });
    checks.push({
      gate: "jurisdiction_profiles_coverage_level",
      status: euProfileCoverageMismatch.length === 0 && usProfileCoverageMismatch.length === 0 ? "pass" : "fail",
      details:
        euProfileCoverageMismatch.length === 0 && usProfileCoverageMismatch.length === 0
          ? "EU profiles=full and US state profiles=minimum"
          : `coverage mismatches EU: ${euProfileCoverageMismatch.join(", ")} US: ${usProfileCoverageMismatch.join(", ")}`
    });
    checks.push({
      gate: "jurisdiction_profiles_nato_coverage",
      status: profileIndex.has("NATO") && missingNatoProfiles.length === 0 ? "pass" : "fail",
      details:
        missingNatoProfiles.length === 0
          ? "NATO aggregate plus all member profiles present"
          : `missing NATO profiles: ${missingNatoProfiles.join(", ")}`
    });
    checks.push({
      gate: "jurisdiction_profiles_nato_coverage_level",
      status: natoProfileCoverageMismatch.length === 0 ? "pass" : "fail",
      details:
        natoProfileCoverageMismatch.length === 0
          ? "NATO members mapped via EU/US or focused NATO profile"
          : `NATO coverage mismatches: ${natoProfileCoverageMismatch.join(", ")}`
    });
    assert(profileIndex.has("EU"), "missing EU aggregate jurisdiction profile", failures);
    assert(profileIndex.has("US"), "missing US aggregate jurisdiction profile", failures);
    assert(profileIndex.has("NATO"), "missing NATO aggregate jurisdiction profile", failures);
    assert(missingEuProfiles.length === 0, "EU-27 jurisdiction profile coverage incomplete", failures);
    assert(missingUsStateProfiles.length === 0, "US state jurisdiction profile coverage incomplete", failures);
    assert(missingNatoProfiles.length === 0, "NATO member jurisdiction profile coverage incomplete", failures);
    assert(
      euProfileCoverageMismatch.length === 0 && usProfileCoverageMismatch.length === 0,
      "jurisdiction profile coverage_level assignments are inconsistent",
      failures
    );
    assert(natoProfileCoverageMismatch.length === 0, "NATO jurisdiction profile coverage_level assignments are inconsistent", failures);

    const euCoverageMissing = seed.dataCategories.filter((category) => {
      const protections = category.jurisdiction_protections || {};
      return seed.EU_MEMBER_STATE_CODES.some((code) => !protections[code]);
    });
    checks.push({
      gate: "eu_member_state_data_coverage",
      status: euCoverageMissing.length === 0 ? "pass" : "fail",
      details: euCoverageMissing.length === 0 ? "all data categories include EU-27 coverage" : `${euCoverageMissing.length} categories missing EU member mappings`
    });
    assert(euCoverageMissing.length === 0, "not all data categories include EU-27 jurisdiction mappings", failures);

    const requiredUsMinimumCategories = [
      "cui",
      "itar-controlled",
      "ear-controlled",
      "fci",
      "nato-classified",
      "national-classified",
      "weapons-system-data",
      "intelligence-data",
      "tempest-emissions",
      "program-protection",
      "supply-chain-data"
    ];
    const usCoverageMissing = requiredUsMinimumCategories.filter((id) => {
      const category = seed.dataCategories.find((entry) => entry.id === id);
      if (!category) {
        return true;
      }
      return !(category.jurisdiction_protections || {}).US;
    });
    checks.push({
      gate: "us_minimum_data_coverage",
      status: usCoverageMissing.length === 0 ? "pass" : "fail",
      details: usCoverageMissing.length === 0 ? "US minimum data coverage present" : `missing US mappings: ${usCoverageMissing.join(", ")}`
    });
    assert(usCoverageMissing.length === 0, "US minimum data coverage is incomplete", failures);

    const natoCoverageMissing = seed.dataCategories.filter((category) => {
      const protections = category.jurisdiction_protections || {};
      return seed.NATO_MEMBER_CODES.some((code) => !protections[code]);
    });
    checks.push({
      gate: "nato_member_state_data_coverage",
      status: natoCoverageMissing.length === 0 ? "pass" : "fail",
      details:
        natoCoverageMissing.length === 0
          ? "all data categories include NATO member-state coverage"
          : `${natoCoverageMissing.length} categories missing NATO mappings`
    });
    assert(natoCoverageMissing.length === 0, "not all data categories include NATO member-state jurisdiction mappings", failures);

    if (seed.sources.some((source) => source.knowledge_tier === "advisory")) {
      warnings.push("Advisory source present (NIST SP 800-172 Rev.3 FPD); ensure this is not treated as binding requirement text.");
    }

    const tools = makeTools(db, metadata);
    await runScenarioGates(tools, checks, failures);

    const passCount = checks.filter((check) => check.status === "pass").length;
    const failCount = checks.filter((check) => check.status === "fail").length + failures.length;

    const grade = failCount === 0 ? "A" : failCount <= 3 ? "B" : "C";

    const report = {
      generated_at: new Date().toISOString(),
      dataset_version: seed.DATASET_VERSION,
      knowledge_baseline_date: seed.KNOWLEDGE_BASELINE.baseline_date,
      grade,
      checks,
      failures,
      warnings,
      summary: {
        pass_count: passCount,
        fail_count: failCount,
        warning_count: warnings.length
      }
    };

    fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), "data", "golden-standard-report.json"), JSON.stringify(report, null, 2));

    process.stdout.write(`Golden standard grade: ${grade}\n`);
    process.stdout.write(`Pass checks: ${passCount}\n`);
    process.stdout.write(`Failures: ${failures.length}\n`);
    if (warnings.length > 0) {
      process.stdout.write(`Warnings: ${warnings.length}\n`);
    }

    if (grade !== "A") {
      process.exitCode = 1;
    }
  } finally {
    try {
      db.close();
    } catch {
      // ignore
    }
    try {
      fs.rmSync(path.join(process.cwd(), "data", "golden-audit.db"), { force: true });
      fs.rmSync(path.join(process.cwd(), "data", "golden-audit.db-shm"), { force: true });
      fs.rmSync(path.join(process.cwd(), "data", "golden-audit.db-wal"), { force: true });
    } catch {
      // ignore
    }
  }
})();
