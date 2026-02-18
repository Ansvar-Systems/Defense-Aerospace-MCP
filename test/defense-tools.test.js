"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { openDatabase } = require("../src/database");
const { makeTools } = require("../src/domain-service");

function createRuntime() {
  const dbPath = path.join(os.tmpdir(), `defense-mcp-test-${Date.now()}-${Math.random()}.db`);
  const { db, metadata } = openDatabase({ dbPath });
  const tools = makeTools(db, metadata);

  return {
    db,
    dbPath,
    tools,
    cleanup() {
      try {
        db.close();
      } catch {
        // ignore
      }
      try {
        fs.rmSync(dbPath, { force: true });
      } catch {
        // ignore
      }
    }
  };
}

test("about returns coverage metadata", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.about();
    assert.equal(response.data.domain, "defense-aerospace");
    assert.ok(response.data.coverage_summary.architecture_patterns >= 10);
    assert.ok(response.data.coverage_summary.nato_member_states_covered >= 32);
    assert.equal(response.metadata.dataset_version, "1.2.0");
  } finally {
    runtime.cleanup();
  }
});

test("classify_data maps missile guidance technical drawings to ITAR", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.classify_data({
      data_description: "technical drawings for missile guidance system exported to UK contractor",
      jurisdictions: ["US", "UK"]
    });

    const categoryIds = response.data.categories.map((item) => item.id);
    assert.ok(categoryIds.includes("itar-controlled"));
    assert.ok(response.data.applicable_regimes.some((entry) => entry.toLowerCase().includes("itar")));
    assert.equal(response.data.protection_tier, "restricted");
  } finally {
    runtime.cleanup();
  }
});

test("classify_data maps CUI subcontractor context", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.classify_data({
      data_description: "CUI Basic from DoD subcontractor in Sweden",
      jurisdictions: ["US", "SE"]
    });

    const categoryIds = response.data.categories.map((item) => item.id);
    assert.ok(categoryIds.includes("cui"));
    assert.ok(response.data.applicable_regimes.some((entry) => entry.includes("NIST SP 800-171")));
    assert.ok(response.data.applicable_regimes.some((entry) => entry.toLowerCase().includes("cmmc")));
  } finally {
    runtime.cleanup();
  }
});

test("classify_data maps NATO confidential plans", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.classify_data({
      data_description: "NATO CONFIDENTIAL operational plans shared with SE + NL",
      jurisdictions: ["SE", "NL"]
    });

    const categoryIds = response.data.categories.map((item) => item.id);
    assert.ok(categoryIds.includes("nato-classified"));
    assert.equal(response.data.protection_tier, "classified");
  } finally {
    runtime.cleanup();
  }
});

test("classify_export_control maps dual-use encryption to EAR with ENC path", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.classify_export_control({
      item_description: "dual-use encryption technology module",
      technical_params: "high-assurance cryptographic accelerator",
      destination: "EU"
    });

    assert.equal(response.data.jurisdiction, "EAR");
    assert.ok(response.data.classification.includes("ECCN"));
    assert.ok(response.data.exceptions.some((entry) => entry.includes("ENC")));
  } finally {
    runtime.cleanup();
  }
});

test("determine_cmmc_level returns Level 2 for CUI context", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.determine_cmmc_level({
      contract_description: "DoD avionics sustainment with CUI data handling",
      data_types: ["cui"],
      prime_or_sub: "prime_contractor",
      current_posture: { implemented_families: ["access control"] }
    });

    assert.equal(response.data.cmmc_level, "Level 2");
    assert.equal(response.data.practice_count, 110);
    assert.ok(response.data.gap_areas.length > 0);
  } finally {
    runtime.cleanup();
  }
});

test("determine_cmmc_level returns Level 3 for highest-priority context", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.determine_cmmc_level({
      contract_description: "highest-priority CUI weapons modernization program",
      data_types: ["cui", "highest_priority_cui"],
      prime_or_sub: "prime_contractor"
    });

    assert.equal(response.data.cmmc_level, "Level 3");
    assert.equal(response.data.practice_count, 134);
    assert.ok(response.data.assessment_type.includes("Government-led"));
  } finally {
    runtime.cleanup();
  }
});

