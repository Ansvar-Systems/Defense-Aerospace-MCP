# Tools — Defense Aerospace MCP

This MCP exposes 26 tools across universal contract, coverage/expertise, clause retrieval, expert playbooks, and defense-specialized categories.

---

## Meta / Universal Tools

### `about`
Return server metadata, domain coverage, freshness, and known gaps for the Defense/Aerospace domain MCP.

_No required parameters._

---

### `check_data_freshness`
Check the freshness and staleness of the seeded domain knowledge base, reporting dataset version, last-updated date, knowledge baseline date, and whether any sources exceed a caller-specified maximum age threshold.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `max_age_days` | number (1–3650) | No | Maximum acceptable age in days. Returns a staleness flag when the dataset exceeds this threshold. |

---

## Source and Jurisdiction Tools

### `list_sources`
List authoritative sources used by this MCP with provenance, licensing, and refresh cadence.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source_type` | string | No | Filter by type: `standard`, `regulation`, `policy`, `threat-intel`. |
| `limit` | number (1–200) | No | Maximum entries to return (default: 50). |
| `offset` | number | No | Zero-based pagination offset. |

---

### `list_jurisdiction_profiles`
List jurisdiction intelligence profiles for EU full-coverage, US minimum-coverage, and NATO-focused mappings.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `region` | string | No | `EU`, `US`, or `NATO`. |
| `coverage_level` | string | No | `full`, `minimum`, or `focused`. |
| `jurisdiction` | string | No | Jurisdiction code filter (e.g. `US-CA`, `EU-DE`). |
| `country` | string | No | Country name filter. |
| `nato_member` | boolean | No | Filter to NATO member jurisdictions only. |
| `limit` | number (1–200) | No | Maximum entries to return. |
| `offset` | number | No | Zero-based pagination offset. |

---

### `get_jurisdiction_profile`
Resolve one jurisdiction profile (country/state/region) with baseline obligations, reporting model, and foundation MCP join hints.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `jurisdiction` | string | **Yes** | Jurisdiction code (e.g. `US-TX`, `EU-FR`, `NATO`). |
| `country` | string | No | Country name hint for disambiguation. |

---

### `compare_jurisdictions`
Compare obligations and implementation expectations by topic across requested jurisdictions.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `topic` | string | **Yes** | Compliance topic to compare (e.g. `incident reporting`, `export control`). |
| `jurisdictions` | string[] | No | List of jurisdiction codes to compare. |

---

## Coverage and Expertise Tools

### `get_coverage_matrix`
Return coverage completeness matrix for jurisdiction intelligence (EU member states, US state compatibility, and NATO member profiles).

_No required parameters._

---

### `get_expertise_scorecard`
Compute weighted expert-quality scorecard across jurisdiction coverage, data completeness, source quality, rule rigor, and tool-contract readiness.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `strict` | boolean | No | When true, enforce stricter minimum score and freshness checks. |
| `max_source_age_days` | number (30–1460) | No | Maximum acceptable age in days for authoritative source verification. |

---

## Expert Playbook Tools

### `list_expert_playbooks`
List expert defense/aerospace decision playbooks (CMMC, export control, NATO sharing, incident response, supply chain).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `topic` | string | No | Topic keyword filter. |
| `query` | string | No | Free-text search query. |
| `jurisdiction` | string | No | Jurisdiction code filter. |
| `country` | string | No | Country filter. |
| `data_type` | string | No | Data type filter. |
| `limit` | number (1–50) | No | Maximum entries to return. |

---

### `get_expert_playbook`
Retrieve one expert decision playbook by ID or scenario text, including steps, pitfalls, evidence outputs, and regulatory basis.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `playbook_id` | string | No | Playbook identifier. |
| `scenario` | string | No | Scenario description for fuzzy match. |
| `topic` | string | No | Topic hint. |

---

## Clause Reference Tools

### `list_clause_references`
List clause-level references and provision summaries for applicable regulations and frameworks.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `regulation_id` | string | No | Filter by regulation identifier (e.g. `CMMC`, `ITAR`, `NIS2`). |
| `jurisdiction_scope` | string | No | Jurisdiction scope filter. |
| `limit` | number (1–500) | No | Maximum entries to return. |
| `offset` | number | No | Zero-based pagination offset. |

---

### `get_clause_reference`
Retrieve a single clause/provision reference by clause ID or regulation + provision reference.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `clause_id` | string | No | Clause identifier. |
| `regulation_id` | string | No | Regulation identifier. |
| `provision_ref` | string | No | Provision reference (e.g. `Art. 23`). |

---

## Architecture Pattern Tools

### `list_architecture_patterns`
List available defense/aerospace architecture archetypes with optional category filtering.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `category` | string | No | Architecture category filter (e.g. `classified`, `mission`, `supply-chain`, `cloud`). |

---

### `get_architecture_pattern`
Return full architecture detail including components, trust boundaries, data flows, integration points, weaknesses, and standards.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pattern_id` | string | **Yes** | Architecture pattern identifier (e.g. `da-cui-environment`). |

