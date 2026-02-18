"use strict";

const http = require("node:http");
const { ToolInputError } = require("./domain-service");

const JSON_RPC_VERSION = "2.0";

class JsonRpcError extends Error {
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

function encodeJsonRpcMessage(message) {
  const body = JSON.stringify(message);
  const length = Buffer.byteLength(body, "utf8");
  return `Content-Length: ${length}\r\n\r\n${body}`;
}

function toJsonRpcSuccess(id, result) {
  return {
    jsonrpc: JSON_RPC_VERSION,
    id,
    result
  };
}

function toJsonRpcError(id, error) {
  return {
    jsonrpc: JSON_RPC_VERSION,
    id,
    error: {
      code: error.code || -32000,
      message: error.message || "Server error",
      data: error.data
    }
  };
}

class DefenseMcpServer {
  constructor({ tools, toolDefinitions, metadata }) {
    this.tools = tools;
    this.toolDefinitions = toolDefinitions;
    this.metadata = metadata;
    this.httpServer = null;
  }

  async executeTool(name, args) {
    const tool = this.tools[name];
    if (!tool) {
      throw new JsonRpcError(-32601, `Unknown tool: ${name}`);
    }

    try {
      return await tool(args || {});
    } catch (error) {
      if (error instanceof ToolInputError) {
        throw new JsonRpcError(-32602, error.message, error.details);
      }
      throw error;
    }
  }

  async handleRequest(request) {
    if (!request || request.jsonrpc !== JSON_RPC_VERSION || typeof request.method !== "string") {
      throw new JsonRpcError(-32600, "Invalid JSON-RPC request");
    }

    const method = request.method;

    if (method === "initialize") {
      return {
        protocolVersion: "2025-06-18",
        capabilities: {
          tools: {
            listChanged: false
          }
        },
        serverInfo: {
          name: "defense-aerospace-mcp",
          version: "1.2.0"
        }
      };
    }

    if (method === "notifications/initialized" || method === "notifications/cancelled") {
      return null;
    }

    if (method === "ping") {
      return { pong: true };
    }

    if (method === "tools/list") {
      return {
        tools: this.toolDefinitions
      };
    }

    if (method === "tools/call") {
      const params = request.params || {};
      if (!params.name) {
        throw new JsonRpcError(-32602, "tools/call requires params.name");
      }

      const response = await this.executeTool(params.name, params.arguments || {});
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2)
          }
        ],
        structuredContent: response
      };
    }

    throw new JsonRpcError(-32601, `Method not found: ${method}`);
  }

  async handleJsonRpcPayload(payload) {
    if (Array.isArray(payload)) {
      if (payload.length === 0) {
        return [toJsonRpcError(null, new JsonRpcError(-32600, "Invalid request batch"))];
      }
      const responses = [];
      for (const request of payload) {
        const response = await this.handleSingleJsonRpcRequest(request);
        if (response) {
          responses.push(response);
        }
      }
      return responses.length > 0 ? responses : null;
    }

    return this.handleSingleJsonRpcRequest(payload);
  }

  async handleSingleJsonRpcRequest(request) {
    const id = Object.prototype.hasOwnProperty.call(request || {}, "id") ? request.id : null;
    const isNotification = id === null || id === undefined;

    try {
      const result = await this.handleRequest(request);
      if (isNotification) {
        return null;
      }
      return toJsonRpcSuccess(id, result);
    } catch (error) {
      const rpcError =
        error instanceof JsonRpcError
          ? error
          : new JsonRpcError(-32000, error.message || "Internal server error");
      if (isNotification) {
        return null;
      }
      return toJsonRpcError(id, rpcError);
    }
  }

  startStdio() {
    let buffer = Buffer.alloc(0);

    process.stdin.on("data", async (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      await this.processStdioBuffer(() => {
        return buffer;
      }, (nextBuffer) => {
        buffer = nextBuffer;
      });
    });

    process.stdin.on("error", (error) => {
      process.stderr.write(`stdio error: ${error.message}\n`);
    });
  }

  async processStdioBuffer(getBuffer, setBuffer) {
    let working = getBuffer();

    while (true) {
      const headerEnd = working.indexOf("\r\n\r\n");
      if (headerEnd < 0) {
        break;
      }

      const headerText = working.slice(0, headerEnd).toString("utf8");
      const contentLengthMatch = /content-length:\s*(\d+)/i.exec(headerText);
      if (!contentLengthMatch) {
        working = working.slice(headerEnd + 4);
        continue;
      }

      const contentLength = Number.parseInt(contentLengthMatch[1], 10);
      const messageStart = headerEnd + 4;
      const messageEnd = messageStart + contentLength;
      if (working.length < messageEnd) {
        break;
      }

      const body = working.slice(messageStart, messageEnd).toString("utf8");
      working = working.slice(messageEnd);

      let payload;
      try {
        payload = JSON.parse(body);
      } catch {
        const errorResponse = toJsonRpcError(null, new JsonRpcError(-32700, "Parse error"));
        process.stdout.write(encodeJsonRpcMessage(errorResponse));
        continue;
      }

      const response = await this.handleJsonRpcPayload(payload);
      if (response) {
        process.stdout.write(encodeJsonRpcMessage(response));
      }
    }

    setBuffer(working);
  }

  startHttpServer(port) {
    this.httpServer = http.createServer(async (req, res) => {
      if (!req.url) {
        res.writeHead(404).end();
        return;
      }

      if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "ok",
            domain: "defense-aerospace",
            dataset_version: this.metadata.dataset_version,
            dataset_fingerprint: this.metadata.dataset_fingerprint,
            last_updated: this.metadata.last_updated
          })
        );
        return;
      }

      if (req.method !== "POST" || req.url !== "/mcp") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
        return;
      }

      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        let payload;
        try {
          payload = JSON.parse(body || "{}");
        } catch {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify(toJsonRpcError(null, new JsonRpcError(-32700, "Parse error"))));
          return;
        }

        const response = await this.handleJsonRpcPayload(payload);
        if (!response) {
          res.writeHead(204).end();
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      });

      req.on("error", (error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      });
    });

    this.httpServer.on("error", (error) => {
      process.stderr.write(`http transport error: ${error.message}\n`);
    });

    this.httpServer.listen(port);
    return this.httpServer;
  }

  stopHttpServer() {
    if (!this.httpServer) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.httpServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

module.exports = {
  DefenseMcpServer,
  JSON_RPC_VERSION,
  JsonRpcError,
  toJsonRpcSuccess,
  toJsonRpcError
};
