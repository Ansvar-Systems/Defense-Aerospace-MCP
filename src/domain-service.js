"use strict";

const seed = require("./data/seed");

const TIER_PRIORITY = {
  low: 1,
  moderate: 2,
  high: 3,
  restricted: 4,
  classified: 5,
  very_high: 6
};

const REDIRECT_KEYWORDS = [
  {
    pattern: /(hl7|fhir|dicom|hipaa|ehr|pacs|telehealth)/i,
    mcp: "healthcare",
    reason: "Healthcare interoperability and clinical domains are outside Defense/Aerospace scope."
  },
  {
    pattern: /(swift|pci dss|open banking|trading|mifid|psd2|dora\b)/i,
    mcp: "financial-services",
    reason: "Financial services regulations and architectures are outside Defense/Aerospace scope."
  },
  {
    pattern: /(5g|telecom|nfv|cpni|calea)/i,
    mcp: "telecommunications",
    reason: "Telecommunications domain obligations are covered by the Telecommunications MCP."
  },
  {
    pattern:
      /(sovd|autosar|iso\/sae\s*21434|iso[\s-]*21434|unece\s*r?155|unece\s*r?156|wp\.?\s*29|csms|sums|doip|uds|obd-?ii|can\s*bus|automotive cybersecurity)/i,
    mcp: "automotive-cybersecurity",
    reason: "Automotive cybersecurity standards and diagnostics domains are covered by the Automotive Cybersecurity MCP."
  }
];

const DATA_CLASSIFICATION_MATCHERS = [
  { id: "itar-controlled", terms: ["itar", "usml", "missile", "munition", "guidance", "defense article", "technical drawing", "taa", "mla"] },
  { id: "ear-controlled", terms: ["ear", "eccn", "dual-use", "encryption", "5a002", "5d002", "ccl"] },
  { id: "cui", terms: ["cui", "controlled unclassified", "covered defense information", "cdi", "dod subcontractor"] },
  { id: "fci", terms: ["fci", "federal contract information", "far 52.204-21"] },
  { id: "nato-classified", terms: ["nato confidential", "nato restricted", "cosmic", "nato classified"] },
  { id: "eu-classified", terms: ["restreint ue", "eu classified", "tres secret ue"] },
  { id: "national-classified", terms: ["secret", "top secret", "classified", "national security"] },
  { id: "weapons-system-data", terms: ["weapon system", "flight test telemetry", "mission computer", "targeting", "aircraft telemetry"] },
  { id: "intelligence-data", terms: ["sigint", "humint", "imint", "intelligence product"] },
  { id: "tempest-emissions", terms: ["tempest", "emanations", "sdip-27"] },
  { id: "program-protection", terms: ["critical program information", "cpi", "program protection"] },
  { id: "supply-chain-data", terms: ["subcontractor", "parts sourcing", "counterfeit", "foci", "supplier"] }
];

class ToolInputError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ToolInputError";
    this.details = details;
  }
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function compact(arr) {
  return arr.filter((item) => item !== undefined && item !== null && item !== "");
}

function dedupeBy(items, keyFn) {
  const seen = new Set();
  const results = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    results.push(item);
  }
  return results;
}

const STANDARD_MATCH_STOPWORDS = new Set([
  "nist",
  "sp",
  "dfars",
  "dodi",
  "dod",
  "cfr",
  "rtca",
  "sae",
  "eurocae",
  "eu",
  "and",
  "the",
  "for",
  "with",
  "all",
  "any",
  "req",
  "requirement",
  "requirements",
  "control",
  "controls",
  "standard",
  "standards",
  "framework",
  "frameworks",
  "baseline",
  "guidance",
  "policy",
  "policies",
  "level",
  "rev",
  "revision",
  "part",
  "article",
  "section",
  "clause",
  "applicability",
  "security",
  "800",
  "252",
  "204"
]);

function normalizeMatchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokenizeForStandardMatch(value) {
  return dedupeBy(
    normalizeMatchText(value)
      .split(" ")
      .filter((token) => {
        if (!token) {
          return false;
        }
        if (STANDARD_MATCH_STOPWORDS.has(token)) {
          return false;
        }
        if (token.length <= 2 && !/^\d{3,}$/.test(token)) {
          return false;
        }
        return true;
      }),
    (token) => token
  );
}

function normalizeArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

function toText(value) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
}

function toBoundedInt(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(parsed, max));
}

function requireObject(value, fieldName) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ToolInputError(`${fieldName} is required`, { required: [fieldName] });
  }
}

function requireNonEmptyString(value, fieldName) {
  if (!toText(value).trim()) {
    throw new ToolInputError(`${fieldName} is required`, { required: [fieldName] });
  }
}

function requireNonEmptyArray(value, fieldName) {
  const values = normalizeArray(value).filter((entry) => entry !== undefined && entry !== null && String(entry).trim() !== "");
  if (values.length === 0) {
    throw new ToolInputError(`${fieldName} is required`, { required: [fieldName] });
  }
}

function normalizeTopic(topic) {
  return (topic || "").trim().toLowerCase();
}

const EU_MEMBER_SET = new Set(seed.EU_MEMBER_STATE_CODES || []);
const NATO_MEMBER_SET = new Set(seed.NATO_MEMBER_CODES || []);
const US_STATE_SET = new Set(seed.US_STATE_CODES || []);
const EU_NAME_TO_CODE = seed.EU_COUNTRY_NAME_TO_CODE || {};
const NATO_NAME_TO_CODE = seed.NATO_COUNTRY_NAME_TO_CODE || {};

function normalizeJurisdictionToken(value) {
  if (!value) {
    return "";
  }

  const raw = String(value).trim();
  if (!raw) {
    return "";
  }

  const lower = raw.toLowerCase();
  if (lower === "eu" || lower === "european union") {
    return "EU";
  }
  if (lower === "nato" || lower === "north atlantic treaty organization") {
    return "NATO";
  }
  if (lower === "us" || lower === "usa" || lower === "united states" || lower === "united states of america") {
    return "US";
  }
  if (lower === "el") {
    return "GR";
  }
  if (EU_NAME_TO_CODE[lower]) {
    return EU_NAME_TO_CODE[lower];
  }
  if (NATO_NAME_TO_CODE[lower]) {
    return NATO_NAME_TO_CODE[lower];
  }

  const upper = raw.toUpperCase();
  if (upper.startsWith("EU-")) {
    const code = upper.slice(3);
    return EU_MEMBER_SET.has(code) ? code : "EU";
  }
  if (upper.startsWith("US-")) {
    const code = upper.slice(3);
    return US_STATE_SET.has(code) ? `US-${code}` : "US";
  }

  if (EU_MEMBER_SET.has(upper)) {
    return upper;
  }
  if (NATO_MEMBER_SET.has(upper)) {
    return upper;
  }

  return upper;
}

function buildJurisdictionContexts(value) {
  const token = normalizeJurisdictionToken(value);
  const contexts = new Set();
  if (!token) {
    return [];
  }

  contexts.add(token);

  if (token === "EU") {
    contexts.add("EU-*");
  }
  if (token === "US") {
    contexts.add("US-*");
  }
  if (token === "NATO") {
    contexts.add("NATO-*");
  }

  if (token.startsWith("US-")) {
    contexts.add("US");
    contexts.add("US-*");
  }
  if (token.startsWith("EU-")) {
    contexts.add("EU");
    contexts.add("EU-*");
  }

  if (EU_MEMBER_SET.has(token)) {
    contexts.add("EU");
    contexts.add("EU-*");
    contexts.add(`EU-${token}`);
  }
  if (NATO_MEMBER_SET.has(token)) {
    contexts.add("NATO");
    contexts.add("NATO-*");
    contexts.add(`NATO-${token}`);
  }
  if (token.startsWith("NATO-")) {
    contexts.add("NATO");
    contexts.add("NATO-*");
  }

  return Array.from(contexts);
}

function isEuContext(value) {
  const token = normalizeJurisdictionToken(value);
  return token === "EU" || token.startsWith("EU-") || EU_MEMBER_SET.has(token);
}

function isUsContext(value) {
  const token = normalizeJurisdictionToken(value);
  return token === "US" || token.startsWith("US-");
}

function isNatoContext(value) {
  const token = normalizeJurisdictionToken(value);
  return token === "NATO" || token.startsWith("NATO-") || NATO_MEMBER_SET.has(token);
}

function resolveJurisdictionProtection(protections, requestedJurisdiction) {
  const requested = normalizeJurisdictionToken(requestedJurisdiction);
  if (!requested || !protections) {
    return null;
  }

  const contexts = buildJurisdictionContexts(requested);
  for (const candidate of contexts) {
    if (protections[candidate]) {
      return {
        requested_jurisdiction: requested,
        derived_from: candidate === requested ? null : candidate,
        details: protections[candidate]
      };
    }
  }

  if (isEuContext(requested)) {
    for (const code of seed.EU_MEMBER_STATE_CODES || []) {
      if (protections[code]) {
        return {
          requested_jurisdiction: requested,
          derived_from: code,
          details: protections[code]
        };
      }
    }
  }

  if (isUsContext(requested) && protections.US) {
    return {
      requested_jurisdiction: requested,
      derived_from: requested === "US" ? null : "US",
      details: protections.US
    };
  }

  if (isNatoContext(requested) && protections.NATO) {
    return {
      requested_jurisdiction: requested,
      derived_from: requested === "NATO" ? null : "NATO",
      details: protections.NATO
    };
  }

  return null;
}

function normalizeJurisdictionList(values) {
  return dedupeBy(
    normalizeArray(values)
      .map((entry) => normalizeJurisdictionToken(entry))
      .filter(Boolean),
    (entry) => entry
  );
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  return null;
}

function resolveJurisdictionProfile(jurisdiction) {
  const requested = normalizeJurisdictionToken(jurisdiction);
  if (!requested) {
    return null;
  }

  const catalog = seed.jurisdictionProfiles || [];
  if (catalog.length === 0) {
    return null;
  }

  const byJurisdiction = new Map(catalog.map((profile) => [profile.jurisdiction, profile]));
  const contexts = buildJurisdictionContexts(requested);

  for (const context of contexts) {
    const profile = byJurisdiction.get(context);
    if (profile) {
      return {
        requested_jurisdiction: requested,
        derived_from: context === requested ? null : context,
        profile
      };
    }
  }

  if (isEuContext(requested) && byJurisdiction.get("EU")) {
    return {
      requested_jurisdiction: requested,
      derived_from: "EU",
      profile: byJurisdiction.get("EU")
    };
  }
  if (isUsContext(requested) && byJurisdiction.get("US")) {
    return {
      requested_jurisdiction: requested,
      derived_from: "US",
      profile: byJurisdiction.get("US")
    };
  }
  if (isNatoContext(requested) && byJurisdiction.get("NATO")) {
    return {
      requested_jurisdiction: requested,
      derived_from: "NATO",
      profile: byJurisdiction.get("NATO")
    };
  }

  return null;
}

function jurisdictionProfileSearchScore(profile, query) {
  const normalizedQuery = toText(query).toLowerCase();
  if (!normalizedQuery) {
    return null;
  }

  const tokens = normalizedQuery.split(/\s+/).filter((token) => token.length >= 2).slice(0, 12);
  const haystack = [
    profile.jurisdiction,
    profile.display_name,
    profile.region,
    profile.coverage_level,
    ...(profile.baseline_obligations || []),
    ...(profile.incident_reporting_model || [])
  ]
    .join(" ")
    .toLowerCase();

  if (tokens.length === 0) {
    return { raw_score: 80, relevance_score: 0.2 };
  }

  let matchedTokens = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) {
      matchedTokens += 1;
    }
  }
  if (matchedTokens === 0) {
    return null;
  }

  const exactJurisdictionBonus = haystack.includes(normalizedQuery) ? 8 : 0;
  const rawScore = Math.max(1, 100 - matchedTokens * 10 - exactJurisdictionBonus);
  const relevanceScore = Number((matchedTokens / tokens.length).toFixed(4));
  return { raw_score: rawScore, relevance_score: relevanceScore };
}

function makeCitationMap() {
  const citationsBySource = new Map();
  for (const source of seed.sources) {
    citationsBySource.set(source.id, {
      type: "SOURCE",
      ref: source.name,
      source_url: source.source_url
    });
  }
  return citationsBySource;
}

function buildMetadataEnvelope(metadataMap, options = {}) {
  const citations = dedupeBy(compact(options.citations || []), (item) => {
    return `${item.type || ""}|${item.ref || ""}|${item.source_url || ""}`;
  });

  return {
    citations,
    effective_date: seed.EFFECTIVE_DATE,
    confidence: options.confidence || "inferred",
    inference_rationale:
      options.inference_rationale ||
      "Derived by applying seeded domain crosswalks and deterministic rule matching.",
    last_verified: seed.LAST_UPDATED,
    dataset_version: metadataMap.dataset_version || seed.DATASET_VERSION,
    dataset_fingerprint: metadataMap.dataset_fingerprint || "unknown",
    out_of_scope: options.out_of_scope || [],
    foundation_mcp_calls: options.foundation_mcp_calls || []
  };
}

function wrapResponse(data, metadataMap, options = {}) {
  return {
    data,
    metadata: buildMetadataEnvelope(metadataMap, options)
  };
}

function mapRegulationToFoundationCall(reference) {
  const id = (reference.regulation_id || "").toLowerCase();

  if (
    id.includes("gdpr") ||
    id.includes("eu") ||
    id.includes("nato") ||
    id.includes("nis2") ||
    id.includes("directive_2022_2555") ||
    id.includes("euci")
  ) {
    return {
      mcp: "eu-regulations",
      tool: "get_article",
      params: { regulation: reference.regulation_id, article: reference.section || "n/a" }
    };
  }

  if (id.includes("itar") || id.includes("ear")) {
    return {
      mcp: "us-law",
      tool: "get_provision",
      params: { regulation: reference.regulation_id, section: reference.section || "n/a" }
    };
  }

  if (id.includes("nist") || id.includes("cmmc") || id.includes("dfars") || id.includes("dodi") || id.includes("nispom")) {
    return {
      mcp: "us-regulations",
      tool: "get_section",
      params: { regulation: reference.regulation_id, section: reference.section || "n/a" }
    };
  }

  return {
    mcp: "security-controls",
    tool: "get_control",
    params: { framework: "crosswalk", control: reference.regulation_id }
  };
}

