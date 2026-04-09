# Tools — Defense Aerospace MCP

This document describes every tool exposed by the Defense/Aerospace MCP server, including required and optional parameters, return types, and usage notes.

There are **26 tools** total: 3 mandatory meta-tools (about, list_sources, check_data_freshness), and 23 domain tools.

---

## Meta-Tools

### `about`

Return server metadata, domain coverage, dataset version, freshness, and known gaps for the Defense/Aerospace MCP.

**Parameters:** none

**Returns:** Server metadata object including `dataset_version`, `last_updated`, `knowledge_baseline_date`, `tool_count`, domain description, and known gap notices.

---

### `list_sources`

List all authoritative sources used by this MCP with provenance, licensing, and refresh cadence.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source_type` | string | no | Filter by source type: `standard`, `regulation`, `policy`, `threat-intel` |
| `limit` | number | no | Maximum entries to return (default: 50, max: 200) |
| `offset` | number | no | Zero-based pagination offset |

**Returns:** Array of source records with `id`, `name`, `type`, `url`, `license`, `last_verified`, and `authority` fields.

---

### `check_data_freshness`

Check the freshness of each ingested data source. Reports staleness against configurable thresholds and provides guidance on update actions.

**Parameters:** none

**Returns:** Object with `overall_status` (`ok` | `stale` | `degraded`), `checked_at`, per-source freshness records including `source_id`, `name`, `last_verified`, `age_days`, `status`, and `action` fields.

---

## Jurisdiction & Coverage Tools

### `list_jurisdiction_profiles`

List jurisdiction intelligence profiles for EU full-coverage, US minimum-coverage, and NATO-focused mappings.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `region` | string | no | Filter by region: `EU`, `US`, `NATO` |
| `coverage_level` | string | no | Filter by coverage level: `full`, `minimum`, `focused` |
| `jurisdiction` | string | no | Jurisdiction code (e.g., `DE`, `US-CA`, `NATO`) |
| `country` | string | no | ISO country code |
| `nato_member` | boolean | no | When `true`, return only NATO member profiles |
| `limit` | number | no | Max profiles to return (max: 200) |
| `offset` | number | no | Zero-based pagination offset |

**Returns:** Array of jurisdiction profile summaries.

---

### `get_jurisdiction_profile`

Resolve one jurisdiction profile (country/state/region) with baseline obligations, reporting model, and foundation MCP join hints.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `jurisdiction` | string | **yes** | Jurisdiction code (e.g., `DE`, `US-TX`, `NATO`) |
| `country` | string | no | ISO country code for disambiguation |

**Returns:** Full profile object with obligations, reporting model, regulatory contacts, and join hints.

---

### `get_coverage_matrix`

Return coverage completeness matrix for jurisdiction intelligence (EU member states, US state compatibility, and NATO member profiles).

**Parameters:** none

**Returns:** Coverage matrix with EU, US, and NATO coverage counts, completeness percentages, and per-jurisdiction status rows.

---

### `get_expertise_scorecard`

Compute weighted expert-quality scorecard across jurisdiction coverage, data completeness, source quality, rule rigor, and tool-contract readiness.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `strict` | boolean | no | When `true`, enforce stricter minimum score and freshness checks |
| `max_source_age_days` | number | no | Maximum acceptable source age in days (range: 30–1460) |

**Returns:** Scorecard object with overall score, per-dimension scores, pass/fail status, and remediation hints.

---

### `compare_jurisdictions`

Compare obligations and implementation expectations by topic across requested jurisdictions.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `topic` | string | **yes** | Comparison topic (e.g., `incident reporting`, `export control`) |
| `jurisdictions` | string[] | no | List of jurisdiction codes to compare (e.g., `["US", "DE", "NATO"]`) |

**Returns:** Comparison table with per-jurisdiction obligations, deadlines, authority contacts, and gap notes.

---

## Expert Playbook Tools

### `list_expert_playbooks`

List expert defense/aerospace decision playbooks (CMMC, export control, NATO sharing, incident response, supply chain) with optional filtering.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `topic` | string | no | Filter by topic keyword |
| `query` | string | no | Free-text search query |
| `jurisdiction` | string | no | Filter by applicable jurisdiction |
| `country` | string | no | Filter by applicable country |
| `data_type` | string | no | Filter by relevant data type |
| `limit` | number | no | Max playbooks to return (max: 50) |

**Returns:** Array of playbook summaries with `id`, `title`, `topic`, `jurisdiction`, and abstract.

---

### `get_expert_playbook`

Retrieve one expert decision playbook by ID or scenario text, including steps, pitfalls, evidence outputs, and regulatory basis.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `playbook_id` | string | no* | Playbook identifier |
| `scenario` | string | no* | Scenario description to match |
| `topic` | string | no | Topic hint for disambiguation |

*At least one of `playbook_id` or `scenario` should be provided.

**Returns:** Full playbook with `steps`, `decision_points`, `pitfalls`, `evidence_outputs`, `regulatory_basis`, and `related_playbooks`.

---

## Clause Reference Tools

### `list_clause_references`

List clause-level references and provision summaries for applicable regulations and frameworks.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `regulation_id` | string | no | Filter by regulation (e.g., `cmmc`, `dfars-7012`, `itar`) |
| `jurisdiction_scope` | string | no | Filter by jurisdiction scope |
| `limit` | number | no | Max clauses to return (max: 500) |
| `offset` | number | no | Zero-based pagination offset |

**Returns:** Array of clause references with `clause_id`, `regulation_id`, `provision_ref`, `title`, and summary.

---

### `get_clause_reference`

Retrieve a single clause/provision reference by clause ID or regulation + provision reference.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `clause_id` | string | no* | Clause identifier |
| `regulation_id` | string | no* | Regulation identifier (e.g., `cmmc`, `nist-800-171-r3`) |
| `provision_ref` | string | no | Provision reference within the regulation |

*At least one of `clause_id` or `regulation_id` should be provided.

**Returns:** Full clause record with text, obligations, cross-references, and source citations.

---

## Architecture Pattern Tools

### `list_architecture_patterns`

List available defense/aerospace architecture archetypes with optional category filtering.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `category` | string | no | Architecture category (e.g., `classified`, `mission`, `supply-chain`, `cloud`) |

**Returns:** Array of architecture pattern summaries with `pattern_id`, `name`, `category`, and description.

---

### `get_architecture_pattern`

Return full architecture detail including components, trust boundaries, data flows, integration points, weaknesses, and applicable standards.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pattern_id` | string | **yes** | Architecture pattern identifier (e.g., `da-cui-environment`) |