test("get_domain_threats includes counterfeit parts references", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.get_domain_threats({
      architecture_pattern: "da-supply-chain",
      data_types: ["supply-chain-data"]
    });

    const threatIds = response.data.threats.map((item) => item.id);
    assert.ok(threatIds.includes("da-threat-counterfeit-parts"));
    assert.ok(response.metadata.foundation_mcp_calls.length > 0);
  } finally {
    runtime.cleanup();
  }
});

test("assess_applicability maps US prime CUI DoD obligations", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US",
      role: "prime_contractor",
      data_types: ["cui"],
      system_types: ["da-cui-environment"],
      additional_context: { programs: ["DoD"] }
    });

    const regulationIds = response.data.obligations.map((item) => item.regulation_id);
    assert.ok(regulationIds.includes("CMMC_2_0"));
    assert.ok(regulationIds.includes("NISPOM_32_CFR_117"));
  } finally {
    runtime.cleanup();
  }
});

test("compare_jurisdictions returns ITAR vs EU dual-use matrix", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.compare_jurisdictions({
      topic: "Compare ITAR (US) vs EU dual-use regulation",
      jurisdictions: ["US", "EU"]
    });

    assert.equal(response.data.comparison_matrix.length, 2);
    assert.ok(response.data.comparison_matrix.some((item) => item.framework.includes("ITAR")));
  } finally {
    runtime.cleanup();
  }
});

test("assess_classified_environment returns NATO controls", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_classified_environment({
      classification_level: "NATO CONFIDENTIAL",
      country: "SE",
      system_type: "da-classified-enclave"
    });

    assert.ok(response.data.accreditation_standard.includes("NATO"));
    assert.ok(response.data.technical_controls.some((entry) => entry.includes("STANAG 4774")));
  } finally {
    runtime.cleanup();
  }
});

test("assess_nato_interoperability returns STANAG requirements", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_nato_interoperability({
      sharing_scope: "coalition ISR exchange",
      classification: "NATO RESTRICTED",
      participating_nations: ["SE", "NL", "US"]
    });

    const standardIds = response.data.stanag_requirements.map((item) => item.standard_id);
    assert.ok(standardIds.includes("NATO_STANAG_4774"));
    assert.ok(standardIds.includes("NATO_STANAG_4778"));
  } finally {
    runtime.cleanup();
  }
});

test("search_domain_knowledge redirects out-of-scope healthcare query", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.search_domain_knowledge({
      query: "HL7 FHIR security"
    });

    assert.equal(response.data.results.length, 0);
    assert.ok(response.data.guidance.includes("healthcare"));
    assert.ok(response.metadata.out_of_scope.length > 0);
  } finally {
    runtime.cleanup();
  }
});

test("search_domain_knowledge redirects out-of-scope automotive query", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.search_domain_knowledge({
      query: "AUTOSAR SOVD and UNECE R155 controls"
    });

    assert.equal(response.data.results.length, 0);
    assert.ok(response.data.guidance.includes("automotive-cybersecurity"));
    assert.ok(response.metadata.out_of_scope.length > 0);
  } finally {
    runtime.cleanup();
  }
});

test("build_evidence_plan returns CMMC SSP artifact", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.build_evidence_plan({
      audit_type: "CMMC Level 2",
      baseline: { controls: ["AC-3", "AU-6"] }
    });

    const artifactNames = response.data.evidence_items.map((item) => item.artifact_name);
    assert.ok(artifactNames.includes("System Security Plan (SSP)"));
  } finally {
    runtime.cleanup();
  }
});

test("assess_breach_obligations returns DFARS 72-hour notification for US CUI", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_breach_obligations({
      incident_description: "Ransomware in CUI enclave",
      jurisdictions: ["US"],
      data_types: ["cui"]
    });

    assert.ok(response.data.notifications.some((item) => item.deadline.includes("72")));
    assert.ok(response.data.notifications.some((item) => item.recipient.includes("DoD")));
  } finally {
    runtime.cleanup();
  }
});