---

## Domain Analysis Tools

### `classify_data`
Classify defense/aerospace data and return category mapping, protection tier, handling requirements, and applicable regulatory regimes.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `data_description` | string | **Yes** | Description of the data to classify. |
| `jurisdictions` | string[] | No | Jurisdiction codes for jurisdiction-specific handling rules. |

---

### `get_domain_threats`
Return defense threat scenarios mapped to MITRE ATT&CK, regulations, and control references for the provided architecture and data context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `architecture_pattern` | string | No | Architecture pattern identifier or description. |
| `data_types` | string[] | No | Data types in scope. |
| `deployment_context` | string | No | Deployment context description. |

---

### `assess_applicability`
Compute jurisdiction-aware obligation map (regulations and standards) based on organization profile and data/system context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `country` | string | **Yes** | Country or jurisdiction code. |
| `role` | string | No | Organizational role (e.g. `prime-contractor`, `subcontractor`). |
| `system_types` | string[] | No | System types in scope. |
| `data_types` | string[] | No | Data types handled. |
| `additional_context` | object | No | Additional context key/value pairs. |

---

### `map_to_technical_standards`
Map a requirement or control identifier to relevant technical standards and implementation guidance.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `requirement_ref` | string | No | Requirement reference (e.g. `CMMC AC.1.001`). |
| `control_id` | string | No | Control identifier (e.g. `NIST SP 800-171 3.1.1`). |

---

### `search_domain_knowledge`
Full-text search across architecture patterns, threats, standards, data taxonomy, clauses, jurisdiction profiles, and expert playbooks with relevance scoring.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | **Yes** | Search query. |
| `content_type` | string | No | Scope filter: `all`, `architecture`, `threat`, `standard`, `data`, `clause`, `jurisdiction`, `playbook`. |
| `limit` | number (1–25) | No | Maximum results to return. |

---

## Control and Remediation Tools

### `build_control_baseline`
Build prioritized security control baseline for a defense organization profile.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `org_profile` | object | **Yes** | Organization profile (role, data types, system types, jurisdictions, etc.). |

---

### `build_evidence_plan`
Generate required evidence artifacts for selected baseline and audit profile.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `baseline` | object | No | Control baseline object (from `build_control_baseline`). |
| `audit_type` | string | No | Audit type (e.g. `CMMC-L2`, `ISO27001`, `NIS2`). |

---

### `assess_breach_obligations`
Determine notification obligations, deadlines, and required disclosure content for incident context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `incident_description` | string | **Yes** | Description of the incident. |
| `jurisdictions` | string[] | **Yes** | Affected jurisdictions. |
| `data_types` | string[] | **Yes** | Data types involved. |

---

### `create_remediation_backlog`
Create prioritized remediation actions from current-state gaps against a target baseline.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `current_state` | object | **Yes** | Current control posture. |
| `target_baseline` | object | **Yes** | Target baseline to achieve. |

---

## Defense-Specialized Tools

### `determine_cmmc_level`
Determine likely CMMC level, assessment route, practice count, and high-level gap areas.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `contract_description` | string | **Yes** | Description of the contract or program. |
| `data_types` | string[] | **Yes** | Data types handled (e.g. `CUI`, `FCI`). |
| `prime_or_sub` | string | **Yes** | `prime` or `sub`. |
| `current_posture` | object | No | Current compliance posture. |

---

### `classify_export_control`
Perform ITAR/EAR-oriented export control classification guidance for an item and destination context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `item_description` | string | **Yes** | Description of the item, technology, or data. |
| `destination` | string | **Yes** | Destination country or region. |
| `technical_params` | string | No | Technical parameters relevant to classification (ECCN, USML category hints, etc.). |

---

### `assess_classified_environment`
Assess baseline accreditation, physical, technical, and personnel requirements for classified processing context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `classification_level` | string | **Yes** | Classification level (e.g. `SECRET`, `TOP SECRET`, `NATO CONFIDENTIAL`). |
| `country` | string | **Yes** | Country where processing occurs. |
| `system_type` | string | **Yes** | System type (e.g. `IS`, `network`, `standalone`). |

---

### `assess_nato_interoperability`
Assess NATO interoperability security requirements for multi-nation information sharing scenarios.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `sharing_scope` | string | **Yes** | Scope of the information sharing arrangement. |
| `classification` | string | **Yes** | Classification level of the shared information. |
| `participating_nations` | string[] | **Yes** | NATO member nation codes participating in the sharing arrangement. |
