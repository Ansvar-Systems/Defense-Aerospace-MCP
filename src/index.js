"use strict";

const path = require("node:path");
const { openDatabase } = require("./database");
const { makeTools, TOOL_DEFINITIONS } = require("./domain-service");
const { DefenseMcpServer } = require("./mcp-server");

function start(options = {}) {
  const dbPath = options.dbPath || path.join(process.cwd(), "data", "database.db");
  const httpPort = Number.parseInt(process.env.PORT || `${options.port || 3000}`, 10);
  const disableHttp = process.env.DISABLE_HTTP === "1" || Boolean(options.disableHttp);

  const { db, metadata } = openDatabase({ dbPath });
  const tools = makeTools(db, metadata);
  const server = new DefenseMcpServer({ tools, toolDefinitions: TOOL_DEFINITIONS, metadata });

  server.startStdio();
  if (!disableHttp) {
    server.startHttpServer(httpPort);
  }

  const shutdown = async () => {
    try {
      await server.stopHttpServer();
    } catch {
      // best effort shutdown
    }

    try {
      db.close();
    } catch {
      // ignore close errors during shutdown
    }
  };

  process.on("SIGINT", async () => {
    await shutdown();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await shutdown();
    process.exit(0);
  });

  return {
    server,
    db,
    metadata,
    disableHttp,
    shutdown
  };
}

if (require.main === module) {
  const runtime = start();
  const statusMessage = runtime.disableHttp
    ? "defense-aerospace-mcp listening: stdio transport active (HTTP disabled)"
    : `defense-aerospace-mcp listening: http://localhost:${process.env.PORT || 3000}/mcp and stdio transport active`;
  process.stderr.write(`${statusMessage}\n`);

  process.on("exit", () => {
    try {
      runtime.db.close();
    } catch {
      // ignore
    }
  });
}

module.exports = {
  start
};
