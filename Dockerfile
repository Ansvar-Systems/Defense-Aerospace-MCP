# =============================================================================
# Defense / Aerospace MCP — multi-stage Dockerfile
# =============================================================================
# Build:  docker build -t defense-aerospace-mcp .
# Run:    docker run --rm -p 3000:3000 defense-aerospace-mcp
#
# The image bakes /app/data/database.db at build time so the MCP boots against
# the curated production dataset without a bind mount or runtime seed pass.
# =============================================================================

# --- Stage 1: Install dependencies ---
FROM node:24-alpine AS builder

WORKDIR /app

# defense-aerospace-mcp currently has zero runtime npm deps (uses node:sqlite
# built-in). Keep the multi-stage shape for parity with the wider sector-MCP
# fleet — future deps that *do* require a native build will land in the
# builder stage and ship a clean tree to the runtime stage. `mkdir node_modules`
# guarantees the directory exists for the runtime-stage COPY even when
# `npm ci` resolves to a no-op.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts \
 && npm rebuild \
 && npm cache clean --force \
 && mkdir -p /app/node_modules

# --- Stage 2: Production ---
FROM node:24-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Pull the resolved node_modules tree from the builder stage.
COPY --from=builder /app/node_modules ./node_modules

# Application code.
COPY src/ ./src/
COPY bin/ ./bin/
COPY package.json ./
COPY sources.yml server.json ./

# Bake the pre-built database into the image so /app/data/database.db
# resolves at runtime without a bind mount. The explicit `data/database.db`
# reference is required — `.github/workflows/ghcr-build.yml` greps the
# Dockerfile with `COPY\s+\K(data/\S+\.db)` to decide whether to download
# the gitignored DB from a GitHub Release. A directory-form `COPY data/`
# would be skipped by that regex and the DB would never reach the image.
COPY data/database.db data/database.db

# Non-root user for security.
RUN chown -R node:node /app
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "--experimental-sqlite", "src/index.js"]