function shouldRedirect(query) {
  const text = (query || "").trim();
  for (const candidate of REDIRECT_KEYWORDS) {
    if (candidate.pattern.test(text)) {
      return candidate;
    }
  }
  return null;
}

function parsePatternRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    components: parseJson(row.components, []),
    trust_boundaries: parseJson(row.trust_boundaries, []),
    data_flows: parseJson(row.data_flows, []),
    integration_points: parseJson(row.integration_points, []),
    known_weaknesses: parseJson(row.known_weaknesses, []),
    applicable_standards: parseJson(row.applicable_standards, []),
    regulatory_hot_spots: parseJson(row.regulatory_hot_spots, []),
    citations: parseJson(row.citations, [])
  };
}

function parseDataCategoryRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    boundary_conditions: row.boundary_conditions,
    jurisdiction_protections: parseJson(row.jurisdiction_protections, {}),
    deidentification_requirements: parseJson(row.deidentification_requirements, []),
    cross_border_constraints: parseJson(row.cross_border_constraints, []),
    required_controls: parseJson(row.required_controls, []),
    permitted_uses: parseJson(row.permitted_uses, []),
    citations: parseJson(row.citations, [])
  };
}

function parseThreatRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    attack_narrative: row.attack_narrative,
    mitre_mapping: parseJson(row.mitre_mapping, []),
    affected_patterns: parseJson(row.affected_patterns, []),
    affected_data_categories: parseJson(row.affected_data_categories, []),
    likelihood_factors: parseJson(row.likelihood_factors, {}),
    impact_dimensions: parseJson(row.impact_dimensions, {}),
    severity: row.severity,
    regulation_refs: parseJson(row.regulation_refs, []),
    control_refs: parseJson(row.control_refs, []),
    detection_indicators: parseJson(row.detection_indicators, []),
    historical_incidents: parseJson(row.historical_incidents, []),
    citations: parseJson(row.citations, [])
  };
}

function parseStandardRow(row) {
  return {
    id: row.id,
    name: row.name,
    version: row.version,
    publisher: row.publisher,
    scope: row.scope,
    key_clauses: parseJson(row.key_clauses, []),
    control_mappings: parseJson(row.control_mappings, []),
    regulation_mappings: parseJson(row.regulation_mappings, []),
    implementation_guidance: row.implementation_guidance,
    licensing_restrictions: row.licensing_restrictions,
    citations: parseJson(row.citations, [])
  };
}

function parseRuleRow(row) {
  return {
    id: row.id,
    condition: parseJson(row.condition_json, {}),
    obligation: parseJson(row.obligation_json, {}),
    rationale: row.rationale,
    citations: parseJson(row.citations, [])
  };
}

function parseEvidenceRow(row) {
  return {
    id: row.id,
    audit_type: row.audit_type,
    artifact_name: row.artifact_name,
    description: row.description,
    mandatory: row.mandatory === 1,
    retention_period: row.retention_period,
    template_ref: row.template_ref,
    regulation_basis: parseJson(row.regulation_basis, []),
    citations: parseJson(row.citations, [])
  };
}

function parseClauseReferenceRow(row) {
  return {
    id: row.id,
    regulation_id: row.regulation_id,
    provision_ref: row.provision_ref,
    title: row.title,
    summary: row.summary,
    source_id: row.source_id,
    source_url: row.source_url,
    legal_force: row.legal_force,
    jurisdiction_scope: row.jurisdiction_scope,
    effective_date: row.effective_date,
    last_verified: row.last_verified,
    status: row.status
  };
}

function parseExpertPlaybookRow(row) {
  return {
    id: row.id,
    name: row.name,
    scenario: row.scenario,
    jurisdictions: parseJson(row.jurisdictions, []),
    data_types: parseJson(row.data_types, []),
    when_to_use: parseJson(row.when_to_use, []),
    steps: parseJson(row.steps, []),
    common_failure_modes: parseJson(row.common_failure_modes, []),
    evidence_outputs: parseJson(row.evidence_outputs, []),
    regulation_basis: parseJson(row.regulation_basis, []),
    citations: parseJson(row.citations, []),
    last_verified: row.last_verified || seed.LAST_UPDATED
  };
}

function confidenceWeight(confidence) {
  const value = String(confidence || "").toLowerCase();
  if (value === "authoritative") {
    return 40;
  }
  if (value === "inferred") {
    return 24;
  }
  if (value === "estimated") {
    return 12;
  }
  return 10;
}

function legalForceWeight(legalForce) {
  const value = String(legalForce || "").toLowerCase();
  if (value === "regulation") {
    return 38;
  }
  if (value === "directive") {
    return 30;
  }
  if (value === "decision") {
    return 28;
  }
  if (value === "alliance-policy") {
    return 24;
  }
  if (value === "standard-policy") {
    return 18;
  }
  return 10;
}

function citationAuthorityWeight(citations) {
  const weights = {
    CFR: 28,
    DFARS: 28,
    FAR: 26,
    EU: 26,
    DODI: 22,
    NIST: 18,
    NATO: 17,
    IC: 16,
    RTCA: 14,
    SOURCE: 10
  };

  let max = 10;
  for (const citation of normalizeArray(citations)) {
    const key = String(citation.type || "").toUpperCase();
    const score = weights[key] || 10;
    if (score > max) {
      max = score;
    }
  }

  return max;
}

function inferLegalForceFromRegulationId(regulationId) {
  const id = String(regulationId || "").toLowerCase();
  if (id.includes("cfr") || id.includes("dfars") || id.includes("far") || id.includes("itar") || id.includes("ear")) {
    return "regulation";
  }
  if (id.includes("directive")) {
    return "directive";
  }
  if (id.includes("decision")) {
    return "decision";
  }
  if (id.includes("nato") || id.includes("stanag")) {
    return "alliance-policy";
  }
  if (id.includes("nist") || id.includes("dodi") || id.includes("cmmc")) {
    return "standard-policy";
  }
  return "guidance";
}

function inferConflictGroupFromRegulationId(regulationId) {
  const id = String(regulationId || "").toLowerCase();
  if (id.includes("itar") || id.includes("ear") || id.includes("dual_use")) {
    return "export-control";
  }
  if (id.includes("nato") || id.includes("euci") || id.includes("nispom")) {
    return "classified-handling";
  }
  if (id.includes("incident") || id.includes("7012") || id.includes("nis2")) {
    return "incident-reporting";
  }
  if (id.includes("cmmc") || id.includes("800_171") || id.includes("fci")) {
    return "cui-fci-compliance";
  }
  return "general";
}

function countrySpecificityWeight(rule, countryContext) {
  const expectedCountries = normalizeArray(rule?.condition?.country).map((entry) => normalizeJurisdictionToken(entry));
  if (expectedCountries.length === 0) {
    return 8;
  }

  if (expectedCountries.includes(countryContext.normalizedCountry)) {
    return 30;
  }

  if (expectedCountries.some((entry) => countryContext.countryContexts.includes(entry))) {
    return 24;
  }

  if (isEuContext(countryContext.normalizedCountry) && expectedCountries.includes("EU")) {
    return 22;
  }
  if (isUsContext(countryContext.normalizedCountry) && expectedCountries.includes("US")) {
    return 22;
  }

  if (
    expectedCountries.some((entry) => {
      if (!entry.endsWith("*")) {
        return false;
      }
      const prefix = entry.slice(0, -1);
      return countryContext.countryContexts.some((ctx) => String(ctx).startsWith(prefix));
    })
  ) {
    return 18;
  }

  return 10;
}

function resolveClauseReferences(obligation) {
  const references = new Set(normalizeArray(obligation.clause_refs));
  let matches = [];

  if (references.size > 0) {
    matches = (seed.clauseReferenceLibrary || []).filter((entry) => references.has(entry.id));
  }

  if (matches.length === 0) {
    matches = (seed.clauseReferenceLibrary || []).filter(
      (entry) => entry.regulation_id === obligation.regulation_id
    );
  }

  return matches;
}

function buildPrecedenceRankings(matchedRules, countryContext) {
  const ranked = matchedRules
    .map((rule) => {
      const obligation = rule.obligation || {};
      const legalForce = obligation.legal_force || inferLegalForceFromRegulationId(obligation.regulation_id);
      const conflictGroup = obligation.conflict_group || inferConflictGroupFromRegulationId(obligation.regulation_id);
      const scoreBreakdown = {
        confidence: confidenceWeight(obligation.confidence),
        legal_force: legalForceWeight(legalForce),
        citation_authority: citationAuthorityWeight(rule.citations || []),
        country_specificity: countrySpecificityWeight(rule, countryContext),
        precedence_tier: Math.max(0, 10 - Number(obligation.precedence_tier || 5))
      };

      const precedenceScore = Object.values(scoreBreakdown).reduce((sum, value) => sum + value, 0);

      return {
        rule,
        obligation,
        legal_force: legalForce,
        conflict_group: conflictGroup,
        score_breakdown: scoreBreakdown,
        precedence_score: precedenceScore,
        clause_references: resolveClauseReferences(obligation)
      };
    })
    .sort((a, b) => b.precedence_score - a.precedence_score);

  return ranked;
}

function patternValueMatches(expected, actual) {
  const expectedValues = normalizeArray(expected).map((entry) => String(entry));
  const actualValues = normalizeArray(actual).map((entry) => String(entry || ""));
  if (expectedValues.length === 0) {
    return true;
  }

  return expectedValues.some((candidate) => {
    return actualValues.some((actualValue) => {
      if (candidate.endsWith("*")) {
        const prefix = candidate.slice(0, -1);
        return actualValue.startsWith(prefix);
      }
      return candidate.toLowerCase() === actualValue.toLowerCase();
    });
  });
}

function intersects(expected, actual) {
  const expectedValues = normalizeArray(expected).map((entry) => String(entry).toLowerCase());
  const actualValues = normalizeArray(actual).map((entry) => String(entry).toLowerCase());

  if (expectedValues.length === 0) {
    return true;
  }

  return expectedValues.some((value) => actualValues.includes(value));
}

function computeProtectionTier(categories, jurisdictions) {
  let maxTier = "low";
  let maxWeight = TIER_PRIORITY.low;

  for (const category of categories) {
    const protections = category.jurisdiction_protections || {};
    const targets = jurisdictions.length > 0 ? jurisdictions : Object.keys(protections);
    for (const jurisdiction of targets) {
      const resolved = resolveJurisdictionProtection(protections, jurisdiction);
      const details = resolved ? resolved.details : null;
      if (!details || !details.tier) {
        continue;
      }
      const weight = TIER_PRIORITY[details.tier] || 1;
      if (weight > maxWeight) {
        maxWeight = weight;
        maxTier = details.tier;
      }
    }
  }

  return maxTier;
}

function toFtsQuery(query) {
  const parts = (query || "")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((part) => `${part}*`);

  if (parts.length === 0) {
    return "defense*";
  }

  return parts.join(" OR ");
}

const EXPERTISE_REQUIRED_SOURCE_IDS = [
  "nist-800-171-r3",
  "nist-800-171a-r3",
  "dod-cmmc-32cfr170",
  "dfars-cmmc-subpart-204-75",
  "dfars-7012",
  "itar-usml",
  "ear-ccl",
  "stanag-4671",
  "as9100d",
  "as9110c",
  "mil-std-810",
  "mil-std-461",
  "mil-hdbk-516",
  "eu-dual-use",
  "eu-nis2",
  "nato-cm-2002-49"
];

const EXPERTISE_REQUIRED_TOOL_NAMES = [
  "about",
  "list_sources",
  "list_jurisdiction_profiles",
  "get_jurisdiction_profile",
  "get_coverage_matrix",
  "get_expertise_scorecard",
  "list_expert_playbooks",
  "get_expert_playbook",
  "list_clause_references",
  "get_clause_reference",
  "classify_data",
  "get_domain_threats",
  "assess_applicability",
  "map_to_technical_standards",
  "search_domain_knowledge",
  "compare_jurisdictions",
  "build_control_baseline",
  "build_evidence_plan",
  "assess_breach_obligations",
  "create_remediation_backlog",
  "determine_cmmc_level",
  "classify_export_control",
  "assess_classified_environment",
  "assess_nato_interoperability"
];

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseDateSafe(value) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function ageDays(dateValue, referenceDate) {
  const parsed = parseDateSafe(dateValue);
  const ref = parseDateSafe(referenceDate);
  if (!parsed || !ref) {
    return null;
  }
  const deltaMs = ref.getTime() - parsed.getTime();
  return Math.floor(deltaMs / (24 * 60 * 60 * 1000));
}

function percent(part, total) {
  if (!total) {
    return 0;
  }
  return Number(((part / total) * 100).toFixed(2));
}

function average(values) {
  if (!values.length) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return Number((total / values.length).toFixed(2));
}

function buildCoverageMatrixSnapshot() {
  const jurisdictionProfiles = seed.jurisdictionProfiles || [];
  const profileIndex = new Map(jurisdictionProfiles.map((entry) => [entry.jurisdiction, entry]));
  const euMissing = (seed.EU_MEMBER_STATE_CODES || []).filter((code) => !profileIndex.has(code));
  const usStateMissing = (seed.US_STATE_CODES || []).filter((code) => !profileIndex.has(`US-${code}`));
  const natoMissing = (seed.NATO_MEMBER_CODES || []).filter((code) => !profileIndex.has(code));

  const euCoverage = {
    expected_member_states: seed.EU_MEMBER_STATE_CODES.length,
    covered_member_states: seed.EU_MEMBER_STATE_CODES.length - euMissing.length,
    missing_member_states: euMissing,
    full_coverage: euMissing.length === 0
  };
  const usCoverage = {
    expected_state_compatibility: seed.US_STATE_CODES.length,
    covered_state_compatibility: seed.US_STATE_CODES.length - usStateMissing.length,
    missing_state_compatibility: usStateMissing,
    minimum_coverage: usStateMissing.length === 0 && profileIndex.has("US")
  };
  const natoCoverage = {
    expected_member_states: seed.NATO_MEMBER_CODES.length,
    covered_member_states: seed.NATO_MEMBER_CODES.length - natoMissing.length,
    missing_member_states: natoMissing,
    focused_coverage: natoMissing.length === 0 && profileIndex.has("NATO")
  };

  const profileCounts = {
    total: jurisdictionProfiles.length,
    eu: jurisdictionProfiles.filter((entry) => entry.region === "EU").length,
    us: jurisdictionProfiles.filter((entry) => entry.region === "US").length,
    nato: jurisdictionProfiles.filter((entry) => entry.region === "NATO").length
  };

  return {
    profile_counts: profileCounts,
    eu_coverage: euCoverage,
    us_coverage: usCoverage,
    nato_coverage: natoCoverage
  };
}

