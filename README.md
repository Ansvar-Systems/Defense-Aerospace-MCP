# Defense / Aerospace MCP

Defense/Aerospace domain intelligence MCP implementing the shared domain tool contract from `domain-mcp-specifications.md`.


### Public Endpoint (Streamable HTTP)

Connect from any MCP client (Claude Desktop, ChatGPT, Cursor, VS Code, GitHub Copilot):

```
https://mcp.ansvar.eu/defense-aerospace/mcp
```

**Claude Code:**
```bash
claude mcp add defense-aerospace --transport http https://mcp.ansvar.eu/defense-aerospace/mcp
```

**Claude Desktop / Cursor** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "defense-aerospace": {
      "type": "url",
      "url": "https://mcp.ansvar.eu/defense-aerospace/mcp"
    }
  }
}
```

No authentication required. See [all Ansvar MCP endpoints](https://github.com/Ansvar-Systems/Ansvar-Architecture-Documentation/blob/main/docs/mcp-remote-access.md).
## What this server provides

- Dual transport:
  - `stdio` JSON-RPC transport
  - HTTP transport on `POST /mcp`
- Health endpoint: `GET /health`
- SQLite + FTS5 knowledge base for:
  - Architecture patterns
  - Data taxonomy categories
  - Threat scenarios
  - Technical standards crosswalks
  - Applicability rules
  - Evidence artifacts
  - Source provenance registry
- Jurisdiction coverage guarantees:
  - Full EU member-state coverage (EU-27) for data classification and applicability routing
  - US baseline and `US-*` state-scoped compatibility for minimum obligation mapping
- Universal domain tools + defense-specific tools
- Structured responses with metadata envelope:
  - Citations
  - Effective date
  - Confidence
  - Inference rationale
  - Dataset version/fingerprint
  - Foundation MCP call hints
  - Applicability precedence model (ranked obligations, conflict groups, clause references)

## Quick start

Prerequisite: Node.js `>=25.0.0`

```bash
npm install
npm start
```

Server starts with:

- HTTP: `http://localhost:3000/mcp`
- Health: `http://localhost:3000/health`
- Stdio: active in-process

Set custom port:

```bash
PORT=8080 npm start
```

Run as stdio-only MCP (for local clients such as Claude Desktop/Cursor):

```bash
npx @ansvar/defense-aerospace-mcp
```

## Tool coverage

Universal tools:

- `about`
- `list_sources`
- `list_jurisdiction_profiles`
- `get_jurisdiction_profile`
- `get_coverage_matrix`
- `get_expertise_scorecard`
- `list_expert_playbooks`
- `get_expert_playbook`
- `list_clause_references`
- `get_clause_reference`
- `list_architecture_patterns`
- `get_architecture_pattern`
- `classify_data`
- `get_domain_threats`
- `assess_applicability`
- `map_to_technical_standards`
- `search_domain_knowledge`
- `compare_jurisdictions`
- `build_control_baseline`
- `build_evidence_plan`
- `assess_breach_obligations`
- `create_remediation_backlog`

Defense-specific tools:

- `determine_cmmc_level`
- `classify_export_control`
- `assess_classified_environment`
- `assess_nato_interoperability`

Expertise additions:

- Jurisdiction intelligence layer with explicit EU-27 full coverage profiles
- US minimum coverage profiles (federal + `US-*` state compatibility)
- NATO-focused member profile coverage for alliance handling contexts
- Applicability responses now include resolved jurisdiction profile context
- Deterministic expertise scorecard with strict-mode hard fail thresholds
- Curated expert decision playbooks for export control, CMMC, NATO sharing, incident response, and supply-chain workflows
- Expanded standards corpus for defense/aerospace engineering assurance (DFARS 7019/7020, NIST 800-161r1, NIST 800-218, NIST 800-37r2, NIST 800-61r3, EASA Part-IS, NATO STANAG 4586/4609/5516/4671, ECSS-E-ST-40C, ECSS-Q-ST-80C, NASA NPR 7150.2, MIL-STD-810, MIL-STD-461, MIL-HDBK-516, AS9100D, AS9110C, DO-355, DO-178C, DO-254, ARP4754A, ARP4761A)

## Testing

```bash
npm test
```

The test suite validates representative scenarios from the Defense/Aerospace sampling section, including:

- ITAR/EAR data classification behavior
- CMMC level determination
- Threat lookup and mappings
- Applicability obligations and jurisdiction comparisons
- NATO/classified environment assessments
- Out-of-scope redirects to other domain MCPs

## Golden standard quality gates

Run the full quality pipeline:

```bash
npm run validate
```

This runs:

- `sources:sync`: regenerates `sources.yml` from the in-code source registry
- `drift:hashes`: writes `data/drift-hashes.json` for deterministic drift detection
- `test`: executes protocol + domain behavior tests
- `audit:golden`: runs a production-style quality audit and writes `data/golden-standard-report.json`

Optional freshness check:

```bash
npm run check:source-updates
```

- Writes `data/source-updates-report.json`
- Use `STRICT_SOURCE_CHECK=1` to fail on stale/unreachable sources

The golden audit enforces:

- Required authoritative source presence (CMMC rule, DFARS CMMC subpart, NIST rev3 publications, ITAR/EAR, DoD issuances)
- Citation coverage across domain records
- Core scenario correctness (classification, applicability, CMMC determination, jurisdiction comparison)
- Structured response contract expectations
- EU-27 completeness checks and US minimum coverage checks

## Coverage document

See `docs/COVERAGE.md` for auditable scope and completeness details across EU, US, and NATO coverage targets.

## Safety and scope

This repository intentionally stores only unclassified/public framework guidance.

- No classified content
- No CUI payloads
- No ITAR technical detail records

Use outputs as structured compliance/threat-modeling guidance and route authoritative legal/regulatory text retrieval to foundation MCPs.

## Release metadata

- MCP registry metadata: `server.json`
- Source provenance export: `sources.yml`
- Change history: `CHANGELOG.md`
