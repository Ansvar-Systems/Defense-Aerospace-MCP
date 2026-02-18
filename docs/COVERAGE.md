# Coverage and Completeness

This document tracks scope, completeness, and correctness for the Defense/Aerospace MCP knowledge base.

## Snapshot

- Dataset version: `1.2.0`
- Knowledge baseline date: `2026-02-18`
- Dataset last updated: `2026-02-18`
- Latest golden audit report: `2026-02-18T17:26:14.539Z` (`data/golden-standard-report.json`)
- Latest audit grade: `A` (`87` pass, `0` fail, `1` warning)

## Geographic Coverage Targets

| Scope | Coverage requirement | Expected | Covered | Missing | Status |
| --- | --- | ---: | ---: | ---: | --- |
| EU member states | Full | 27 | 27 | 0 | PASS |
| US state compatibility | Minimum + federal baseline | 51 | 51 | 0 | PASS |
| NATO member states | Focused | 32 | 32 | 0 | PASS |

## Jurisdiction Profile Inventory

- Total profiles: `90`
- EU region profiles: `28` (`EU` baseline + 27 member-state profiles)
- US region profiles: `52` (`US` baseline + 51 state profiles including DC)
- NATO region profiles: `10` (NATO baseline + focused NATO-country profiles where not fully represented by EU/US baselines)

## Domain Knowledge Coverage

| Knowledge set | Records |
| --- | ---: |
| Sources | 56 |
| Architecture patterns | 12 |
| Data categories | 12 |
| Threat scenarios | 13 |
| Technical standards | 45 |
| Applicability rules | 50 |
| Clause references | 46 |
| Evidence artifacts | 6 |
| Expert playbooks | 11 |

## Data Completeness by Jurisdiction

Coverage is measured across all `12` data categories.

| Jurisdiction scope | Completeness |
| --- | ---: |
| EU coverage in data taxonomy | 100% |
| US minimum data coverage | 100% |
| NATO member-state data coverage | 100% |
| Overall data completeness score | 100% |

## Correctness and Quality Assurance

The golden audit validates:

- Required authoritative source presence (CMMC/DFARS/NIST/ITAR/EAR/DoD/EU/NATO anchor sources)
- Citation coverage across all domain records
- Clause reference library integrity
- EU full coverage and US minimum coverage checks
- NATO coverage checks
- Core behavior scenarios (classification, applicability, CMMC, comparison, profile resolution)
- Protocol and response contract expectations

Current warning set:

- Advisory source present: NIST SP 800-172 Rev.3 FPD must remain non-binding in obligation logic.

## Tooling Coverage

Implemented tool surface: `26` tools total, including:

- Universal contract tools
- Coverage and expertise tools (`get_coverage_matrix`, `get_expertise_scorecard`)
- Clause-level expert retrieval (`list_clause_references`, `get_clause_reference`)
- Expert playbook retrieval (`list_expert_playbooks`, `get_expert_playbook`)
- Defense-specialized tools (`determine_cmmc_level`, `classify_export_control`, `assess_classified_environment`, `assess_nato_interoperability`)

## Maintaining Coverage Quality

Run the full pipeline before release:

```bash
npm run validate
```

Artifacts to review after each run:

- `data/golden-standard-report.json`
- `data/drift-hashes.json`
- `sources.yml`
