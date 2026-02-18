"use strict";

const fs = require("node:fs");
const path = require("node:path");
const seed = require("../../src/data/seed");

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function parseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function ageDays(dateValue, referenceDateValue) {
  const date = parseDate(dateValue);
  const ref = parseDate(referenceDateValue);
  if (!date || !ref) {
    return null;
  }
  return Math.floor((ref.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
}

async function probeSource(source, timeoutMs) {
  const options = {
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs)
  };

  let response = await fetch(source.source_url, {
    ...options,
    method: "HEAD"
  });

  if (response.status === 405) {
    response = await fetch(source.source_url, {
      ...options,
      method: "GET"
    });
  }

  return {
    status: response.status,
    ok: response.ok,
    final_url: response.url,
    etag: response.headers.get("etag"),
    last_modified: response.headers.get("last-modified"),
    cache_control: response.headers.get("cache-control")
  };
}

(async () => {
  const offlineMode = process.env.SOURCE_CHECK_OFFLINE === "1";
  const strictMode = process.env.STRICT_SOURCE_CHECK === "1";
  const timeoutMs = toPositiveInt(process.env.SOURCE_CHECK_TIMEOUT_MS, 12000);
  const maxAgeDays = toPositiveInt(process.env.MAX_SOURCE_AGE_DAYS, 365);
  const baselineDate = seed.KNOWLEDGE_BASELINE?.baseline_date || seed.LAST_UPDATED;

  const entries = [];
  const unreachable = [];
  const stale = [];

  for (const source of seed.sources || []) {
    const sourceAgeDays = ageDays(source.last_verified, baselineDate);
    const isStale = sourceAgeDays === null || sourceAgeDays > maxAgeDays;
    if (isStale) {
      stale.push({
        id: source.id,
        last_verified: source.last_verified,
        age_days: sourceAgeDays
      });
    }

    if (offlineMode) {
      entries.push({
        id: source.id,
        source_url: source.source_url,
        mode: "offline",
        reachable: null,
        status: null,
        final_url: null,
        etag: null,
        last_modified: null,
        error: null,
        source_age_days: sourceAgeDays
      });
      continue;
    }

    try {
      const result = await probeSource(source, timeoutMs);
      entries.push({
        id: source.id,
        source_url: source.source_url,
        mode: "online",
        reachable: result.ok,
        status: result.status,
        final_url: result.final_url,
        etag: result.etag,
        last_modified: result.last_modified,
        cache_control: result.cache_control,
        error: null,
        source_age_days: sourceAgeDays
      });
      if (!result.ok) {
        unreachable.push({
          id: source.id,
          source_url: source.source_url,
          status: result.status
        });
      }
    } catch (error) {
      entries.push({
        id: source.id,
        source_url: source.source_url,
        mode: "online",
        reachable: false,
        status: null,
        final_url: null,
        etag: null,
        last_modified: null,
        cache_control: null,
        error: error.message,
        source_age_days: sourceAgeDays
      });
      unreachable.push({
        id: source.id,
        source_url: source.source_url,
        status: null,
        error: error.message
      });
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    dataset_version: seed.DATASET_VERSION,
    baseline_date: baselineDate,
    offline_mode: offlineMode,
    strict_mode: strictMode,
    max_source_age_days: maxAgeDays,
    timeout_ms: timeoutMs,
    summary: {
      source_count: entries.length,
      checked_online: entries.filter((entry) => entry.mode === "online").length,
      reachable_count: entries.filter((entry) => entry.reachable === true).length,
      unreachable_count: unreachable.length,
      stale_count: stale.length
    },
    unreachable,
    stale,
    entries
  };

  const outPath = path.join(process.cwd(), "data", "source-updates-report.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  process.stdout.write(`Wrote source updates report: ${outPath}\n`);

  if (strictMode && (unreachable.length > 0 || stale.length > 0)) {
    process.exitCode = 1;
  }
})();