test("about includes knowledge baseline highlights", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.about();
    assert.equal(response.data.knowledge_baseline.baseline_date, "2026-02-18");
    assert.ok(response.data.knowledge_baseline.highlights.some((entry) => entry.includes("32 CFR Part 170")));
    assert.equal(response.data.coverage_summary.eu_member_states_covered, 27);
  } finally {
    runtime.cleanup();
  }
});

test("list_sources returns source freshness metadata", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.list_sources({});
    assert.ok(response.data.entries.length >= 10);
    const cmmcSource = response.data.entries.find((entry) => entry.id === "dod-cmmc-32cfr170");
    assert.ok(cmmcSource);
    assert.equal(cmmcSource.effective_date, "2024-12-16");
    assert.equal(cmmcSource.knowledge_tier, "authoritative");
    assert.ok(response.data.freshness_summary.authoritative_sources >= 10);
  } finally {
    runtime.cleanup();
  }
});

test("list_sources supports deterministic pagination metadata", async () => {
  const runtime = createRuntime();
  try {
    const pageOne = await runtime.tools.list_sources({ limit: 2, offset: 0 });
    const pageTwo = await runtime.tools.list_sources({ limit: 2, offset: 2 });

    assert.equal(pageOne.data.limit, 2);
    assert.equal(pageOne.data.offset, 0);
    assert.equal(pageOne.data.returned, 2);
    assert.ok(pageOne.data.total_matches >= 10);
    assert.ok(pageOne.data.has_more);
    assert.equal(pageTwo.data.offset, 2);
    assert.notEqual(pageOne.data.entries[0].id, pageTwo.data.entries[0].id);
  } finally {
    runtime.cleanup();
  }
});

test("list_jurisdiction_profiles returns full EU coverage profiles", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.list_jurisdiction_profiles({
      region: "EU",
      coverage_level: "full",
      limit: 200
    });

    assert.ok(response.data.entries.length >= 28);
    assert.ok(response.data.entries.some((entry) => entry.jurisdiction === "EU"));
    assert.ok(response.data.entries.some((entry) => entry.jurisdiction === "FR"));
    assert.ok(response.data.entries.some((entry) => entry.jurisdiction === "SE"));
  } finally {
    runtime.cleanup();
  }
});

test("list_jurisdiction_profiles supports offset pagination", async () => {
  const runtime = createRuntime();
  try {
    const firstPage = await runtime.tools.list_jurisdiction_profiles({
      region: "US",
      coverage_level: "minimum",
      limit: 5,
      offset: 0
    });
    const secondPage = await runtime.tools.list_jurisdiction_profiles({
      region: "US",
      coverage_level: "minimum",
      limit: 5,
      offset: 5
    });

    assert.equal(firstPage.data.returned, 5);
    assert.equal(firstPage.data.limit, 5);
    assert.equal(firstPage.data.offset, 0);
    assert.ok(firstPage.data.total_matches >= 52);
    assert.equal(secondPage.data.offset, 5);
    assert.notEqual(firstPage.data.entries[0].id, secondPage.data.entries[0].id);
  } finally {
    runtime.cleanup();
  }
});

test("list_jurisdiction_profiles returns US minimum federal and state coverage", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.list_jurisdiction_profiles({
      region: "US",
      coverage_level: "minimum",
      limit: 200
    });

    assert.ok(response.data.entries.length >= 52);
    assert.ok(response.data.entries.some((entry) => entry.jurisdiction === "US"));
    assert.ok(response.data.entries.some((entry) => entry.jurisdiction === "US-CA"));
  } finally {
    runtime.cleanup();
  }
});

test("build_control_baseline enforces required org_profile input", async () => {
  const runtime = createRuntime();
  try {
    await assert.rejects(
      () => runtime.tools.build_control_baseline({}),
      /org_profile is required/
    );
  } finally {
    runtime.cleanup();
  }
});