**Returns:** Full pattern object with `components`, `trust_boundaries`, `data_flows`, `integration_points`, `known_weaknesses`, and `applicable_standards`.

---

## Data Classification & Threat Tools

### `classify_data`

Classify defense/aerospace data and return category mapping, protection tier, handling requirements, and applicable regulatory regimes.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `data_description` | string | **yes** | Natural-language description of the data to classify |
| `jurisdictions` | string[] | no | Jurisdiction codes to scope classification (e.g., `["US", "DE"]`) |

**Returns:** Classification result with `categories`, `protection_tier`, `handling_requirements`, `applicable_regimes`, and `redirect_hints` if the data is outside domain scope.

---

### `get_domain_threats`

Return defense threat scenarios mapped to MITRE ATT&CK, regulations, and control references for the provided architecture and data context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `architecture_pattern` | string | no | Architecture pattern ID or name |
| `data_types` | string[] | no | Data type identifiers in scope |
| `deployment_context` | string | no | Free-text deployment context description |

**Returns:** Array of threat scenarios with `id`, `name`, `mitre_techniques`, `likelihood`, `impact`, `applicable_controls`, and `regulatory_refs`.

---

## Applicability & Compliance Tools

### `assess_applicability`

Compute jurisdiction-aware obligation map (regulations and standards) based on organization profile and data/system context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `country` | string | **yes** | ISO country code of the organization |
| `role` | string | no | Organization role (e.g., `prime_contractor`, `subcontractor`, `supplier`) |
| `system_types` | string[] | no | System or service type identifiers in scope |
| `data_types` | string[] | no | Data category identifiers in scope |
| `additional_context` | object | no | Additional context key-value pairs |

**Returns:** Obligation map grouped by regulation, with applicability basis, compliance thresholds, and jurisdiction-specific notes.

---

### `map_to_technical_standards`

Map a requirement or control identifier to relevant technical standards and implementation guidance.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `requirement_ref` | string | no* | Requirement reference (e.g., `CMMC:AC.L2-3.1.1`, `DFARS:252.204-7012`) |
| `control_id` | string | no* | Control identifier (e.g., `NIST-800-171:3.1.1`) |

*At least one parameter should be provided.

