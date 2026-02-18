"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { openDatabase } = require("../src/database");
const { makeTools, TOOL_DEFINITIONS } = require("../src/domain-service");
const { DefenseMcpServer } = require("../src/mcp-server");

function createServerHarness() {
  const dbPath = path.join(os.tmpdir(), `defense-mcp-protocol-${Date.now()}-${Math.random()}.db`);
  const { db, metadata } = openDatabase({ dbPath });
  const tools = makeTools(db, metadata);
  const server = new DefenseMcpServer({
    tools,
    toolDefinitions: TOOL_DEFINITIONS,
    metadata
  });

  return {
    db,
    dbPath,
    server,
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

test("initialize request returns MCP capabilities", async () => {
  const harness = createServerHarness();
  try {
    const response = await harness.server.handleJsonRpcPayload({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {}
    });

    assert.equal(response.result.serverInfo.name, "defense-aerospace-mcp");
    assert.ok(response.result.capabilities.tools);
  } finally {
    harness.cleanup();
  }
});

test("tools/list exposes universal and domain-specific tools", async () => {
  const harness = createServerHarness();
  try {
    const response = await harness.server.handleJsonRpcPayload({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    });

    const toolNames = response.result.tools.map((tool) => tool.name);
    assert.ok(toolNames.includes("about"));
    assert.ok(toolNames.includes("get_coverage_matrix"));
    assert.ok(toolNames.includes("get_expertise_scorecard"));
    assert.ok(toolNames.includes("list_expert_playbooks"));
    assert.ok(toolNames.includes("determine_cmmc_level"));
    assert.ok(toolNames.includes("classify_export_control"));
  } finally {
    harness.cleanup();
  }
});

test("tools/call wraps structured tool response", async () => {
  const harness = createServerHarness();
  try {
    const response = await harness.server.handleJsonRpcPayload({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "classify_export_control",
        arguments: {
          item_description: "missile guidance package",
          destination: "UK"
        }
      }
    });

    assert.ok(response.result.structuredContent);
    assert.equal(response.result.structuredContent.data.jurisdiction, "ITAR");
  } finally {
    harness.cleanup();
  }
});

test("unknown method returns JSON-RPC method not found", async () => {
  const harness = createServerHarness();
  try {
    const response = await harness.server.handleJsonRpcPayload({
      jsonrpc: "2.0",
      id: 4,
      method: "unknown/method",
      params: {}
    });

    assert.equal(response.error.code, -32601);
  } finally {
    harness.cleanup();
  }
});