test("determine_cmmc_level enforces required fields", async () => {
  const runtime = createRuntime();
  try {
    await assert.rejects(
      () =>
        runtime.tools.determine_cmmc_level({
          data_types: ["cui"],
          prime_or_sub: "prime_contractor"
        }),
      /contract_description is required/
    );
  } finally {
    runtime.cleanup();
  }
});

test("assess_nato_interoperability enforces participating nations input", async () => {
  const runtime = createRuntime();
  try {
    await assert.rejects(
      () =>
        runtime.tools.assess_nato_interoperability({
          sharing_scope: "coalition operation",
          classification: "NATO RESTRICTED",
          participating_nations: []
        }),
      /participating_nations is required/
    );
  } finally {
    runtime.cleanup();
  }
});

test("list_jurisdiction_profiles returns NATO-focused member coverage", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.list_jurisdiction_profiles({
      region: "NATO",
      coverage_level: "focused",
      limit: 200
    });

    assert.ok(response.data.entries.length >= 9);
    assert.ok(response.data.entries.some((entry) => entry.jurisdiction === "NATO"));
    assert.ok(response.data.entries.some((entry) => entry.jurisdiction === "NO"));
    assert.ok(response.data.entries.some((entry) => entry.jurisdiction === "UK"));
  } finally {
    runtime.cleanup();
  }
});

test("get_jurisdiction_profile resolves EU member profile with baseline obligations", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.get_jurisdiction_profile({
      jurisdiction: "FR"
    });

    assert.equal(response.data.profile.region, "EU");
    assert.equal(response.data.profile.coverage_level, "full");
    assert.ok(response.data.profile.baseline_obligations.includes("NIS2_DIRECTIVE_2022_2555"));
    assert.ok(response.data.related_rule_count >= 1);
  } finally {
    runtime.cleanup();
  }
});

test("get_jurisdiction_profile resolves NATO member profile", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.get_jurisdiction_profile({
      jurisdiction: "NO"
    });

    assert.equal(response.data.profile.region, "NATO");
    assert.equal(response.data.profile.coverage_level, "focused");
    assert.ok(response.data.profile.baseline_obligations.includes("NATO_C_M_2002_49"));
  } finally {
    runtime.cleanup();
  }
});

test("get_jurisdiction_profile resolves US state profile", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.get_jurisdiction_profile({
      jurisdiction: "US-CA"
    });

    assert.equal(response.data.profile.region, "US");
    assert.equal(response.data.profile.coverage_level, "minimum");
    assert.ok(response.data.profile.baseline_obligations.includes("CMMC_2_0"));
  } finally {
    runtime.cleanup();
  }
});

test("get_coverage_matrix reports complete EU/US and NATO-focused coverage", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.get_coverage_matrix();

    assert.equal(response.data.eu_coverage.full_coverage, true);
    assert.equal(response.data.us_coverage.minimum_coverage, true);
    assert.equal(response.data.nato_coverage.focused_coverage, true);
    assert.equal(response.data.nato_coverage.expected_member_states, 32);
  } finally {
    runtime.cleanup();
  }
});

test("get_expertise_scorecard enforces strict expert threshold without hard failures", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.get_expertise_scorecard({
      strict: true,
      max_source_age_days: 365
    });

    assert.ok(response.data.overall_score >= 95);
    assert.ok(response.data.grade.startsWith("A"));
    assert.equal(response.data.hard_failures.length, 0);
    assert.ok(response.data.dimensions.jurisdiction_coverage.score >= 99);
    assert.ok(response.data.dimensions.source_quality.score >= 95);
  } finally {
    runtime.cleanup();
  }
});

test("list_expert_playbooks returns relevant workflows for export scenarios", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.list_expert_playbooks({
      topic: "deemed export technical data",
      jurisdiction: "US",
      limit: 5
    });

    assert.ok(response.data.entries.length >= 1);
    assert.ok(response.data.entries.some((entry) => entry.id === "pb-deemed-export-decision-flow"));
  } finally {
    runtime.cleanup();
  }
});