**Returns:** Matched standards with `standard_id`, `title`, `relevance_score`, `clause_refs`, and implementation notes.

---

### `search_domain_knowledge`

Full-text search across architecture patterns, threats, standards, data taxonomy, clauses, jurisdiction profiles, and expert playbooks with relevance scoring.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | **yes** | Search query text |
| `content_type` | string | no | Filter to content type: `all`, `architecture`, `threat`, `standard`, `data`, `clause`, `jurisdiction`, `playbook` |
| `limit` | number | no | Max results to return (max: 25) |

**Returns:** Ranked results array with `type`, `id`, `title`, `snippet`, and `relevance_score`.

---

### `build_control_baseline`

Build prioritized security control baseline for a defense organization profile.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `org_profile` | object | **yes** | Organization profile including `country`, `role`, `system_types`, `data_types`, and optional `cmmc_target_level` |

**Returns:** Prioritized control baseline with controls grouped by domain, priority tiers, and regulatory mapping.

---

### `build_evidence_plan`

Generate required evidence artifacts for a selected baseline and audit profile.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `baseline` | object | no | Baseline output from `build_control_baseline` |
| `audit_type` | string | no | Audit scope filter (e.g., `CMMC Level 2`, `DFARS 7012`, `ITAR`) |

**Returns:** Evidence plan with required artifacts, retention periods, responsible parties, and collection guidance.

---

### `assess_breach_obligations`

Determine notification obligations, deadlines, and required disclosure content for an incident context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `incident_description` | string | **yes** | Short incident summary |
| `jurisdictions` | string[] | **yes** | Impacted jurisdiction codes |
| `data_types` | string[] | **yes** | Impacted data category identifiers or plain-language labels |

**Returns:** Per-jurisdiction breach notification obligations with deadlines, notification targets, and required disclosure elements.

---

### `create_remediation_backlog`

Create prioritized remediation actions from current-state gaps against a target baseline.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `current_state` | object | **yes** | Current control posture or assessment findings |
| `target_baseline` | object | **yes** | Target control baseline (output from `build_control_baseline`) |

**Returns:** Prioritized remediation backlog with items ranked by risk, effort estimates, and regulatory obligation linkage.

---

## Defense-Specialized Tools

### `determine_cmmc_level`

Determine likely CMMC level, assessment route, practice count, and high-level gap areas for a contract context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `contract_description` | string | **yes** | Description of the DoD contract |
| `data_types` | string[] | **yes** | Data types handled (e.g., `CUI`, `FCI`) |
| `prime_or_sub` | string | **yes** | Role: `prime` or `sub` |
| `current_posture` | object | no | Current cybersecurity posture summary |

**Returns:** CMMC determination with `level`, `assessment_route`, `practice_count`, `domain_gaps`, `key_requirements`, and implementation guidance.

---

### `classify_export_control`

Perform ITAR/EAR-oriented export control classification guidance for an item and destination context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `item_description` | string | **yes** | Description of the item, technology, or service |
| `destination` | string | **yes** | Destination country or region |
| `technical_params` | string | no | Technical parameters relevant to classification |

**Returns:** Export control classification guidance with likely USML category or ECCN, jurisdiction-specific licensing requirements, red flags, and compliance steps. Note: this tool provides guidance only and is not a substitute for a formal commodity jurisdiction determination (CJD) or classification ruling.

---

### `assess_classified_environment`

Assess baseline accreditation, physical, technical, and personnel requirements for a classified processing context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `classification_level` | string | **yes** | Classification level (e.g., `SECRET`, `TOP SECRET`, `NATO CONFIDENTIAL`) |
| `country` | string | **yes** | ISO country code of the processing environment |
| `system_type` | string | **yes** | System type (e.g., `standalone`, `networked`, `cloud`) |

**Returns:** Requirements assessment with accreditation pathway, physical security requirements, technical controls, personnel requirements, and applicable standards.

---

### `assess_nato_interoperability`

Assess NATO interoperability security requirements for multi-nation information sharing scenarios.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `sharing_scope` | string | **yes** | Description of the information sharing scenario |
| `classification` | string | **yes** | NATO classification level (e.g., `NATO UNCLASSIFIED`, `NATO CONFIDENTIAL`) |
| `participating_nations` | string[] | **yes** | ISO country codes of participating nations |

**Returns:** Interoperability assessment with security requirements, STANAG references, nation-specific caveats, and technical integration requirements.
