# Changelog

All notable changes to this project are documented in this file.

## [1.2.0] - 2026-02-18

### Added
- `server.json` MCP registry metadata.
- Published stdio CLI entrypoint `bin/defense-aerospace-mcp.js`.
- Source freshness checker script: `scripts/quality/check-source-updates.js`.
- Golden fixture files: `fixtures/golden-tests.json` and `fixtures/golden-hashes.json`.
- CI/CD and security workflows under `.github/workflows/` (CodeQL, Semgrep, Trivy, Gitleaks, Socket, OSSF Scorecard, CI, publish, source updates).

### Changed
- Switched SQLite journal mode from `WAL` to `DELETE` for serverless compatibility.
- Added health-state grading (`ok` / `stale` / `degraded`) on `/health`.
- Added MCP `notifications/cancelled` no-op handling.
- Added pagination metadata to `list_sources`, `list_jurisdiction_profiles`, and `list_clause_references`.
- Aligned runtime input validation with required schema fields for high-impact tools.
- Corrected `nist-800-171a-r3` effective date to `2024-05-14`.

### Fixed
- Resolved `search_domain_knowledge` SQL failure for `content_type: "all"` by correcting FTS field mapping.