test("get_expert_playbook returns actionable step-by-step content", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.get_expert_playbook({
      playbook_id: "pb-nato-classified-sharing-release"
    });

    assert.equal(response.data.playbook.id, "pb-nato-classified-sharing-release");
    assert.ok(Array.isArray(response.data.playbook.steps));
    assert.ok(response.data.playbook.steps.length >= 4);
    assert.ok(response.data.playbook.regulation_basis.some((entry) => entry.regulation_id === "NATO_C_M_2002_49"));
  } finally {
    runtime.cleanup();
  }
});

test("determine_cmmc_level includes phase-in timeline metadata", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.determine_cmmc_level({
      contract_description: "DoD program handling CUI with phased implementation",
      data_types: ["cui"],
      prime_or_sub: "prime_contractor"
    });

    assert.equal(response.data.implementation_timeline.dfars_cmmc_effective, "2025-11-10");
    assert.equal(response.data.implementation_timeline.full_phase_in_target, "2028-11-10");
  } finally {
    runtime.cleanup();
  }
});

test("map_to_technical_standards maps CMMC references", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.map_to_technical_standards({
      requirement_ref: "CMMC Level 2 NIST 800-171"
    });

    const standardIds = response.data.standard_mappings.map((entry) => entry.standard_id);
    assert.ok(standardIds.includes("CMMC_2_0"));
    assert.ok(standardIds.includes("NIST_SP_800_171"));
  } finally {
    runtime.cleanup();
  }
});

test("map_to_technical_standards maps DFARS assessment and supply-chain standards", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.map_to_technical_standards({
      requirement_ref: "DFARS 252.204-7019 252.204-7020 NIST SP 800-161 supply chain"
    });

    const standardIds = response.data.standard_mappings.map((entry) => entry.standard_id);
    assert.ok(standardIds.includes("DFARS_7019_ASSESSMENT"));
    assert.ok(standardIds.includes("DFARS_7020_ASSESSMENT"));
    assert.ok(standardIds.includes("NIST_SP_800_161"));
  } finally {
    runtime.cleanup();
  }
});

test("map_to_technical_standards maps aerospace airworthiness assurance standards", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.map_to_technical_standards({
      requirement_ref: "DO-355 DO-178C DO-254 ARP4754A ARP4761A"
    });

    const standardIds = response.data.standard_mappings.map((entry) => entry.standard_id);
    assert.ok(standardIds.includes("DO_355"));
    assert.ok(standardIds.includes("DO_178C"));
    assert.ok(standardIds.includes("DO_254"));
    assert.ok(standardIds.includes("ARP4754A"));
    assert.ok(standardIds.includes("ARP4761A"));
  } finally {
    runtime.cleanup();
  }
});

test("map_to_technical_standards maps aerospace regulatory and incident governance standards", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.map_to_technical_standards({
      requirement_ref: "EASA Part-IS NIST SP 800-37 NIST SP 800-61"
    });

    const standardIds = response.data.standard_mappings.map((entry) => entry.standard_id);
    assert.ok(standardIds.includes("EASA_PART_IS"));
    assert.ok(standardIds.includes("NIST_SP_800_37"));
    assert.ok(standardIds.includes("NIST_SP_800_61"));
    assert.ok(!standardIds.includes("CMMC_2_0"));
  } finally {
    runtime.cleanup();
  }
});

test("map_to_technical_standards maps NATO interoperability and space mission standards", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.map_to_technical_standards({
      requirement_ref: "STANAG 4586 STANAG 4609 STANAG 5516 ECSS-E-ST-40C NASA NPR 7150.2"
    });

    const standardIds = response.data.standard_mappings.map((entry) => entry.standard_id);
    assert.ok(standardIds.includes("NATO_STANAG_4586"));
    assert.ok(standardIds.includes("NATO_STANAG_4609"));
    assert.ok(standardIds.includes("NATO_STANAG_5516"));
    assert.ok(standardIds.includes("ECSS_E_ST_40"));
    assert.ok(standardIds.includes("NASA_NPR_7150_2"));
  } finally {
    runtime.cleanup();
  }
});