function buildDataCoverageSnapshot() {
  const categories = seed.dataCategories || [];
  const categoryCount = categories.length;

  const missingEuCategories = categories
    .filter((category) => {
      const protections = category.jurisdiction_protections || {};
      return (seed.EU_MEMBER_STATE_CODES || []).some((code) => !protections[code]);
    })
    .map((category) => category.id);

  const missingUsCategories = categories
    .filter((category) => {
      const protections = category.jurisdiction_protections || {};
      return !protections.US;
    })
    .map((category) => category.id);

  const missingNatoCategories = categories
    .filter((category) => {
      const protections = category.jurisdiction_protections || {};
      return (seed.NATO_MEMBER_CODES || []).some((code) => !protections[code]);
    })
    .map((category) => category.id);

  const euPercent = percent(categoryCount - missingEuCategories.length, categoryCount);
  const usPercent = percent(categoryCount - missingUsCategories.length, categoryCount);
  const natoPercent = percent(categoryCount - missingNatoCategories.length, categoryCount);

  return {
    category_count: categoryCount,
    eu_percent: euPercent,
    us_percent: usPercent,
    nato_percent: natoPercent,
    overall_percent: average([euPercent, usPercent, natoPercent]),
    missing_eu_categories: missingEuCategories,
    missing_us_categories: missingUsCategories,
    missing_nato_categories: missingNatoCategories
  };
}

function buildSourceQualitySnapshot(maxSourceAgeDays) {
  const sources = seed.sources || [];
  const baselineDate = seed.KNOWLEDGE_BASELINE?.baseline_date || seed.LAST_UPDATED;
  const authoritativeSources = sources.filter((source) => source.knowledge_tier === "authoritative");
  const requiredMissing = EXPERTISE_REQUIRED_SOURCE_IDS.filter(
    (sourceId) => !sources.some((source) => source.id === sourceId)
  );

  const staleAuthoritative = authoritativeSources
    .map((source) => ({
      source_id: source.id,
      last_verified: source.last_verified,
      age_days: ageDays(source.last_verified, baselineDate)
    }))
    .filter((entry) => entry.age_days === null || entry.age_days > maxSourceAgeDays);

  const authoritativeRatio = percent(authoritativeSources.length, sources.length);
  const freshnessRatio = percent(
    authoritativeSources.length - staleAuthoritative.length,
    authoritativeSources.length || 1
  );
  const requiredSourceScore = requiredMissing.length === 0 ? 100 : Math.max(0, 100 - requiredMissing.length * 20);

  const score = Number(
    (
      authoritativeRatio * 0.35 +
      freshnessRatio * 0.45 +
      requiredSourceScore * 0.2
    ).toFixed(2)
  );

  return {
    source_count: sources.length,
    authoritative_count: authoritativeSources.length,
    authoritative_ratio: authoritativeRatio,
    freshness_ratio: freshnessRatio,
    stale_authoritative_sources: staleAuthoritative,
    missing_required_sources: requiredMissing,
    score
  };
}

function buildRuleQualitySnapshot() {
  const rules = seed.applicabilityRules || [];
  const obligations = rules.map((rule) => rule.obligation || {});
  const enrichedRules = obligations.filter((obligation) => {
    return (
      Boolean(obligation.legal_force) &&
      Boolean(obligation.conflict_group) &&
      Number(obligation.precedence_tier || 0) > 0 &&
      Array.isArray(obligation.clause_refs)
    );
  });
  const enrichedPercent = percent(enrichedRules.length, obligations.length || 1);

  const clauseReferenceCount = (seed.clauseReferenceLibrary || []).length;
  const clauseRichnessScore = clampNumber(clauseReferenceCount * 8, 0, 100);

  return {
    rule_count: rules.length,
    enriched_rule_count: enrichedRules.length,
    enriched_rule_percent: enrichedPercent,
    clause_reference_count: clauseReferenceCount,
    clause_richness_score: clauseRichnessScore,
    score: average([enrichedPercent, clauseRichnessScore])
  };
}

function buildOperationalQualitySnapshot() {
  const toolNames = (TOOL_DEFINITIONS || []).map((tool) => tool.name);
  const availableTools = new Set(toolNames);
  const missingTools = EXPERTISE_REQUIRED_TOOL_NAMES.filter((toolName) => !availableTools.has(toolName));

  const searchTool = (TOOL_DEFINITIONS || []).find((tool) => tool.name === "search_domain_knowledge");
  const searchEnums =
    searchTool?.inputSchema?.properties?.content_type?.enum || [];
  const searchSupportsClause = searchEnums.includes("clause");
  const searchSupportsJurisdiction = searchEnums.includes("jurisdiction");

  const toolCoveragePercent = percent(
    EXPERTISE_REQUIRED_TOOL_NAMES.length - missingTools.length,
    EXPERTISE_REQUIRED_TOOL_NAMES.length
  );
  const searchCoverageScore = searchSupportsClause && searchSupportsJurisdiction ? 100 : 50;

  return {
    available_tool_count: toolNames.length,
    required_tool_count: EXPERTISE_REQUIRED_TOOL_NAMES.length,
    missing_required_tools: missingTools,
    search_supports_clause: searchSupportsClause,
    search_supports_jurisdiction: searchSupportsJurisdiction,
    score: average([toolCoveragePercent, searchCoverageScore])
  };
}

function computeExpertiseScorecard(args = {}) {
  const strictMode = Boolean(args.strict);
  const maxSourceAgeDays = clampNumber(Number(args.max_source_age_days) || 365, 30, 1460);
  const minimumOverallScore = strictMode ? 95 : 90;

  const coverage = buildCoverageMatrixSnapshot();
  const dataCoverage = buildDataCoverageSnapshot();
  const sourceQuality = buildSourceQualitySnapshot(maxSourceAgeDays);
  const ruleQuality = buildRuleQualitySnapshot();
  const operationalQuality = buildOperationalQualitySnapshot();

  const euCoverageScore = coverage.eu_coverage.full_coverage
    ? 100
    : percent(coverage.eu_coverage.covered_member_states, coverage.eu_coverage.expected_member_states || 1);
  const usCoverageScore = coverage.us_coverage.minimum_coverage
    ? 100
    : percent(
        coverage.us_coverage.covered_state_compatibility,
        coverage.us_coverage.expected_state_compatibility || 1
      );
  const natoCoverageScore = coverage.nato_coverage.focused_coverage
    ? 100
    : percent(coverage.nato_coverage.covered_member_states, coverage.nato_coverage.expected_member_states || 1);
  const jurisdictionCoverageScore = average([euCoverageScore, usCoverageScore, natoCoverageScore]);

  const weightedScore = Number(
    (
      jurisdictionCoverageScore * 0.3 +
      dataCoverage.overall_percent * 0.2 +
      sourceQuality.score * 0.25 +
      ruleQuality.score * 0.15 +
      operationalQuality.score * 0.1
    ).toFixed(2)
  );

  const hardFailures = [];
  if (!coverage.eu_coverage.full_coverage) {
    hardFailures.push("EU jurisdiction profile coverage is incomplete.");
  }
  if (!coverage.us_coverage.minimum_coverage) {
    hardFailures.push("US minimum jurisdiction profile coverage is incomplete.");
  }
  if (!coverage.nato_coverage.focused_coverage) {
    hardFailures.push("NATO focused jurisdiction profile coverage is incomplete.");
  }
  if (sourceQuality.missing_required_sources.length > 0) {
    hardFailures.push("Required authoritative sources are missing.");
  }
  if (sourceQuality.stale_authoritative_sources.length > 0 && strictMode) {
    hardFailures.push("One or more authoritative sources are stale beyond strict freshness threshold.");
  }
  if (ruleQuality.clause_reference_count < 10) {
    hardFailures.push("Clause reference library is below minimum depth.");
  }
  if (operationalQuality.missing_required_tools.length > 0) {
    hardFailures.push("Required MCP tool contract coverage is incomplete.");
  }
  if (weightedScore < minimumOverallScore) {
    hardFailures.push(`Overall expertise score is below threshold (${minimumOverallScore}).`);
  }

  const recommendations = [];
  if (sourceQuality.stale_authoritative_sources.length > 0) {
    recommendations.push("Refresh authoritative sources with stale verification dates.");
  }
  if (dataCoverage.missing_eu_categories.length > 0 || dataCoverage.missing_us_categories.length > 0 || dataCoverage.missing_nato_categories.length > 0) {
    recommendations.push("Backfill missing jurisdiction protections across data categories.");
  }
  if (operationalQuality.missing_required_tools.length > 0) {
    recommendations.push("Implement missing required tools to satisfy full expert contract coverage.");
  }
  if (ruleQuality.enriched_rule_percent < 100) {
    recommendations.push("Ensure all applicability rules include legal force, conflict group, precedence tier, and clause refs.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Maintain current quality gates and source refresh cadence.");
  }

  let grade = "C";
  if (weightedScore >= 97) {
    grade = "A+";
  } else if (weightedScore >= 95) {
    grade = "A";
  } else if (weightedScore >= 90) {
    grade = "A-";
  } else if (weightedScore >= 85) {
    grade = "B+";
  } else if (weightedScore >= 80) {
    grade = "B";
  }

  return {
    generated_at: new Date().toISOString(),
    strict_mode: strictMode,
    thresholds: {
      minimum_overall_score: minimumOverallScore,
      max_source_age_days: maxSourceAgeDays
    },
    overall_score: weightedScore,
    grade,
    dimensions: {
      jurisdiction_coverage: {
        weight: 30,
        score: jurisdictionCoverageScore,
        details: coverage
      },
      data_completeness: {
        weight: 20,
        score: dataCoverage.overall_percent,
        details: dataCoverage
      },
      source_quality: {
        weight: 25,
        score: sourceQuality.score,
        details: sourceQuality
      },
      rule_rigor: {
        weight: 15,
        score: ruleQuality.score,
        details: ruleQuality
      },
      operational_contract: {
        weight: 10,
        score: operationalQuality.score,
        details: operationalQuality
      }
    },
    hard_failures: hardFailures,
    recommendations
  };
}

