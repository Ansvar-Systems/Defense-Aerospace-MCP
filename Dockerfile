# node:24-alpine — pinned digest 2026-04-08
# TODO: CVE-2026-27171 (zlib, medium) — patch (zlib 1.3.2-r0) not yet available in this image.
# Update digest when a node:24-alpine build ships with zlib >=1.3.2-r0.
FROM node:24-alpine@sha256:01743339035a5c3c11a373cd7c83aeab6ed1457b55da6a69e014a95ac4e4700b
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY src/ ./src/
COPY bin/ ./bin/
COPY data/ ./data/
RUN chown -R nodejs:nodejs /app
USER nodejs
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
CMD ["node", "--experimental-sqlite", "src/index.js"]