test("map_to_technical_standards maps avionics and open architecture standards", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.map_to_technical_standards({
      requirement_ref: "MIL-STD-1553 MIL-STD-1760 DO-160 FACE Technical Standard SOSA Technical Standard"
    });

    const standardIds = response.data.standard_mappings.map((entry) => entry.standard_id);
    assert.ok(standardIds.includes("MIL_STD_1553"));
    assert.ok(standardIds.includes("MIL_STD_1760"));
    assert.ok(standardIds.includes("DO_160"));
    assert.ok(standardIds.includes("FACE_TS"));
    assert.ok(standardIds.includes("SOSA_TS"));
  } finally {
    runtime.cleanup();
  }
});

test("map_to_technical_standards maps defense qualification and aerospace quality standards", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.map_to_technical_standards({
      requirement_ref: "STANAG 4671 AS9100D AS9110C MIL-STD-810 MIL-STD-461 MIL-HDBK-516"
    });

    const standardIds = response.data.standard_mappings.map((entry) => entry.standard_id);
    assert.ok(standardIds.includes("NATO_STANAG_4671"));
    assert.ok(standardIds.includes("AS9100D_QMS"));
    assert.ok(standardIds.includes("AS9110C_MRO_QMS"));
    assert.ok(standardIds.includes("MIL_STD_810"));
    assert.ok(standardIds.includes("MIL_STD_461"));
    assert.ok(standardIds.includes("MIL_HDBK_516"));
  } finally {
    runtime.cleanup();
  }
});

test("map_to_technical_standards redirects out-of-scope automotive references", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.map_to_technical_standards({
      requirement_ref: "AUTOSAR SOVD ISO/SAE 21434 UNECE R155"
    });

    assert.equal(response.data.standard_mappings.length, 0);
    assert.ok(response.data.guidance.includes("automotive-cybersecurity"));
    assert.ok(response.metadata.out_of_scope.length > 0);
  } finally {
    runtime.cleanup();
  }
});

test("classify_export_control maps missile description to ITAR", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.classify_export_control({
      item_description: "flight control and missile guidance package",
      destination: "UK"
    });

    assert.equal(response.data.jurisdiction, "ITAR");
    assert.equal(response.data.license_required, true);
  } finally {
    runtime.cleanup();
  }
});

test("create_remediation_backlog derives missing controls from target baseline", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.create_remediation_backlog({
      current_state: {
        controls_implemented: ["AC-3"]
      },
      target_baseline: {
        controls: [
          { control_id: "AC-3", priority: "high", regulation_basis: ["NIST SP 800-171"] },
          { control_id: "AU-6", priority: "high", regulation_basis: ["DFARS 252.204-7012"] }
        ]
      }
    });

    assert.ok(response.data.backlog_items.some((item) => item.title.includes("AU-6")));
    assert.ok(!response.data.backlog_items.some((item) => item.title.includes("AC-3")));
  } finally {
    runtime.cleanup();
  }
});

test("edge case profile captures overlapping Swedish and export obligations", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "SE",
      role: "defense_subcontractor",
      data_types: ["cui", "nato-classified", "itar-controlled"],
      system_types: ["da-supply-chain"],
      additional_context: {
        export: ["EU"],
        tags: ["coalition_sharing"]
      }
    });

    const regulationIds = response.data.obligations.map((entry) => entry.regulation_id);
    assert.ok(regulationIds.includes("SE_DEFENSE_SECURITY_PROCUREMENT"));
    assert.ok(regulationIds.includes("NATO_FSC_HANDLING"));
    assert.ok(regulationIds.includes("EU_DUAL_USE"));
  } finally {
    runtime.cleanup();
  }
});