function makeTools(db, metadataMap) {
  const sourceCitationMap = makeCitationMap();

  function collectCitations(items) {
    return dedupeBy(
      compact(
        items.flatMap((item) => {
          if (Array.isArray(item)) {
            return item;
          }
          if (item && Array.isArray(item.citations)) {
            return item.citations;
          }
          return [];
        })
      ),
      (citation) => `${citation.type}|${citation.ref}|${citation.source_url}`
    );
  }

  function getAllArchitecturePatterns() {
    const rows = db.prepare("SELECT * FROM architecture_patterns ORDER BY id").all();
    return rows.map(parsePatternRow);
  }

  function getAllDataCategories() {
    const rows = db.prepare("SELECT * FROM data_categories ORDER BY id").all();
    return rows.map(parseDataCategoryRow);
  }

  function getAllThreats() {
    const rows = db.prepare("SELECT * FROM threat_scenarios ORDER BY id").all();
    return rows.map(parseThreatRow);
  }

  function getAllStandards() {
    const rows = db.prepare("SELECT * FROM technical_standards ORDER BY id").all();
    return rows.map(parseStandardRow);
  }

  function getAllRules() {
    const rows = db.prepare("SELECT * FROM applicability_rules ORDER BY id").all();
    return rows.map(parseRuleRow);
  }

  function getAllEvidence() {
    const rows = db.prepare("SELECT * FROM evidence_artifacts ORDER BY id").all();
    return rows.map(parseEvidenceRow);
  }

  function getAllClauseReferences() {
    const rows = db.prepare("SELECT * FROM clause_references ORDER BY regulation_id, provision_ref").all();
    return rows.map(parseClauseReferenceRow);
  }

  function getAllExpertPlaybooks() {
    const rows = db.prepare("SELECT * FROM expert_playbooks ORDER BY id").all();
    return rows.map(parseExpertPlaybookRow);
  }

  return {
    async about() {
      const patternCount = db.prepare("SELECT COUNT(*) AS n FROM architecture_patterns").get().n;
      const categoryCount = db.prepare("SELECT COUNT(*) AS n FROM data_categories").get().n;
      const threatCount = db.prepare("SELECT COUNT(*) AS n FROM threat_scenarios").get().n;
      const standardCount = db.prepare("SELECT COUNT(*) AS n FROM technical_standards").get().n;
      const sourceCount = db.prepare("SELECT COUNT(*) AS n FROM sources").get().n;
      const playbookCount = db.prepare("SELECT COUNT(*) AS n FROM expert_playbooks").get().n;
      const jurisdictionProfiles = seed.jurisdictionProfiles || [];
      const euCountryProfiles = jurisdictionProfiles.filter((profile) => profile.region === "EU" && profile.jurisdiction !== "EU");
      const usStateProfiles = jurisdictionProfiles.filter((profile) => profile.jurisdiction.startsWith("US-"));
      const usProfiles = jurisdictionProfiles.filter((profile) => profile.region === "US");
      const natoProfiles = jurisdictionProfiles.filter((profile) => profile.region === "NATO");
      const natoMemberProfiles = dedupeBy(
        jurisdictionProfiles
          .filter((profile) => Boolean(profile.nato_member))
          .map((profile) => profile.jurisdiction)
          .filter((jurisdiction) => jurisdiction !== "NATO"),
        (entry) => entry
      );

      return wrapResponse(
        {
          name: "Defense / Aerospace MCP",
          version: metadataMap.dataset_version || seed.DATASET_VERSION,
          domain: "defense-aerospace",
          coverage_summary: {
            architecture_patterns: patternCount,
            data_categories: categoryCount,
            threat_scenarios: threatCount,
            technical_standards: standardCount,
            authoritative_sources: sourceCount,
            expert_playbooks: playbookCount,
            jurisdictions: ["US", "US-*", "EU", "EU-*", "NATO", "NATO-*", "UK"],
            eu_member_states_covered: seed.EU_MEMBER_STATE_CODES.length,
            eu_member_states: seed.EU_MEMBER_STATE_CODES,
            nato_eu_member_states: seed.EU_NATO_MEMBER_CODES.length,
            nato_member_states_covered: natoMemberProfiles.length,
            nato_member_states: seed.NATO_MEMBER_CODES,
            us_state_compatibility: "US-* matching with state-level context support",
            jurisdiction_profiles_total: jurisdictionProfiles.length,
            jurisdiction_profiles_eu: euCountryProfiles.length,
            jurisdiction_profiles_us: usProfiles.length,
            jurisdiction_profiles_us_states: usStateProfiles.length,
            jurisdiction_profiles_nato: natoProfiles.length
          },
          knowledge_baseline: seed.KNOWLEDGE_BASELINE,
          last_updated: metadataMap.last_updated || seed.LAST_UPDATED,
          known_limitations: [
            metadataMap.known_limitations ||
              "Framework guidance only; not legal counsel and not a substitute for export/compliance adjudication.",
            "No classified material, CUI, ITAR technical data, or proprietary export-controlled content is stored."
          ]
        },
        metadataMap,
        {
          confidence: "authoritative",
          citations: [
            sourceCitationMap.get("dod-cmmc-32cfr170"),
            sourceCitationMap.get("itar-usml"),
            sourceCitationMap.get("eu-nis2"),
            sourceCitationMap.get("nato-cm-2002-49")
          ],
          inference_rationale:
            "Counts and metadata are sourced from seeded SQLite tables and db_metadata values."
        }
      );
    },

    async list_sources(args = {}) {
      const sourceType = args.source_type;
      const limit = toBoundedInt(args.limit, 50, 1, 200);
      const offset = toBoundedInt(args.offset, 0, 0, 1000000);
      let rows = [];
      let totalMatches = 0;
      if (sourceType) {
        totalMatches = db.prepare("SELECT COUNT(*) AS n FROM sources WHERE lower(source_type)=lower(?)").get(sourceType).n;
        rows = db
          .prepare(
            "SELECT id, name, source_type, content, provenance, license, refresh_cadence, source_url, effective_date, last_verified, knowledge_tier, last_updated FROM sources WHERE lower(source_type)=lower(?) ORDER BY name LIMIT ? OFFSET ?"
          )
          .all(sourceType, limit, offset);
      } else {
        totalMatches = db.prepare("SELECT COUNT(*) AS n FROM sources").get().n;
        rows = db
          .prepare(
            "SELECT id, name, source_type, content, provenance, license, refresh_cadence, source_url, effective_date, last_verified, knowledge_tier, last_updated FROM sources ORDER BY name LIMIT ? OFFSET ?"
          )
          .all(limit, offset);
      }

      const entries = rows.map((row) => ({
        id: row.id,
        name: row.name,
        source_type: row.source_type,
        content: row.content,
        provenance: row.provenance,
        license: row.license,
        refresh_cadence: row.refresh_cadence,
        source_url: row.source_url,
        effective_date: row.effective_date,
        last_verified: row.last_verified,
        knowledge_tier: row.knowledge_tier,
        last_updated: row.last_updated
      }));

      return wrapResponse(
        {
          entries,
          total_matches: totalMatches,
          returned: entries.length,
          limit,
          offset,
          has_more: offset + entries.length < totalMatches,
          freshness_summary: {
            baseline_date: seed.KNOWLEDGE_BASELINE.baseline_date,
            authoritative_sources: entries.filter((entry) => entry.knowledge_tier === "authoritative").length,
            advisory_sources: entries.filter((entry) => entry.knowledge_tier === "advisory").length,
            authoritative_sources_returned: entries.filter((entry) => entry.knowledge_tier === "authoritative").length,
            advisory_sources_returned: entries.filter((entry) => entry.knowledge_tier === "advisory").length
          }
        },
        metadataMap,
        {
          confidence: "authoritative",
          citations: entries.map((entry) => ({ type: "SOURCE", ref: entry.name, source_url: entry.source_url })),
          inference_rationale:
            "Results are direct records from the source registry table with optional source_type filtering."
        }
      );
    },

    async list_jurisdiction_profiles(args = {}) {
      const region = toText(args.region || "").toUpperCase();
      const coverageLevel = toText(args.coverage_level || "").toLowerCase();
      const requestedJurisdiction = normalizeJurisdictionToken(args.jurisdiction || args.country || "");
      const natoMember = normalizeBoolean(args.nato_member);
      const limit = toBoundedInt(args.limit, 50, 1, 200);
      const offset = toBoundedInt(args.offset, 0, 0, 1000000);

      const profiles = (seed.jurisdictionProfiles || []).filter((profile) => {
        if (region && String(profile.region || "").toUpperCase() !== region) {
          return false;
        }
        if (coverageLevel && String(profile.coverage_level || "").toLowerCase() !== coverageLevel) {
          return false;
        }
        if (requestedJurisdiction) {
          const profileContexts = buildJurisdictionContexts(profile.jurisdiction);
          const requestedContexts = buildJurisdictionContexts(requestedJurisdiction);
          if (!requestedContexts.some((context) => profileContexts.includes(context))) {
            return false;
          }
        }
        if (natoMember !== null && Boolean(profile.nato_member) !== natoMember) {
          return false;
        }
        return true;
      });

      const sortedProfiles = [...profiles]
        .sort((a, b) => {
          const regionCmp = String(a.region || "").localeCompare(String(b.region || ""));
          if (regionCmp !== 0) {
            return regionCmp;
          }
          return String(a.jurisdiction || "").localeCompare(String(b.jurisdiction || ""));
        })
        .slice(offset, offset + limit);

      const foundationCalls = dedupeBy(
        sortedProfiles.flatMap((profile) => profile.foundation_join_hints || []),
        (item) => `${item.mcp}|${item.tool}|${JSON.stringify(item.params)}`
      );

      return wrapResponse(
        {
          entries: sortedProfiles,
          total_matches: profiles.length,
          returned: sortedProfiles.length,
          limit,
          offset,
          has_more: offset + sortedProfiles.length < profiles.length
        },
        metadataMap,
        {
          confidence: sortedProfiles.length > 0 ? "authoritative" : "estimated",
          citations: collectCitations(sortedProfiles),
          foundation_mcp_calls: foundationCalls,
          inference_rationale:
            "Jurisdiction profiles are returned from curated EU/US/NATO coverage records with deterministic filtering."
        }
      );
    },

    async get_jurisdiction_profile(args = {}) {
      const jurisdictionInput = toText(args.jurisdiction || args.country || "");
      if (!jurisdictionInput) {
        throw new ToolInputError("jurisdiction is required", { required: ["jurisdiction"] });
      }

      const resolved = resolveJurisdictionProfile(jurisdictionInput);
      if (!resolved) {
        throw new ToolInputError(`Unknown jurisdiction: ${jurisdictionInput}`, {
          jurisdiction: jurisdictionInput
        });
      }

      const profile = resolved.profile;
      const jurisdictionContexts = buildJurisdictionContexts(resolved.requested_jurisdiction);
      const relatedRules = getAllRules().filter((rule) => patternValueMatches(rule?.condition?.country, jurisdictionContexts));
      const relatedRegulations = dedupeBy(
        relatedRules
          .map((rule) => toText(rule?.obligation?.regulation_id))
          .filter(Boolean)
          .map((regulationId) => ({ regulation_id: regulationId })),
        (entry) => entry.regulation_id
      );

      return wrapResponse(
        {
          jurisdiction: resolved.requested_jurisdiction,
          profile: {
            ...profile,
            derived_from: resolved.derived_from || undefined
          },
          related_rule_count: relatedRules.length,
          related_obligation_regulations: relatedRegulations
        },
        metadataMap,
        {
          confidence: profile.knowledge_tier === "authoritative" ? "authoritative" : "inferred",
          citations: collectCitations([profile]),
          foundation_mcp_calls: profile.foundation_join_hints || [],
          inference_rationale:
            "Jurisdiction profile is resolved by normalized country/state context with fallback to regional baseline profiles."
        }
      );
    },

    async get_coverage_matrix() {
      const coverage = buildCoverageMatrixSnapshot();

      return wrapResponse(
        coverage,
        metadataMap,
        {
          confidence: "authoritative",
          citations: [sourceCitationMap.get("eu-nis2"), sourceCitationMap.get("dod-cmmc-32cfr170"), sourceCitationMap.get("nato-cm-2002-49")],
          inference_rationale:
            "Coverage matrix is computed from jurisdiction profile records against expected EU member, US state compatibility, and NATO member sets."
        }
      );
    },

    async get_expertise_scorecard(args = {}) {
      const scorecard = computeExpertiseScorecard(args);
      const foundationCalls = [
        mapRegulationToFoundationCall({ regulation_id: "NIS2_DIRECTIVE_2022_2555", section: "21" }),
        mapRegulationToFoundationCall({ regulation_id: "DFARS_252.204-7012", section: "(d)" }),
        mapRegulationToFoundationCall({ regulation_id: "NATO_C_M_2002_49", section: "security principles" })
      ];

      return wrapResponse(
        scorecard,
        metadataMap,
        {
          confidence: scorecard.hard_failures.length === 0 ? "authoritative" : "inferred",
          citations: [
            sourceCitationMap.get("eu-nis2"),
            sourceCitationMap.get("dod-cmmc-32cfr170"),
            sourceCitationMap.get("dfars-7012"),
            sourceCitationMap.get("nato-cm-2002-49")
          ],
          foundation_mcp_calls: foundationCalls,
          inference_rationale:
            "Scorecard is computed from deterministic coverage, source quality, rule rigor, and tool contract metrics."
        }
      );
    },

    async list_expert_playbooks(args = {}) {
      const topic = toText(args.topic || args.query || "").toLowerCase();
      const jurisdiction = normalizeJurisdictionToken(args.jurisdiction || args.country || "");
      const dataType = toText(args.data_type || "").toLowerCase();
      const limit = Math.max(1, Math.min(Number(args.limit) || 10, 50));

      let playbooks = getAllExpertPlaybooks();

      if (jurisdiction) {
        const requestedContexts = buildJurisdictionContexts(jurisdiction);
        playbooks = playbooks.filter((playbook) => {
          return normalizeArray(playbook.jurisdictions).some((candidate) => {
            const candidateContexts = buildJurisdictionContexts(candidate);
            return requestedContexts.some((context) => candidateContexts.includes(context));
          });
        });
      }

      if (dataType) {
        playbooks = playbooks.filter((playbook) =>
          normalizeArray(playbook.data_types).some((entry) => String(entry).toLowerCase() === dataType)
        );
      }

      let scored = playbooks.map((playbook) => ({
        playbook,
        relevance_score: 0
      }));

      if (topic) {
        const tokens = topic.split(/\s+/).filter((token) => token.length >= 2).slice(0, 12);
        scored = scored
          .map((entry) => {
            const haystack = [
              entry.playbook.name,
              entry.playbook.scenario,
              ...normalizeArray(entry.playbook.when_to_use),
              ...normalizeArray(entry.playbook.steps),
              ...normalizeArray(entry.playbook.common_failure_modes),
              ...normalizeArray(entry.playbook.regulation_basis).map((basis) => `${basis.regulation_id || ""} ${basis.section || ""}`)
            ]
              .join(" ")
              .toLowerCase();

            const matches = tokens.reduce((count, token) => (haystack.includes(token) ? count + 1 : count), 0);
            return {
              ...entry,
              relevance_score: matches
            };
          })
          .filter((entry) => entry.relevance_score > 0)
          .sort((a, b) => b.relevance_score - a.relevance_score || a.playbook.name.localeCompare(b.playbook.name));
      } else {
        scored = scored.sort((a, b) => a.playbook.name.localeCompare(b.playbook.name));
      }

      const selected = scored.slice(0, limit);
      const entries = selected.map((entry) => ({
        id: entry.playbook.id,
        name: entry.playbook.name,
        scenario: entry.playbook.scenario,
        jurisdictions: entry.playbook.jurisdictions,
        data_types: entry.playbook.data_types,
        when_to_use: entry.playbook.when_to_use,
        relevance_score: topic ? entry.relevance_score : undefined
      }));

      const foundationCalls = dedupeBy(
        selected.flatMap((entry) =>
          normalizeArray(entry.playbook.regulation_basis).map((basis) =>
            mapRegulationToFoundationCall({
              regulation_id: basis.regulation_id,
              section: basis.section
            })
          )
        ),
        (item) => `${item.mcp}|${item.tool}|${JSON.stringify(item.params)}`
      );

      return wrapResponse(
        {
          entries,
          total_matches: scored.length,
          returned: entries.length
        },
        metadataMap,
        {
          confidence: entries.length > 0 ? "authoritative" : "estimated",
          citations: collectCitations(selected.map((entry) => entry.playbook)),
          foundation_mcp_calls: foundationCalls,
          inference_rationale:
            "Expert playbooks are filtered by jurisdiction/data type and ranked by deterministic lexical relevance scoring."
        }
      );
    },

    async get_expert_playbook(args = {}) {
      const playbookId = toText(args.playbook_id || "");
      const scenario = toText(args.scenario || args.topic || "").toLowerCase();
      if (!playbookId && !scenario) {
        throw new ToolInputError("playbook_id or scenario is required", {
          required: ["playbook_id OR scenario"]
        });
      }

      const playbooks = getAllExpertPlaybooks();
      let selected = null;

      if (playbookId) {
        selected = playbooks.find((entry) => entry.id === playbookId) || null;
      } else {
        const tokens = scenario.split(/\s+/).filter((token) => token.length >= 2).slice(0, 12);
        let bestScore = -1;
        for (const playbook of playbooks) {
          const haystack = [
            playbook.id,
            playbook.name,
            playbook.scenario,
            ...normalizeArray(playbook.when_to_use),
            ...normalizeArray(playbook.steps),
            ...normalizeArray(playbook.common_failure_modes)
          ]
            .join(" ")
            .toLowerCase();
          const score = tokens.reduce((count, token) => (haystack.includes(token) ? count + 1 : count), 0);
          if (score > bestScore) {
            bestScore = score;
            selected = playbook;
          }
        }
        if (bestScore <= 0) {
          selected = null;
        }
      }

      if (!selected) {
        throw new ToolInputError("Expert playbook not found", {
          playbook_id: playbookId || undefined,
          scenario: scenario || undefined
        });
      }

      const foundationCalls = dedupeBy(
        normalizeArray(selected.regulation_basis).map((basis) =>
          mapRegulationToFoundationCall({
            regulation_id: basis.regulation_id,
            section: basis.section
          })
        ),
        (item) => `${item.mcp}|${item.tool}|${JSON.stringify(item.params)}`
      );

      return wrapResponse(
        {
          playbook: selected
        },
        metadataMap,
        {
          confidence: "authoritative",
          citations: collectCitations([selected]),
          foundation_mcp_calls: foundationCalls,
          inference_rationale:
            "Playbook is retrieved from curated expert workflow knowledge with deterministic ID/scenario matching."
        }
      );
    },

    async list_architecture_patterns(args = {}) {
      const category = args.category;
      let rows = [];
      if (category) {
        rows = db
          .prepare("SELECT id, name, category, description FROM architecture_patterns WHERE lower(category)=lower(?) ORDER BY id")
          .all(category);
      } else {
        rows = db.prepare("SELECT id, name, category, description FROM architecture_patterns ORDER BY id").all();
      }

      return wrapResponse(
        {
          patterns: rows.map((row) => ({
            id: row.id,
            name: row.name,
            category: row.category,
            description: row.description
          }))
        },
        metadataMap,
        {
          confidence: "authoritative",
          citations: [sourceCitationMap.get("dod-cmmc-32cfr170"), sourceCitationMap.get("nato-cm-2002-49")],
          inference_rationale:
            "Pattern list is returned from architecture_patterns index with optional category filtering."
        }
      );
    },

    async list_clause_references(args = {}) {
      const regulationId = toText(args.regulation_id || "");
      const jurisdiction = normalizeJurisdictionToken(args.jurisdiction_scope || "");
      const limit = toBoundedInt(args.limit, 100, 1, 500);
      const offset = toBoundedInt(args.offset, 0, 0, 1000000);

      let clauses = getAllClauseReferences();
      if (regulationId) {
        clauses = clauses.filter((entry) => entry.regulation_id.toLowerCase() === regulationId.toLowerCase());
      }
      if (jurisdiction) {
        clauses = clauses.filter((entry) => {
          const entryContexts = buildJurisdictionContexts(entry.jurisdiction_scope);
          const requestContexts = buildJurisdictionContexts(jurisdiction);
          return requestContexts.some((context) => entryContexts.includes(context));
        });
      }
      const totalMatches = clauses.length;
      const pagedClauses = clauses.slice(offset, offset + limit);

      return wrapResponse(
        {
          clauses: pagedClauses,
          total_matches: totalMatches,
          returned: pagedClauses.length,
          limit,
          offset,
          has_more: offset + pagedClauses.length < totalMatches
        },
        metadataMap,
        {
          confidence: "authoritative",
          citations: pagedClauses.map((entry) => ({
            type: "SOURCE",
            ref: entry.regulation_id,
            source_url: entry.source_url
          })),
          inference_rationale:
            "Clause references are returned from the clause reference library with optional regulation and jurisdiction filtering."
        }
      );
    },

    async get_clause_reference(args = {}) {
      const clauseId = toText(args.clause_id || "");
      const regulationId = toText(args.regulation_id || "");
      const provisionRef = toText(args.provision_ref || "");

      if (!clauseId && !(regulationId && provisionRef)) {
        throw new ToolInputError("clause_id or regulation_id + provision_ref is required", {
          required: ["clause_id OR (regulation_id and provision_ref)"]
        });
      }

      let row;
      if (clauseId) {
        row = db.prepare("SELECT * FROM clause_references WHERE id = ?").get(clauseId);
      } else {
        row = db
          .prepare(
            "SELECT * FROM clause_references WHERE lower(regulation_id)=lower(?) AND lower(provision_ref)=lower(?) LIMIT 1"
          )
          .get(regulationId, provisionRef);
      }

      if (!row) {
        throw new ToolInputError("Clause reference not found", {
          clause_id: clauseId || undefined,
          regulation_id: regulationId || undefined,
          provision_ref: provisionRef || undefined
        });
      }

      const clause = parseClauseReferenceRow(row);
      return wrapResponse(
        {
          clause
        },
        metadataMap,
        {
          confidence: "authoritative",
          citations: [{ type: "SOURCE", ref: clause.regulation_id, source_url: clause.source_url }],
          inference_rationale:
            "Clause reference is directly retrieved from the curated clause reference library."
        }
      );
    },

    async get_architecture_pattern(args = {}) {
      if (!args.pattern_id) {
        throw new ToolInputError("pattern_id is required", { required: ["pattern_id"] });
      }

      const row = db.prepare("SELECT * FROM architecture_patterns WHERE id = ?").get(args.pattern_id);
      if (!row) {
        throw new ToolInputError(`Unknown pattern_id: ${args.pattern_id}`, {
          pattern_id: args.pattern_id
        });
      }

      const pattern = parsePatternRow(row);
      const relatedThreatCount = db
        .prepare("SELECT COUNT(*) AS n FROM threat_scenarios WHERE affected_patterns LIKE ?")
        .get(`%${args.pattern_id}%`).n;

      return wrapResponse(
        {
          pattern,
          related_threat_count: relatedThreatCount
        },
        metadataMap,
        {
          confidence: "authoritative",
          citations: pattern.citations,
          inference_rationale:
            "Pattern details are direct domain records; threat count uses affected_patterns linkage."
        }
      );
    },

    async classify_data(args = {}) {
      const description = toText(args.data_description);
      if (!description) {
        throw new ToolInputError("data_description is required", {
          required: ["data_description"]
        });
      }

      const jurisdictions = normalizeJurisdictionList(args.jurisdictions);
      const redirect = shouldRedirect(description);
      if (redirect) {
        return wrapResponse(
          {
            categories: [],
            applicable_regimes: [],
            protection_tier: "out_of_scope",
            handling_requirements: [],
            guidance: `Out of scope for Defense/Aerospace MCP. Route to ${redirect.mcp} MCP.`
          },
          metadataMap,
          {
            confidence: "authoritative",
            out_of_scope: [redirect.reason],
            inference_rationale: "Domain classifier detected explicit non-defense terminology.",
            citations: [sourceCitationMap.get("dod-cmmc-32cfr170")]
          }
        );
      }

      const lcDescription = description.toLowerCase();
      const matchedCategoryIds = new Set();

      for (const matcher of DATA_CLASSIFICATION_MATCHERS) {
        if (matcher.terms.some((term) => lcDescription.includes(term))) {
          matchedCategoryIds.add(matcher.id);
        }
      }

      if (matchedCategoryIds.size === 0) {
        matchedCategoryIds.add("cui");
      }

      const categories = [];
      const stmt = db.prepare("SELECT * FROM data_categories WHERE id = ?");
      for (const categoryId of matchedCategoryIds) {
        const row = stmt.get(categoryId);
        if (row) {
          categories.push(parseDataCategoryRow(row));
        }
      }

      const applicableRegimes = new Set();
      const handlingRequirements = new Set();
      for (const category of categories) {
        for (const control of category.required_controls) {
          handlingRequirements.add(control);
        }
        for (const constraint of category.cross_border_constraints) {
          handlingRequirements.add(constraint);
        }

        const protections = category.jurisdiction_protections || {};
        const targetJurisdictions = jurisdictions.length > 0 ? jurisdictions : Object.keys(protections);
        for (const jurisdiction of targetJurisdictions) {
          const resolved = resolveJurisdictionProtection(protections, jurisdiction);
          const details = resolved ? resolved.details : null;
          if (!details) {
            continue;
          }
          for (const regime of details.regime || []) {
            applicableRegimes.add(regime);
          }
          for (const control of details.controls || []) {
            handlingRequirements.add(`${jurisdiction}: ${control}`);
          }
        }
      }

      const protectionTier = computeProtectionTier(categories, jurisdictions);

      return wrapResponse(
        {
          categories: categories.map((category) => {
            const scopedProtections = {};
            const protections = category.jurisdiction_protections || {};
            const targetJurisdictions = jurisdictions.length > 0 ? jurisdictions : Object.keys(protections);
            for (const jurisdiction of targetJurisdictions) {
              const resolved = resolveJurisdictionProtection(protections, jurisdiction);
              if (resolved) {
                scopedProtections[jurisdiction] = {
                  ...resolved.details,
                  derived_from: resolved.derived_from || undefined
                };
              }
            }

            return {
              id: category.id,
              name: category.name,
              description: category.description,
              jurisdiction_protections: scopedProtections,
              deidentification_requirements: category.deidentification_requirements,
              cross_border_constraints: category.cross_border_constraints
            };
          }),
          applicable_regimes: Array.from(applicableRegimes),
          protection_tier: protectionTier,
          handling_requirements: Array.from(handlingRequirements)
        },
        metadataMap,
        {
          confidence: "inferred",
          citations: collectCitations(categories),
          inference_rationale:
            "Category selection uses deterministic keyword matching against defense taxonomy and jurisdictional control mappings."
        }
      );
    },

    async get_domain_threats(args = {}) {
      const pattern = args.architecture_pattern;
      const dataTypes = normalizeArray(args.data_types).map((entry) => String(entry));
      const deploymentContext = toText(args.deployment_context || "");

      if (pattern && !String(pattern).startsWith("da-")) {
        return wrapResponse(
          {
            threats: [],
            guidance:
              "Architecture pattern appears outside Defense/Aerospace scope. Use the relevant domain MCP for that architecture."
          },
          metadataMap,
          {
            confidence: "authoritative",
            out_of_scope: ["Non-defense architecture pattern supplied."],
            inference_rationale: "Defense patterns are prefixed with da-.",
            citations: [sourceCitationMap.get("mitre-attack")]
          }
        );
      }

      const threats = getAllThreats().filter((threat) => {
        const patternMatch = pattern ? threat.affected_patterns.includes(pattern) : true;
        const dataTypeMatch = dataTypes.length > 0 ? dataTypes.some((type) => threat.affected_data_categories.includes(type)) : true;

        let deploymentHintMatch = true;
        if (deploymentContext) {
          const haystack = `${threat.description} ${threat.attack_narrative}`.toLowerCase();
          const token = deploymentContext.toLowerCase();
          deploymentHintMatch = haystack.includes(token) || token.length < 4;
        }

        return patternMatch && dataTypeMatch && deploymentHintMatch;
      });

      const topThreats = threats.slice(0, 12).map((threat) => ({
        id: threat.id,
        name: threat.name,
        category: threat.category,
        description: threat.description,
        mitre_mapping: threat.mitre_mapping,
        regulation_refs: threat.regulation_refs,
        severity: threat.severity,
        likelihood_factors: threat.likelihood_factors,
        impact_dimensions: threat.impact_dimensions,
        control_refs: threat.control_refs,
        detection_indicators: threat.detection_indicators
      }));

      const foundationCalls = dedupeBy(
        threats
          .flatMap((threat) => threat.regulation_refs)
          .map((ref) => mapRegulationToFoundationCall(ref)),
        (item) => `${item.mcp}|${item.tool}|${JSON.stringify(item.params)}`
      );

      return wrapResponse(
        {
          threats: topThreats
        },
        metadataMap,
        {
          confidence: topThreats.length > 0 ? "authoritative" : "inferred",
          citations: collectCitations(threats),
          foundation_mcp_calls: foundationCalls,
          inference_rationale:
            "Threats are filtered by affected architecture patterns and data categories, then enriched with regulation/control crosswalks."
        }
      );
    },

    async assess_applicability(args = {}) {
      const country = args.country;
      if (!country) {
        throw new ToolInputError("country is required", { required: ["country"] });
      }
      const normalizedCountry = normalizeJurisdictionToken(country);
      const countryContexts = buildJurisdictionContexts(normalizedCountry);
      const jurisdictionProfile = resolveJurisdictionProfile(normalizedCountry);

      const role = args.role || "unknown";
      const systemTypes = normalizeArray(args.system_types).map((entry) => String(entry));
      const dataTypes = normalizeArray(args.data_types).map((entry) => String(entry));
      const additionalContext = args.additional_context || {};
      const programs = normalizeArray(additionalContext.programs || args.programs).map((entry) => String(entry));
      const exportDestinations = dedupeBy(
        normalizeArray(additionalContext.export || args.export)
          .map((entry) => normalizeJurisdictionToken(entry))
          .filter(Boolean)
          .flatMap((entry) => buildJurisdictionContexts(entry)),
        (entry) => entry
      );
      const contextTags = normalizeArray(additionalContext.tags).map((entry) => String(entry));

      const matchedRules = getAllRules().filter((rule) => {
        const condition = rule.condition || {};

        if (condition.country && !patternValueMatches(condition.country, countryContexts)) {
          return false;
        }

        if (condition.role && !intersects(condition.role, [role])) {
          return false;
        }

        if (condition.data_types && !intersects(condition.data_types, dataTypes)) {
          return false;
        }

        if (condition.system_types && !intersects(condition.system_types, systemTypes)) {
          return false;
        }

        if (condition.programs && !intersects(condition.programs, programs)) {
          return false;
        }

        if (condition.export && !intersects(condition.export, exportDestinations)) {
          return false;
        }

        if (condition.additional_context && !intersects(condition.additional_context, contextTags)) {
          return false;
        }

        return true;
      });

      const rankedRuleCandidates = buildPrecedenceRankings(matchedRules, {
        normalizedCountry,
        countryContexts
      });

      const obligations = [];
      const suppressedDuplicates = [];
      const seenObligationKeys = new Set();
      for (const candidate of rankedRuleCandidates) {
        const key = `${candidate.obligation.regulation_id}|${candidate.obligation.standard_id}`;
        if (seenObligationKeys.has(key)) {
          suppressedDuplicates.push({
            rule_id: candidate.rule.id,
            regulation_id: candidate.obligation.regulation_id,
            standard_id: candidate.obligation.standard_id,
            precedence_score: candidate.precedence_score
          });
          continue;
        }
        seenObligationKeys.add(key);

        obligations.push({
          rule_id: candidate.rule.id,
          regulation_id: candidate.obligation.regulation_id,
          standard_id: candidate.obligation.standard_id,
          confidence: candidate.obligation.confidence || "inferred",
          basis: candidate.obligation.basis,
          rationale: candidate.rule.rationale,
          legal_force: candidate.legal_force,
          conflict_group: candidate.conflict_group,
          precedence: {
            rank: obligations.length + 1,
            precedence_score: candidate.precedence_score,
            score_breakdown: candidate.score_breakdown,
            precedence_tier: candidate.obligation.precedence_tier || 5
          },
          clause_references: candidate.clause_references
        });
      }

      const overlapGroupsMap = new Map();
      for (const obligation of obligations) {
        const group = obligation.conflict_group || "general";
        if (group === "general") {
          continue;
        }
        if (!overlapGroupsMap.has(group)) {
          overlapGroupsMap.set(group, []);
        }
        overlapGroupsMap.get(group).push({
          regulation_id: obligation.regulation_id,
          standard_id: obligation.standard_id,
          precedence_rank: obligation.precedence.rank,
          precedence_score: obligation.precedence.precedence_score
        });
      }
      const overlap_groups = Array.from(overlapGroupsMap.entries())
        .filter(([, entries]) => entries.length > 1)
        .map(([group, entries]) => ({
          conflict_group: group,
          strategy: "most-specific-and-most-authoritative-first",
          entries
        }));

      const foundationCalls = dedupeBy(
        [
          ...obligations.map((obligation) =>
            mapRegulationToFoundationCall({
              regulation_id: obligation.regulation_id,
              section: obligation.standard_id
            })
          ),
          ...((jurisdictionProfile?.profile?.foundation_join_hints || []).map((entry) => ({
            mcp: entry.mcp,
            tool: entry.tool,
            params: entry.params
          })))
        ],
        (item) => `${item.mcp}|${item.tool}|${JSON.stringify(item.params)}`
      );

      return wrapResponse(
        {
          obligations,
          context: {
            country: normalizedCountry,
            country_input: country,
            country_contexts: countryContexts,
            jurisdiction_profile: jurisdictionProfile
              ? {
                  id: jurisdictionProfile.profile.id,
                  region: jurisdictionProfile.profile.region,
                  coverage_level: jurisdictionProfile.profile.coverage_level,
                  derived_from: jurisdictionProfile.derived_from || undefined
                }
              : null,
            role,
            system_types: systemTypes,
            data_types: dataTypes,
            additional_context: additionalContext
          },
          precedence: {
            strategy: "weighted-legal-force-country-specificity-source-authority",
            considered_rules: matchedRules.length,
            suppressed_duplicates: suppressedDuplicates,
            overlap_groups
          }
        },
        metadataMap,
        {
          confidence: obligations.length > 0 ? "authoritative" : "inferred",
          citations: collectCitations(matchedRules),
          foundation_mcp_calls: foundationCalls,
          inference_rationale:
            "Applicability is determined by deterministic rule matching on country, role, system, data, and contextual attributes."
        }
      );
    },

    async map_to_technical_standards(args = {}) {
      const requirementRef = toText(args.requirement_ref || "");
      const controlId = toText(args.control_id || "");
      if (!requirementRef && !controlId) {
        throw new ToolInputError("requirement_ref or control_id is required", {
          required: ["requirement_ref OR control_id"]
        });
      }

      const redirect = shouldRedirect(`${requirementRef} ${controlId}`);
      if (redirect) {
        return wrapResponse(
          {
            standard_mappings: [],
            guidance: `Out of scope for Defense/Aerospace MCP. Route to ${redirect.mcp} MCP.`
          },
          metadataMap,
          {
            confidence: "authoritative",
            out_of_scope: [redirect.reason],
            inference_rationale: "Requirement classified as non-defense domain content."
          }
        );
      }

      const queryText = `${requirementRef} ${controlId}`.trim();
      const normalizedQuery = normalizeMatchText(queryText);
      const queryTokens = tokenizeForStandardMatch(queryText);
      const queryNumericTokens = queryTokens.filter((tokenPart) => /^\d{3,}$/.test(tokenPart));
      const minimumTokenHits = queryTokens.length >= 8 ? 4 : queryTokens.length >= 5 ? 3 : queryTokens.length >= 3 ? 2 : 1;
      const standards = getAllStandards();

      const mappings = standards
        .map((standard) => {
          const fields = [
            standard.id,
            standard.name,
            standard.scope,
            ...standard.key_clauses,
            ...standard.control_mappings.map((entry) => `${entry.framework} ${entry.control}`),
            ...standard.regulation_mappings.map((entry) => `${entry.regulation_id} ${entry.section}`)
          ].join(" ");

          const normalizedId = normalizeMatchText(standard.id);
          const normalizedName = normalizeMatchText(standard.name);
          const normalizedFields = normalizeMatchText(fields);
          const fieldTokenSet = new Set(tokenizeForStandardMatch(fields));
          const tokenHits = queryTokens.filter((tokenPart) => fieldTokenSet.has(tokenPart));
          const numericHits = tokenHits.filter((tokenPart) => /^\d{2,}$/.test(tokenPart));
          const specificNumericHits = tokenHits.filter((tokenPart) => /^\d{4,}$/.test(tokenPart));
          const alphaNumericHits = tokenHits.filter((tokenPart) => /\d/.test(tokenPart) && /[a-z]/.test(tokenPart));
          const phraseHit =
            (normalizedId.length >= 5 && normalizedQuery.includes(normalizedId)) ||
            (normalizedName.length >= 8 && normalizedQuery.includes(normalizedName));
          let include =
            phraseHit ||
            tokenHits.length >= minimumTokenHits ||
            (tokenHits.length >= 2 && numericHits.length >= 1) ||
            queryTokens.some((tokenPart) => tokenPart.length >= 6 && normalizedFields.includes(tokenPart)) ||
            specificNumericHits.length >= 1;

          if (
            include &&
            queryNumericTokens.length > 0 &&
            !phraseHit &&
            numericHits.length === 0 &&
            alphaNumericHits.length === 0
          ) {
            include = false;
          }

          if (!include) {
            return null;
          }

          const relevance =
            phraseHit || tokenHits.length >= minimumTokenHits + 1
              ? "high"
              : tokenHits.length >= Math.max(2, minimumTokenHits - 1)
                ? "medium"
                : "low";

          return {
            standard_id: standard.id,
            standard_name: standard.name,
            clause: standard.key_clauses[0] || "general applicability",
            relevance,
            implementation_guidance: standard.implementation_guidance,
            _score: tokenHits.length + (phraseHit ? 2 : 0) + (numericHits.length > 0 ? 1 : 0)
          };
        })
        .filter(Boolean)
        .sort((left, right) => right._score - left._score || left.standard_id.localeCompare(right.standard_id))
        .map((entry) => {
          const nextEntry = { ...entry };
          delete nextEntry._score;
          return nextEntry;
        });

      return wrapResponse(
        {
          standard_mappings: mappings
        },
        metadataMap,
        {
          confidence: mappings.length > 0 ? "authoritative" : "inferred",
          citations: collectCitations(standards.filter((item) => mappings.some((mapping) => mapping.standard_id === item.id))),
          inference_rationale:
            "Mappings are generated by lexical matching across standard IDs, clauses, and crosswalk metadata."
        }
      );
    },

    async search_domain_knowledge(args = {}) {
      const query = toText(args.query);
      if (!query) {
        throw new ToolInputError("query is required", { required: ["query"] });
      }

      const redirect = shouldRedirect(query);
      if (redirect) {
        return wrapResponse(
          {
            results: [],
            guidance: `Out of scope for Defense/Aerospace MCP. Route to ${redirect.mcp} MCP.`
          },
          metadataMap,
          {
            confidence: "authoritative",
            out_of_scope: [redirect.reason],
            inference_rationale: "Query classified as non-defense domain content."
          }
        );
      }

      const contentType = (args.content_type || "all").toLowerCase();
      const limit = Math.max(1, Math.min(Number(args.limit) || 10, 25));
      const ftsQuery = toFtsQuery(query);

      const selectedTables = [];
      if (contentType === "all" || contentType === "architecture") {
        selectedTables.push({ table: "architecture_patterns_fts", source: "architecture_patterns" });
      }
      if (contentType === "all" || contentType === "threat") {
        selectedTables.push({ table: "threat_scenarios_fts", source: "threat_scenarios" });
      }
      if (contentType === "all" || contentType === "standard") {
        selectedTables.push({
          table: "technical_standards_fts",
          source: "technical_standards",
          titleField: "name",
          descriptionField: "scope"
        });
      }
      if (contentType === "all" || contentType === "data") {
        selectedTables.push({ table: "data_categories_fts", source: "data_categories" });
      }
      if (contentType === "all" || contentType === "clause") {
        selectedTables.push({
          table: "clause_references_fts",
          source: "clause_references",
          titleField: "title",
          descriptionField: "summary"
        });
      }
      if (contentType === "all" || contentType === "playbook") {
        selectedTables.push({
          table: "expert_playbooks_fts",
          source: "expert_playbooks",
          titleField: "name",
          descriptionField: "scenario"
        });
      }

      const results = [];
      for (const selection of selectedTables) {
        const titleField = selection.titleField || "name";
        const descriptionField = selection.descriptionField || "description";
        const sql = `
          SELECT id, ${titleField} AS name, ${descriptionField} AS description, bm25(${selection.table}) AS score
          FROM ${selection.table}
          WHERE ${selection.table} MATCH ?
          LIMIT ?
        `;

        let rows = [];
        try {
          rows = db.prepare(sql).all(ftsQuery, limit);
        } catch {
          const fallbackQuery = query.replace(/[^a-zA-Z0-9\s]/g, " ").trim() || "defense";
          rows = db.prepare(sql).all(fallbackQuery, limit);
        }

        for (const row of rows) {
          const score = Number(row.score || 0);
          const normalizedScore = Number((1 / (1 + Math.max(score, 0))).toFixed(4));
          results.push({
            id: row.id,
            content_type: selection.source,
            title: row.name,
            snippets: [row.description],
            relevance_score: normalizedScore,
            source_ref: row.id,
            _raw_score: score
          });
        }
      }

      if (contentType === "all" || contentType === "jurisdiction") {
        for (const profile of seed.jurisdictionProfiles || []) {
          const scored = jurisdictionProfileSearchScore(profile, query);
          if (!scored) {
            continue;
          }
          results.push({
            id: profile.id,
            content_type: "jurisdiction_profiles",
            title: `${profile.display_name} (${profile.jurisdiction})`,
            snippets: [
              `Coverage: ${profile.coverage_level}; region: ${profile.region}; baseline: ${(profile.baseline_obligations || []).join(", ")}`
            ],
            relevance_score: scored.relevance_score,
            source_ref: profile.jurisdiction,
            _raw_score: -(1 / (scored.raw_score || 1))
          });
        }
      }

      const sorted = results
        .sort((a, b) => {
          return a._raw_score - b._raw_score;
        })
        .slice(0, limit)
        .map((entry) => {
          const { _raw_score, ...clean } = entry;
          return clean;
        });

      return wrapResponse(
        {
          query,
          results: sorted
        },
        metadataMap,
        {
          confidence: sorted.length > 0 ? "authoritative" : "estimated",
          citations: [sourceCitationMap.get("mitre-attack"), sourceCitationMap.get("dod-cmmc-32cfr170")],
          inference_rationale:
            "FTS5 ranking across seeded architecture, threat, standards, data taxonomy, clause, and expert playbook tables plus jurisdiction profile search."
        }
      );
    },

    async compare_jurisdictions(args = {}) {
      const topic = normalizeTopic(args.topic);
      if (!topic) {
        throw new ToolInputError("topic is required", { required: ["topic"] });
      }

      const jurisdictions = normalizeJurisdictionList(args.jurisdictions);

      let candidateKey = Object.keys(seed.jurisdictionComparisons).find((key) => topic.includes(key));
      if (!candidateKey) {
        if (topic.includes("cmmc") || topic.includes("sweden")) {
          candidateKey = "cmmc 2.0 vs swedish defense procurement";
        } else if (topic.includes("itar") || topic.includes("dual-use") || topic.includes("export")) {
          candidateKey = "itar vs eu dual-use";
        } else if (topic.includes("breach") || topic.includes("incident")) {
          candidateKey = "breach notification";
        }
      }

      let matrix = seed.jurisdictionComparisons[candidateKey] || [];
      if (jurisdictions.length > 0) {
        matrix = matrix.filter((entry) => {
          const entryContexts = buildJurisdictionContexts(entry.jurisdiction);
          return jurisdictions.some((jurisdiction) => {
            const requestContexts = buildJurisdictionContexts(jurisdiction);
            return requestContexts.some((context) => entryContexts.includes(context));
          });
        });
      }

      return wrapResponse(
        {
          topic,
          comparison_matrix: matrix
        },
        metadataMap,
        {
          confidence: matrix.length > 0 ? "authoritative" : "estimated",
          citations: [sourceCitationMap.get("dod-cmmc-32cfr170"), sourceCitationMap.get("itar-usml"), sourceCitationMap.get("nato-cm-2002-49")],
          inference_rationale:
            "Comparison matrix is sourced from seeded jurisdiction-specific obligation summaries and filtered by requested jurisdictions."
        }
      );
    },

    async build_control_baseline(args = {}) {
      requireObject(args.org_profile, "org_profile");
      const orgProfile = args.org_profile || {};
      const dataTypes = normalizeArray(orgProfile.data_types || []).map((entry) => String(entry).toLowerCase());
      const priorityProgram = Boolean(orgProfile.priority_program || orgProfile.highest_priority_cui);

      const controls = [...seed.controlBaselines.default];
      if (priorityProgram || dataTypes.includes("cui_highest_priority") || dataTypes.includes("highest_priority_cui")) {
        controls.push(...seed.controlBaselines.l3_enhanced);
      }

      const prioritized = controls.map((control) => ({
        control_id: control.control_id,
        title: control.title,
        priority: control.priority,
        rationale: control.rationale,
        regulation_basis: control.regulation_basis,
        standard_basis: control.standard_basis
      }));

      return wrapResponse(
        {
          controls: prioritized
        },
        metadataMap,
        {
          confidence: "inferred",
          citations: [sourceCitationMap.get("nist-800-171-r3"), sourceCitationMap.get("dod-cmmc-32cfr170")],
          inference_rationale:
            "Baseline is assembled from seeded crosswalk controls, with L3 enhancements when high-priority CUI context is present."
        }
      );
    },

    async build_evidence_plan(args = {}) {
      const baseline = args.baseline || {};
      const auditType = toText(args.audit_type || "");
      const evidence = getAllEvidence();

      const selected = evidence.filter((item) => {
        if (!auditType) {
          return true;
        }
        return item.audit_type.toLowerCase().includes(auditType.toLowerCase());
      });

      const baselineControls = normalizeArray(baseline.controls || baseline.control_ids || []);
      const mapped = selected.map((item) => ({
        artifact_name: item.artifact_name,
        description: item.description,
        template_ref: item.template_ref,
        retention_period: item.retention_period,
        mandatory: item.mandatory,
        regulation_basis: item.regulation_basis,
        baseline_alignment:
          baselineControls.length > 0
            ? `Supports controls: ${baselineControls.join(", ")}`
            : "Supports baseline evidence for selected audit type"
      }));

      return wrapResponse(
        {
          evidence_items: mapped
        },
        metadataMap,
        {
          confidence: mapped.length > 0 ? "authoritative" : "estimated",
          citations: collectCitations(selected),
          inference_rationale:
            "Evidence plan is generated from audit-type artifact mappings with optional baseline control context."
        }
      );
    },

    async assess_breach_obligations(args = {}) {
      const incidentDescription = toText(args.incident_description);
      const jurisdictions = normalizeJurisdictionList(args.jurisdictions);
      const dataTypes = normalizeArray(args.data_types).map((entry) => String(entry).toLowerCase());

      if (!incidentDescription) {
        throw new ToolInputError("incident_description is required", {
          required: ["incident_description"]
        });
      }

      if (jurisdictions.length === 0) {
        throw new ToolInputError("jurisdictions must include at least one jurisdiction", {
          required: ["jurisdictions[]"]
        });
      }

      if (dataTypes.length === 0) {
        throw new ToolInputError("data_types must include at least one data type", {
          required: ["data_types[]"]
        });
      }

      const notifications = [];
      for (const jurisdiction of jurisdictions) {
        const contextBuckets = dedupeBy(
          buildJurisdictionContexts(jurisdiction)
            .map((context) => seed.breachObligations[context])
            .filter(Boolean),
          (entry) => JSON.stringify(entry)
        );

        if (contextBuckets.length === 0 && isEuContext(jurisdiction) && seed.breachObligations.EU) {
          contextBuckets.push(seed.breachObligations.EU);
        }
        if (contextBuckets.length === 0 && isUsContext(jurisdiction) && seed.breachObligations.US) {
          contextBuckets.push(seed.breachObligations.US);
        }

        for (const dataType of dataTypes) {
          for (const buckets of contextBuckets) {
            const entries = buckets[dataType] || [];
            for (const entry of entries) {
              notifications.push({
                jurisdiction,
                data_type: dataType,
                recipient: entry.recipient,
                deadline: entry.deadline,
                content_requirements: entry.content_requirements,
                penalties: entry.penalties
              });
            }
          }
        }
      }

      if (notifications.length === 0) {
        notifications.push({
          jurisdiction: jurisdictions[0],
          data_type: dataTypes[0] || "unspecified",
          recipient: "Contracting authority and legal/compliance counsel",
          deadline: "Immediate triage",
          content_requirements: ["Incident summary", "Potential controlled data impact", "Containment actions"],
          penalties: "Contractual and regulatory exposure varies by regime"
        });
      }

      if (/classified spill|spillage/i.test(incidentDescription)) {
        notifications.push({
          jurisdiction: jurisdictions[0],
          data_type: "classified",
          recipient: "Security authority / facility security officer",
          deadline: "Immediate",
          content_requirements: ["Classification level", "distribution list", "containment confirmation"],
          penalties: "Security enforcement and contract penalties"
        });
      }

      return wrapResponse(
        {
          notifications: dedupeBy(
            notifications,
            (item) => `${item.jurisdiction}|${item.data_type}|${item.recipient}|${item.deadline}`
          )
        },
        metadataMap,
        {
          confidence: "authoritative",
          citations: [
            sourceCitationMap.get("dfars-7012"),
            sourceCitationMap.get("itar-usml"),
            sourceCitationMap.get("eu-dual-use"),
            sourceCitationMap.get("eu-nis2")
          ],
          inference_rationale:
            "Notification obligations are mapped from jurisdiction/data-type decision tables with incident-type escalation handling."
        }
      );
    },

    async create_remediation_backlog(args = {}) {
      requireObject(args.current_state, "current_state");
      requireObject(args.target_baseline, "target_baseline");
      const currentState = args.current_state || {};
      const targetBaseline = args.target_baseline || {};

      let targetControls = [];
      if (Array.isArray(targetBaseline.controls)) {
        targetControls = targetBaseline.controls.map((control) => {
          if (typeof control === "string") {
            return {
              control_id: control,
              priority: "medium",
              regulation_basis: ["Baseline target"],
              title: control
            };
          }
          return control;
        });
      } else {
        targetControls = seed.controlBaselines.default;
      }

      const implemented = new Set(
        normalizeArray(currentState.controls_implemented || currentState.implemented_controls || []).map((entry) =>
          String(entry)
        )
      );

      const backlogItems = [];
      for (const control of targetControls) {
        const controlId = control.control_id || control.id || control.title;
        if (implemented.has(controlId)) {
          continue;
        }

        const priority = control.priority || "medium";
        const effort = priority === "high" ? "medium" : "low";
        const riskReduction = priority === "high" ? "high" : "moderate";

        backlogItems.push({
          action_id: `rem-${controlId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          title: `Implement control ${controlId}`,
          priority,
          effort_estimate: effort,
          regulation_basis: control.regulation_basis || ["Baseline"],
          risk_reduction: riskReduction,
          implementation_note: `Deliver design, implementation evidence, and test artifacts for ${controlId}.`
        });
      }

      return wrapResponse(
        {
          backlog_items: backlogItems
        },
        metadataMap,
        {
          confidence: "inferred",
          citations: [sourceCitationMap.get("dod-cmmc-32cfr170"), sourceCitationMap.get("nist-800-171-r3")],
          inference_rationale:
            "Backlog is generated by diffing implemented controls against target baseline controls and assigning deterministic effort/risk scores."
        }
      );
    },

    async determine_cmmc_level(args = {}) {
      requireNonEmptyString(args.contract_description, "contract_description");
      requireNonEmptyArray(args.data_types, "data_types");
      requireNonEmptyString(args.prime_or_sub, "prime_or_sub");
      const contractDescription = toText(args.contract_description).toLowerCase();
      const dataTypes = normalizeArray(args.data_types).map((entry) => String(entry).toLowerCase());
      const primeOrSub = toText(args.prime_or_sub || "unknown").toLowerCase();
      const currentPosture = args.current_posture || {};

      let cmmcLevel = "Level 1";
      let assessmentType = "Self-assessment";
      let practiceCount = 17;

      const highestPriority = contractDescription.includes("highest-priority") || contractDescription.includes("priority program") || dataTypes.includes("highest_priority_cui");

      if (highestPriority || contractDescription.includes("level 3")) {
        cmmcLevel = "Level 3";
        assessmentType = "Government-led assessment (DIBCAC)";
        practiceCount = 134;
      } else if (dataTypes.includes("cui") || contractDescription.includes("cui")) {
        cmmcLevel = "Level 2";
        assessmentType =
          primeOrSub === "prime_contractor" || primeOrSub === "prime"
            ? "C3PAO assessment likely for prioritized acquisitions"
            : "Self-assessment or C3PAO based on contract prioritization";
        practiceCount = 110;
      } else if (dataTypes.includes("fci") || contractDescription.includes("fci")) {
        cmmcLevel = "Level 1";
        assessmentType = "Self-assessment";
        practiceCount = 17;
      }

      const requiredFamilies =
        cmmcLevel === "Level 1"
          ? ["basic safeguarding", "access control"]
          : cmmcLevel === "Level 2"
            ? [
                "access control",
                "awareness and training",
                "audit and accountability",
                "configuration management",
                "identification and authentication",
                "incident response",
                "media protection"
              ]
            : [
                "enhanced monitoring",
                "advanced incident response",
                "supply chain risk resilience",
                "threat hunting"
              ];

      const implementedFamilies = new Set(
        normalizeArray(currentPosture.implemented_families || []).map((entry) => String(entry).toLowerCase())
      );

      const gapAreas = requiredFamilies.filter((family) => !implementedFamilies.has(family.toLowerCase()));

      return wrapResponse(
        {
          cmmc_level: cmmcLevel,
          assessment_type: assessmentType,
          practice_count: practiceCount,
          baseline_reference: {
            operational: "CMMC currently maps Level 2 to the 110 NIST SP 800-171 Rev.2-aligned practices under 32 CFR Part 170.",
            modernization: "NIST SP 800-171 Rev.3 and SP 800-171A Rev.3 are current authoritative NIST publications for future rule transition planning."
          },
          implementation_timeline: {
            cmmc_program_effective: "2024-12-16",
            dfars_cmmc_effective: "2025-11-10",
            full_phase_in_target: "2028-11-10"
          },
          gap_areas: gapAreas,
          flowdown_considerations: [
            "Prime must verify subcontractor flowdown for CUI handling",
            "Supplier CMMC status should be tracked for critical data paths"
          ]
        },
        metadataMap,
        {
          confidence: "inferred",
          citations: [
            sourceCitationMap.get("dod-cmmc-32cfr170"),
            sourceCitationMap.get("dfars-cmmc-subpart-204-75"),
            sourceCitationMap.get("nist-800-171-r3"),
            sourceCitationMap.get("nist-800-171a-r3")
          ],
          inference_rationale:
            "CMMC level is inferred from contract/data context using deterministic decision logic aligned to L1/L2/L3 triggers."
        }
      );
    },

    async classify_export_control(args = {}) {
      const description = toText(args.item_description).toLowerCase();
      const technicalParams = toText(args.technical_params).toLowerCase();
      const destination = toText(args.destination).toUpperCase();
      if (!description) {
        throw new ToolInputError("item_description is required", {
          required: ["item_description"]
        });
      }
      if (!destination) {
        throw new ToolInputError("destination is required", {
          required: ["destination"]
        });
      }

      const allText = `${description} ${technicalParams}`;
      const embargoed = new Set(["IR", "KP", "SY", "RU", "CU", "BY"]);
      const defenseRestricted = new Set(["CN", "VE"]);

      let jurisdiction = "EAR";
      let classification = "ECCN to be determined";
      let licenseRequired = false;
      let exceptions = ["Case-by-case review"];

      if (/(missile|munition|weapon|guidance|warhead|targeting)/i.test(allText)) {
        jurisdiction = "ITAR";
        classification = "USML Category IV (indicative)";
        licenseRequired = true;
        exceptions = ["TAA/MLA may apply", "No export without DDTC authorization"];
      } else if (/(satellite|spacecraft payload)/i.test(allText)) {
        jurisdiction = "ITAR/EAR review required";
        classification = "USML Category XV or ECCN candidate";
        licenseRequired = true;
        exceptions = ["Commodity jurisdiction review recommended"];
      } else if (/(dual-use|encryption|cryptographic|crypto)/i.test(allText)) {
        jurisdiction = "EAR";
        classification = "ECCN 5A002 / 5D002 candidate";
        licenseRequired = !["EU", "NL", "SE", "DE", "UK", "CA", "AU"].includes(destination);
        exceptions = ["License Exception ENC (if eligibility met)"];
      }

      if (embargoed.has(destination)) {
        licenseRequired = true;
        exceptions = ["No standard exception; strict embargo controls apply"];
      } else if (defenseRestricted.has(destination)) {
        licenseRequired = true;
        exceptions = ["Significant defense export restrictions; license review required for all controlled items"];
      }

      return wrapResponse(
        {
          jurisdiction,
          classification,
          license_required: licenseRequired,
          exceptions,
          destination,
          screening_requirements: [
            "Denied/restricted party screening",
            "End-use and end-user review",
            "Recordkeeping for classification and transfer decisions"
          ]
        },
        metadataMap,
        {
          confidence: "inferred",
          citations: [sourceCitationMap.get("itar-usml"), sourceCitationMap.get("ear-ccl")],
          inference_rationale:
            "Classification uses item keyword heuristics aligned to ITAR/EAR trigger categories and destination-based license logic."
        }
      );
    },

    async assess_classified_environment(args = {}) {
      requireNonEmptyString(args.country, "country");
      requireNonEmptyString(args.system_type, "system_type");
      const level = toText(args.classification_level).toUpperCase();
      const country = normalizeJurisdictionToken(args.country);
      const systemType = toText(args.system_type || "general");

      if (!level) {
        throw new ToolInputError("classification_level is required", {
          required: ["classification_level"]
        });
      }

      let accreditationStandard = "National security authority baseline";
      let technicalControls = ["Need-to-know enforcement", "Strong identity assurance", "Comprehensive audit logging"];
      let physicalRequirements = ["Controlled facility access", "Cleared personnel only", "Secure media storage"];
      let personnelRequirements = ["Background vetting", "Security training", "Insider threat monitoring"];

      if (level.includes("CUI")) {
        accreditationStandard = "NIST SP 800-171 / CMMC boundary";
        technicalControls = [
          "CUI scoping and boundary controls",
          "FIPS-validated encryption",
          "Incident reporting readiness",
          "Media sanitization"
        ];
      } else if (level.includes("NATO")) {
        accreditationStandard = "NATO C-M(2002)49 + national implementation";
        technicalControls = [
          "STANAG 4774 label handling",
          "STANAG 4778 metadata binding",
          "Cross-domain guard policy enforcement",
          "Compartmented access controls"
        ];
        physicalRequirements.push("NATO-approved document handling zones");
      } else if (country === "UK" && (level.includes("SECRET") || level.includes("TOP SECRET") || level.includes("OFFICIAL"))) {
        accreditationStandard = "UK HMG Security Policy Framework + Def Stan 05-138";
        technicalControls = [
          "UK List X / List N facility accreditation",
          "Cyber Essentials Plus certification baseline",
          "UK national authority-approved CDS for cross-domain transfers",
          "NCSC-approved cryptography for classified communications"
        ];
        physicalRequirements.push("Physical security measures per HMG SPF classification tier");
        personnelRequirements.push("Developed Vetting (DV) or Security Check (SC) as required by classification level");
      } else if (country === "US" && (level.includes("SECRET") || level.includes("TOP SECRET") || level.includes("CONFIDENTIAL"))) {
        accreditationStandard = "NISPOM + CNSSI 1253 / RMF";
        technicalControls = [
          "Classified enclave segmentation",
          "Type-appropriate cryptography",
          "Cross-domain transfer controls",
          "Continuous monitoring for privileged activity"
        ];
      }

      if (/cloud/i.test(systemType)) {
        technicalControls.push("Impact-level tenancy segmentation");
        technicalControls.push("Privileged cloud admin nationality/access controls");

        if (country === "US" || isUsContext(country)) {
          if (level.includes("CUI")) {
            technicalControls.push("FedRAMP Moderate or High authorization baseline required");
            technicalControls.push("DoD IL4 (CUI) or IL5 (CUI with national security data) environment designation");
            technicalControls.push("GCC High or equivalent DoD-approved cloud offering");
          } else if (level.includes("SECRET") || level.includes("TOP SECRET")) {
            technicalControls.push("DoD IL6 (classified SECRET) isolated cloud environment");
            technicalControls.push("FedRAMP High baseline with DoD SRG overlay");
            technicalControls.push("US-only data residency and personnel restrictions");
          }
        }
      }

      return wrapResponse(
        {
          accreditation_standard: accreditationStandard,
          physical_requirements: dedupeBy(physicalRequirements, (item) => item),
          technical_controls: dedupeBy(technicalControls, (item) => item),
          personnel_requirements: dedupeBy(personnelRequirements, (item) => item)
        },
        metadataMap,
        {
          confidence: "inferred",
          citations: [sourceCitationMap.get("nispom"), sourceCitationMap.get("nato-cm-2002-49")],
          inference_rationale:
            "Classified environment controls are selected from level and jurisdiction-specific baseline profiles."
        }
      );
    },

    async assess_nato_interoperability(args = {}) {
      requireNonEmptyString(args.sharing_scope, "sharing_scope");
      requireNonEmptyString(args.classification, "classification");
      requireNonEmptyArray(args.participating_nations, "participating_nations");
      const sharingScope = toText(args.sharing_scope || "coalition operation");
      const classification = toText(args.classification || "NATO RESTRICTED");
      const participatingNations = normalizeArray(args.participating_nations).map((entry) => String(entry).toUpperCase());

      const stanagRequirements = [
        {
          standard_id: "NATO_STANAG_4774",
          requirement: "Machine-readable confidentiality labels and caveats"
        },
        {
          standard_id: "NATO_STANAG_4778",
          requirement: "Metadata binding integrity across exchanged artifacts"
        }
      ];

      const securityAgreements = [
        "NATO security agreement implementation confirmation",
        "National security authority-approved sharing channels",
        "Cross-domain release policy and caveat registry"
      ];

      if (classification.toUpperCase().includes("CONFIDENTIAL") || classification.toUpperCase().includes("SECRET")) {
        securityAgreements.push("Facility and personnel clearance verification for all participant organizations");
      }

      const handlingCaveats = [
        `Scope: ${sharingScope}`,
        "Release only to listed nations with valid need-to-know",
        "No onward transfer without originating authority approval"
      ];

      if (participatingNations.length > 0) {
        handlingCaveats.push(`Participating nations: ${participatingNations.join(", ")}`);
      }

      return wrapResponse(
        {
          stanag_requirements: stanagRequirements,
          security_agreements: securityAgreements,
          handling_caveats: handlingCaveats
        },
        metadataMap,
        {
          confidence: "inferred",
          citations: [sourceCitationMap.get("stanag-4774"), sourceCitationMap.get("stanag-4778")],
          inference_rationale:
            "Interoperability profile is derived from NATO metadata labeling/binding standards and classification handling constraints."
        }
      );
    }
  };
}

const TOOL_DEFINITIONS = [
  {
    name: "about",
    description:
      "Return server metadata, domain coverage, freshness, and known gaps for the Defense/Aerospace domain MCP.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "list_sources",
    description: "List authoritative sources used by this MCP with provenance, licensing, and refresh cadence.",
    inputSchema: {
      type: "object",
      properties: {
        source_type: { type: "string", description: "Optional filter by source type (standard, regulation, policy, threat-intel)." },
        limit: { type: "number", minimum: 1, maximum: 200, description: "Maximum number of source entries to return (default: 50)." },
        offset: { type: "number", minimum: 0, description: "Zero-based pagination offset." }
      }
    }
  },
  {
    name: "list_jurisdiction_profiles",
    description:
      "List jurisdiction intelligence profiles for EU full-coverage, US minimum-coverage, and NATO-focused mappings with optional filters.",
    inputSchema: {
      type: "object",
      properties: {
        region: { type: "string", enum: ["EU", "US", "NATO"] },
        coverage_level: { type: "string", enum: ["full", "minimum", "focused"] },
        jurisdiction: { type: "string" },
        country: { type: "string" },
        nato_member: { type: "boolean" },
        limit: { type: "number", minimum: 1, maximum: 200 },
        offset: { type: "number", minimum: 0 }
      }
    }
  },
  {
    name: "get_jurisdiction_profile",
    description:
      "Resolve one jurisdiction profile (country/state/region) with baseline obligations, reporting model, and foundation MCP join hints.",
    inputSchema: {
      type: "object",
      required: ["jurisdiction"],
      properties: {
        jurisdiction: { type: "string" },
        country: { type: "string" }
      }
    }
  },
  {
    name: "get_coverage_matrix",
    description:
      "Return coverage completeness matrix for jurisdiction intelligence (EU member states, US state compatibility, and NATO member profiles).",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get_expertise_scorecard",
    description:
      "Compute weighted expert-quality scorecard across jurisdiction coverage, data completeness, source quality, rule rigor, and tool-contract readiness.",
    inputSchema: {
      type: "object",
      properties: {
        strict: { type: "boolean", description: "When true, enforce stricter minimum score and freshness checks." },
        max_source_age_days: {
          type: "number",
          minimum: 30,
          maximum: 1460,
          description: "Maximum acceptable age in days for authoritative source verification."
        }
      }
    }
  },
  {
    name: "list_expert_playbooks",
    description:
      "List expert defense/aerospace decision playbooks (CMMC, export control, NATO sharing, incident response, supply chain) with optional filtering.",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string" },
        query: { type: "string" },
        jurisdiction: { type: "string" },
        country: { type: "string" },
        data_type: { type: "string" },
        limit: { type: "number", minimum: 1, maximum: 50 }
      }
    }
  },
  {
    name: "get_expert_playbook",
    description:
      "Retrieve one expert decision playbook by ID or scenario text, including steps, pitfalls, evidence outputs, and regulatory basis.",
    inputSchema: {
      type: "object",
      properties: {
        playbook_id: { type: "string" },
        scenario: { type: "string" },
        topic: { type: "string" }
      }
    }
  },
  {
    name: "list_clause_references",
    description: "List clause-level references and provision summaries for applicable regulations and frameworks.",
    inputSchema: {
      type: "object",
      properties: {
        regulation_id: { type: "string" },
        jurisdiction_scope: { type: "string" },
        limit: { type: "number", minimum: 1, maximum: 500 },
        offset: { type: "number", minimum: 0 }
      }
    }
  },
  {
    name: "get_clause_reference",
    description: "Retrieve a single clause/provision reference by clause ID or regulation + provision reference.",
    inputSchema: {
      type: "object",
      properties: {
        clause_id: { type: "string" },
        regulation_id: { type: "string" },
        provision_ref: { type: "string" }
      }
    }
  },
  {
    name: "list_architecture_patterns",
    description: "List available defense/aerospace architecture archetypes with optional category filtering.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Optional architecture category filter (classified, mission, supply-chain, cloud, etc.)." }
      }
    }
  },
  {
    name: "get_architecture_pattern",
    description:
      "Return full architecture detail including components, trust boundaries, data flows, integration points, weaknesses, and standards.",
    inputSchema: {
      type: "object",
      required: ["pattern_id"],
      properties: {
        pattern_id: { type: "string", description: "Architecture pattern identifier, e.g. da-cui-environment." }
      }
    }
  },
  {
    name: "classify_data",
    description:
      "Classify defense/aerospace data and return category mapping, protection tier, handling requirements, and applicable regulatory regimes.",
    inputSchema: {
      type: "object",
      required: ["data_description"],
      properties: {
        data_description: { type: "string" },
        jurisdictions: { type: "array", items: { type: "string" } }
      }
    }
  },
  {
    name: "get_domain_threats",
    description:
      "Return defense threat scenarios mapped to MITRE ATT&CK, regulations, and control references for the provided architecture and data context.",
    inputSchema: {
      type: "object",
      properties: {
        architecture_pattern: { type: "string" },
        data_types: { type: "array", items: { type: "string" } },
        deployment_context: { type: "string" }
      }
    }
  },
  {
    name: "assess_applicability",
    description:
      "Compute jurisdiction-aware obligation map (regulations and standards) based on organization profile and data/system context.",
    inputSchema: {
      type: "object",
      required: ["country"],
      properties: {
        country: { type: "string" },
        role: { type: "string" },
        system_types: { type: "array", items: { type: "string" } },
        data_types: { type: "array", items: { type: "string" } },
        additional_context: { type: "object" }
      }
    }
  },
  {
    name: "map_to_technical_standards",
    description:
      "Map a requirement or control identifier to relevant technical standards and implementation guidance.",
    inputSchema: {
      type: "object",
      properties: {
        requirement_ref: { type: "string" },
        control_id: { type: "string" }
      }
    }
  },
  {
    name: "search_domain_knowledge",
    description:
      "Full-text search across architecture patterns, threats, standards, data taxonomy, clauses, jurisdiction profiles, and expert playbooks with relevance scoring.",
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string" },
        content_type: {
          type: "string",
          enum: ["all", "architecture", "threat", "standard", "data", "clause", "jurisdiction", "playbook"]
        },
        limit: { type: "number", minimum: 1, maximum: 25 }
      }
    }
  },
  {
    name: "compare_jurisdictions",
    description: "Compare obligations and implementation expectations by topic across requested jurisdictions.",
    inputSchema: {
      type: "object",
      required: ["topic"],
      properties: {
        topic: { type: "string" },
        jurisdictions: { type: "array", items: { type: "string" } }
      }
    }
  },
  {
    name: "build_control_baseline",
    description: "Build prioritized security control baseline for a defense organization profile.",
    inputSchema: {
      type: "object",
      required: ["org_profile"],
      properties: {
        org_profile: { type: "object" }
      }
    }
  },
  {
    name: "build_evidence_plan",
    description: "Generate required evidence artifacts for selected baseline and audit profile.",
    inputSchema: {
      type: "object",
      properties: {
        baseline: { type: "object" },
        audit_type: { type: "string" }
      }
    }
  },
  {
    name: "assess_breach_obligations",
    description: "Determine notification obligations, deadlines, and required disclosure content for incident context.",
    inputSchema: {
      type: "object",
      required: ["incident_description", "jurisdictions", "data_types"],
      properties: {
        incident_description: { type: "string" },
        jurisdictions: { type: "array", items: { type: "string" } },
        data_types: { type: "array", items: { type: "string" } }
      }
    }
  },
  {
    name: "create_remediation_backlog",
    description: "Create prioritized remediation actions from current-state gaps against a target baseline.",
    inputSchema: {
      type: "object",
      required: ["current_state", "target_baseline"],
      properties: {
        current_state: { type: "object" },
        target_baseline: { type: "object" }
      }
    }
  },
  {
    name: "determine_cmmc_level",
    description: "Determine likely CMMC level, assessment route, practice count, and high-level gap areas.",
    inputSchema: {
      type: "object",
      required: ["contract_description", "data_types", "prime_or_sub"],
      properties: {
        contract_description: { type: "string" },
        data_types: { type: "array", items: { type: "string" } },
        prime_or_sub: { type: "string" },
        current_posture: { type: "object" }
      }
    }
  },
  {
    name: "classify_export_control",
    description: "Perform ITAR/EAR-oriented export control classification guidance for an item and destination context.",
    inputSchema: {
      type: "object",
      required: ["item_description", "destination"],
      properties: {
        item_description: { type: "string" },
        technical_params: { type: "string" },
        destination: { type: "string" }
      }
    }
  },
  {
    name: "assess_classified_environment",
    description:
      "Assess baseline accreditation, physical, technical, and personnel requirements for classified processing context.",
    inputSchema: {
      type: "object",
      required: ["classification_level", "country", "system_type"],
      properties: {
        classification_level: { type: "string" },
        country: { type: "string" },
        system_type: { type: "string" }
      }
    }
  },
  {
    name: "assess_nato_interoperability",
    description: "Assess NATO interoperability security requirements for multi-nation information sharing scenarios.",
    inputSchema: {
      type: "object",
      required: ["sharing_scope", "classification", "participating_nations"],
      properties: {
        sharing_scope: { type: "string" },
        classification: { type: "string" },
        participating_nations: { type: "array", items: { type: "string" } }
      }
    }
  }
];

module.exports = {
  makeTools,
  TOOL_DEFINITIONS,
  ToolInputError
};