test("NATO applicability baseline resolves for Norway classified sharing context", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "NO",
      role: "defense_subcontractor",
      data_types: ["nato-classified"],
      system_types: ["da-classified-enclave"]
    });

    const regulationIds = response.data.obligations.map((entry) => entry.regulation_id);
    assert.ok(regulationIds.includes("NATO_FSC_HANDLING"));
    assert.ok(response.data.context.country_contexts.includes("NATO"));
  } finally {
    runtime.cleanup();
  }
});

test("full EU coverage resolves applicability for France", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "FR",
      role: "defense_subcontractor",
      data_types: ["supply-chain-data"],
      system_types: ["da-supply-chain"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NIS2_DIRECTIVE_2022_2555"));
  } finally {
    runtime.cleanup();
  }
});

test("US minimum coverage resolves applicability for US state context", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US-CA",
      role: "prime_contractor",
      data_types: ["cui"],
      system_types: ["da-cui-environment"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "CMMC_2_0"));
    assert.ok(response.data.context.country_contexts.includes("US"));
    assert.ok(response.data.context.jurisdiction_profile);
    assert.equal(response.data.context.jurisdiction_profile.coverage_level, "minimum");
  } finally {
    runtime.cleanup();
  }
});

test("US supply-chain applicability includes SCRM and assessment obligations", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US",
      role: "defense_subcontractor",
      data_types: ["cui", "supply-chain-data"],
      system_types: ["da-supply-chain"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "DFARS_252.204-7019"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "DFARS_252.204-7020"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NIST_SP_800_161"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NIST_SP_800_61"));
  } finally {
    runtime.cleanup();
  }
});

test("EU aerospace applicability includes EASA Part-IS obligations", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "FR",
      role: "aerospace_oem",
      data_types: ["weapons-system-data"],
      system_types: ["aircraft"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "EASA_PART_IS_2023_203"));
  } finally {
    runtime.cleanup();
  }
});

test("NATO coalition UAV applicability includes interoperability STANAG obligations", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "SE",
      role: "aerospace_oem",
      data_types: ["nato-classified", "weapons-system-data"],
      system_types: ["da-uav", "da-c2"],
      additional_context: { tags: ["coalition_sharing"] }
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NATO_STANAG_4586"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NATO_STANAG_4609"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NATO_STANAG_5516"));
  } finally {
    runtime.cleanup();
  }
});

test("EU space applicability includes ECSS software standards", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "FR",
      role: "aerospace_oem",
      data_types: ["weapons-system-data"],
      system_types: ["da-satellite"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "ECSS_E_ST_40"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "ECSS_Q_ST_80"));
  } finally {
    runtime.cleanup();
  }
});

test("US space applicability includes NASA software governance baseline", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US",
      role: "aerospace_oem",
      data_types: ["weapons-system-data"],
      system_types: ["da-satellite"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NASA_NPR_7150_2"));
  } finally {
    runtime.cleanup();
  }
});

test("US avionics applicability includes MIL bus and interface standards", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US",
      role: "aerospace_oem",
      data_types: ["weapons-system-data"],
      system_types: ["da-weapons-system"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "MIL_STD_1553"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "MIL_STD_1760"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "DO_160"));
  } finally {
    runtime.cleanup();
  }
});

test("US mission-system applicability includes FACE and SOSA open architecture obligations", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US",
      role: "prime_contractor",
      data_types: ["weapons-system-data", "nato-classified"],
      system_types: ["da-c2"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "FACE_TS"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "SOSA_TS"));
  } finally {
    runtime.cleanup();
  }
});

test("US aerospace applicability includes qualification and quality management baselines", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US",
      role: "aerospace_oem",
      data_types: ["weapons-system-data", "program-protection", "supply-chain-data"],
      system_types: ["da-uav", "da-weapons-system"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "MIL_STD_810"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "MIL_STD_461"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "MIL_HDBK_516"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "AS9100D_QMS"));
    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "AS9110C_MRO_QMS"));
  } finally {
    runtime.cleanup();
  }
});

test("NATO UAV applicability includes STANAG 4671 airworthiness baseline", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "NO",
      role: "aerospace_oem",
      data_types: ["weapons-system-data", "nato-classified"],
      system_types: ["da-uav"]
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NATO_STANAG_4671"));
  } finally {
    runtime.cleanup();
  }
});

test("US DoD applicability includes RMF governance baseline", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US",
      role: "prime_contractor",
      data_types: ["cui"],
      system_types: ["da-cui-environment"],
      additional_context: { programs: ["DoD"] }
    });

    assert.ok(response.data.obligations.some((entry) => entry.regulation_id === "NIST_SP_800_37"));
  } finally {
    runtime.cleanup();
  }
});

test("EU member-state classification uses derived protections", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.classify_data({
      data_description: "dual-use encryption telemetry package",
      jurisdictions: ["FR"]
    });

    const firstCategory = response.data.categories[0];
    assert.ok(firstCategory);
    assert.ok(firstCategory.jurisdiction_protections.FR);
  } finally {
    runtime.cleanup();
  }
});

test("assess_applicability returns precedence ranking and clause references", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.assess_applicability({
      country: "US",
      role: "prime_contractor",
      data_types: ["cui", "itar-controlled"],
      system_types: ["da-cui-environment"],
      additional_context: { programs: ["DoD"] }
    });

    assert.ok(response.data.precedence);
    assert.ok(response.data.precedence.considered_rules >= 1);
    assert.ok(response.data.obligations.length > 0);
    assert.ok(response.data.obligations.some((entry) => Array.isArray(entry.clause_references) && entry.clause_references.length > 0));

    const scores = response.data.obligations.map((entry) => entry.precedence.precedence_score);
    const sortedScores = [...scores].sort((a, b) => b - a);
    assert.deepEqual(scores, sortedScores);
  } finally {
    runtime.cleanup();
  }
});

test("list_clause_references filters by regulation", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.list_clause_references({
      regulation_id: "CMMC_2_0"
    });

    assert.ok(response.data.clauses.length >= 1);
    assert.ok(response.data.clauses.every((entry) => entry.regulation_id === "CMMC_2_0"));
  } finally {
    runtime.cleanup();
  }
});

test("get_clause_reference resolves by clause id", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.get_clause_reference({
      clause_id: "clause-dfars-7012-d"
    });

    assert.equal(response.data.clause.regulation_id, "DFARS_252.204-7012_INCIDENT");
    assert.ok(response.data.clause.summary.toLowerCase().includes("72"));
  } finally {
    runtime.cleanup();
  }
});

test("search_domain_knowledge supports clause content type", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.search_domain_knowledge({
      query: "Article 21 risk management measures",
      content_type: "clause",
      limit: 5
    });

    assert.ok(response.data.results.length >= 1);
    assert.ok(response.data.results.every((entry) => entry.content_type === "clause_references"));
  } finally {
    runtime.cleanup();
  }
});

test("search_domain_knowledge supports all content type without SQL errors", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.search_domain_knowledge({
      query: "NIST SP 800-171 CMMC controls",
      content_type: "all",
      limit: 5
    });

    assert.ok(response.data.results.length >= 1);
    assert.ok(response.data.results.every((entry) => entry.content_type && entry.title));
  } finally {
    runtime.cleanup();
  }
});

test("search_domain_knowledge supports jurisdiction content type", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.search_domain_knowledge({
      query: "France NIS2 dual-use defense",
      content_type: "jurisdiction",
      limit: 5
    });

    assert.ok(response.data.results.length >= 1);
    assert.ok(response.data.results.every((entry) => entry.content_type === "jurisdiction_profiles"));
  } finally {
    runtime.cleanup();
  }
});

test("search_domain_knowledge supports playbook content type", async () => {
  const runtime = createRuntime();
  try {
    const response = await runtime.tools.search_domain_knowledge({
      query: "72-hour DFARS incident reporting workflow",
      content_type: "playbook",
      limit: 5
    });

    assert.ok(response.data.results.length >= 1);
    assert.ok(response.data.results.every((entry) => entry.content_type === "expert_playbooks"));
  } finally {
    runtime.cleanup();
  }
});
