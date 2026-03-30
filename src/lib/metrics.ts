// ============================================================
// metrics.ts — Pure functions for computing comparison metrics.
// No React / Zustand dependency.
// ============================================================

import type { CompareFilters, DistributionBucket, NormalizedExperiment, NormalizedRecord, SummaryMetrics, WinRegressionFlag, WinRegressionRow } from "./types";

// ===================== helpers =====================

function validNumbers(vals: (number | undefined)[]): number[] {
 return vals.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
}

function mean(nums: number[]): number {
 if (nums.length === 0) return 0;
 return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function percentile(sorted: number[], p: number): number {
 if (sorted.length === 0) return 0;
 const idx = Math.ceil((p / 100) * sorted.length) - 1;
 return sorted[Math.max(0, idx)];
}

// ===================== individual metric fns =====================

export function calcAvgLatency(records: NormalizedRecord[]): number {
 const vals = validNumbers(records.map((r) => r.processingTimeMs));
 return mean(vals);
}

export function calcP95Latency(records: NormalizedRecord[]): number {
 const vals = validNumbers(records.map((r) => r.processingTimeMs));
 vals.sort((a, b) => a - b);
 return percentile(vals, 95);
}

export function calcAvgOverall(records: NormalizedRecord[]): number {
 const vals = validNumbers(records.map((r) => r.ragas?.overallScore));
 return mean(vals);
}

export function calcAvgTokens(records: NormalizedRecord[]): number {
 const vals = validNumbers(records.map((r) => r.tokens?.total));
 return mean(vals);
}

/**
 * Failure is defined as:
 *  - missing ragas.overallScore, OR
 *  - overallScore < minOverallScore threshold, OR
 *  - empty answer (optional, enabled by flag)
 */
export function calcFailureRate(records: NormalizedRecord[], opts: { minOverallScore?: number; countEmptyAnswer?: boolean } = {}): number {
 if (records.length === 0) return 0;

 const threshold = opts.minOverallScore ?? 0;
 let failures = 0;

 for (const r of records) {
  const score = r.ragas?.overallScore;
  const isMissing = score === undefined || score === null;
  const isBelowThreshold = typeof score === "number" && score < threshold;
  const isEmptyAnswer = opts.countEmptyAnswer === true && (!r.answer?.text || r.answer.text.trim().length === 0);

  if (isMissing || isBelowThreshold || isEmptyAnswer) {
   failures++;
  }
 }

 return failures / records.length;
}

// ===================== summary builder =====================

export function buildSummaryMetrics(expA: NormalizedExperiment, expB: NormalizedExperiment, filters?: CompareFilters): SummaryMetrics {
 const rA = applyFilters(expA.records, filters);
 const rB = applyFilters(expB.records, filters);

 return {
  recordsA: rA.length,
  recordsB: rB.length,
  avgLatencyA: calcAvgLatency(rA),
  avgLatencyB: calcAvgLatency(rB),
  p95LatencyA: calcP95Latency(rA),
  p95LatencyB: calcP95Latency(rB),
  avgOverallA: calcAvgOverall(rA),
  avgOverallB: calcAvgOverall(rB),
  failureRateA: calcFailureRate(rA, {
   minOverallScore: filters?.minOverallScore,
  }),
  failureRateB: calcFailureRate(rB, {
   minOverallScore: filters?.minOverallScore,
  }),
  avgTokensA: calcAvgTokens(rA),
  avgTokensB: calcAvgTokens(rB),
 };
}

// ===================== win / regression =====================

/**
 * Match records between A and B by index and compute overallScore delta.
 * Returns rows sorted by delta descending (biggest wins first).
 */
export function buildWinRegression(expA: NormalizedExperiment, expB: NormalizedExperiment): WinRegressionRow[] {
 const maxLen = Math.max(expA.records.length, expB.records.length);
 const rows: WinRegressionRow[] = [];

 for (let i = 0; i < maxLen; i++) {
  const a = expA.records[i];
  const b = expB.records[i];
  const query = a?.query ?? b?.query ?? `Query #${i}`;
  const overallA = a?.ragas?.overallScore;
  const overallB = b?.ragas?.overallScore;
  const delta = (overallB ?? 0) - (overallA ?? 0);

  const flags: WinRegressionFlag[] = [];

  // high latency flag (> 3000ms)
  if ((a?.processingTimeMs ?? 0) > 3000) flags.push("high-latency");
  if ((b?.processingTimeMs ?? 0) > 3000) flags.push("high-latency");

  if (a && a.ragas?.overallScore === undefined) flags.push("missing-ragas-a");
  if (b && b.ragas?.overallScore === undefined) flags.push("missing-ragas-b");
  if (a && (!a.answer?.text || a.answer.text.trim().length === 0)) flags.push("empty-answer-a");
  if (b && (!b.answer?.text || b.answer.text.trim().length === 0)) flags.push("empty-answer-b");

  rows.push({
   queryIndex: i,
   query,
   overallA,
   overallB,
   delta,
   latencyA: a?.processingTimeMs,
   latencyB: b?.processingTimeMs,
   flags: [...new Set(flags)], // dedupe
  });
 }

 rows.sort((a, b) => b.delta - a.delta);
 return rows;
}

// ===================== distribution histogram =====================

export function buildDistribution(recordsA: NormalizedRecord[], recordsB: NormalizedRecord[], bucketSize: number = 0.2): DistributionBucket[] {
 const buckets: DistributionBucket[] = [];
 const steps = Math.ceil(1 / bucketSize);

 for (let i = 0; i < steps; i++) {
  const min = +(i * bucketSize).toFixed(2);
  const max = +((i + 1) * bucketSize).toFixed(2);
  buckets.push({
   rangeLabel: `${min.toFixed(1)}–${max.toFixed(1)}`,
   min,
   max,
   countA: 0,
   countB: 0,
  });
 }

 const place = (score: number | undefined, side: "A" | "B") => {
  if (score === undefined) return;
  for (const b of buckets) {
   if (score >= b.min && score < b.max) {
    side === "A" ? b.countA++ : b.countB++;
    return;
   }
  }
  // edge case: score === 1.0 → last bucket
  if (score === 1) {
   const last = buckets[buckets.length - 1];
   side === "A" ? last.countA++ : last.countB++;
  }
 };

 for (const r of recordsA) place(r.ragas?.overallScore, "A");
 for (const r of recordsB) place(r.ragas?.overallScore, "B");

 return buckets;
}

// ===================== filters =====================

export function applyFilters(records: NormalizedRecord[], filters?: CompareFilters): NormalizedRecord[] {
 if (!filters) return records;
 let result = records;

 if (filters.keyword && filters.keyword.trim().length > 0) {
  const kw = filters.keyword.toLowerCase();
  result = result.filter((r) => r.query.toLowerCase().includes(kw) || (r.answer?.text ?? "").toLowerCase().includes(kw));
 }

 if (typeof filters.minOverallScore === "number") {
  result = result.filter((r) => {
   const s = r.ragas?.overallScore;
   return s !== undefined && s >= filters.minOverallScore!;
  });
 }

 if (typeof filters.latencyThresholdMs === "number") {
  result = result.filter((r) => {
   const t = r.processingTimeMs;
   return t !== undefined && t <= filters.latencyThresholdMs!;
  });
 }

 return result;
}

// ===================== chart data helpers =====================

/** Build data points for latency area chart (A vs B per query index) */
export function buildLatencyChartData(expA: NormalizedExperiment, expB: NormalizedExperiment) {
 const maxLen = Math.max(expA.records.length, expB.records.length);
 const data: { index: number; query: string; latencyA: number; latencyB: number }[] = [];
 for (let i = 0; i < maxLen; i++) {
  const a = expA.records[i];
  const b = expB.records[i];
  data.push({
   index: i + 1,
   query: a?.query ?? b?.query ?? `#${i + 1}`,
   latencyA: a?.processingTimeMs ?? 0,
   latencyB: b?.processingTimeMs ?? 0,
  });
 }
 return data;
}

/** Build data points for token usage chart */
export function buildTokenChartData(expA: NormalizedExperiment, expB: NormalizedExperiment) {
 const maxLen = Math.max(expA.records.length, expB.records.length);
 const data: {
  index: number;
  query: string;
  promptA: number;
  completionA: number;
  promptB: number;
  completionB: number;
 }[] = [];
 for (let i = 0; i < maxLen; i++) {
  const a = expA.records[i];
  const b = expB.records[i];
  data.push({
   index: i + 1,
   query: a?.query ?? b?.query ?? `#${i + 1}`,
   promptA: a?.tokens?.prompt ?? 0,
   completionA: a?.tokens?.completion ?? 0,
   promptB: b?.tokens?.prompt ?? 0,
   completionB: b?.tokens?.completion ?? 0,
  });
 }
 return data;
}

/** Build data points for retrieval count chart */
export function buildRetrievalChartData(expA: NormalizedExperiment, expB: NormalizedExperiment) {
 const maxLen = Math.max(expA.records.length, expB.records.length);
 const data: {
  index: number;
  query: string;
  retrievedA: number;
  retrievedB: number;
  rerankedB: number;
 }[] = [];
 for (let i = 0; i < maxLen; i++) {
  const a = expA.records[i];
  const b = expB.records[i];
  data.push({
   index: i + 1,
   query: a?.query ?? b?.query ?? `#${i + 1}`,
   retrievedA: a?.retrieval?.retrievedCount ?? 0,
   retrievedB: b?.retrieval?.retrievedCount ?? 0,
   rerankedB: b?.retrieval?.rerankedCount ?? 0,
  });
 }
 return data;
}

/** Build data points for RAGAS overall trend */
export function buildRagasTrendData(expA: NormalizedExperiment, expB: NormalizedExperiment) {
 const maxLen = Math.max(expA.records.length, expB.records.length);
 const data: {
  index: number;
  query: string;
  overallA: number;
  overallB: number;
  contextA: number;
  contextB: number;
  faithA: number;
  faithB: number;
  answerRelA: number;
  answerRelB: number;
 }[] = [];
 for (let i = 0; i < maxLen; i++) {
  const a = expA.records[i];
  const b = expB.records[i];
  data.push({
   index: i + 1,
   query: a?.query ?? b?.query ?? `#${i + 1}`,
   overallA: a?.ragas?.overallScore ?? 0,
   overallB: b?.ragas?.overallScore ?? 0,
   contextA: a?.ragas?.contextRelevance ?? 0,
   contextB: b?.ragas?.contextRelevance ?? 0,
   faithA: a?.ragas?.faithfulness ?? 0,
   faithB: b?.ragas?.faithfulness ?? 0,
   answerRelA: a?.ragas?.answerRelevance ?? 0,
   answerRelB: b?.ragas?.answerRelevance ?? 0,
  });
 }
 return data;
}

// ===================== formatting helpers =====================

export function formatMs(ms: number): string {
 if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
 return `${ms.toFixed(0)}ms`;
}

export function formatPercent(rate: number): string {
 return `${(rate * 100).toFixed(1)}%`;
}

export function formatScore(score: number): string {
 return score.toFixed(3);
}

export function formatDelta(delta: number): string {
 const prefix = delta >= 0 ? "+" : "";
 return `${prefix}${(delta * 100).toFixed(1)}%`;
}

export function deltaClass(delta: number): string {
 if (delta > 0.01) return "text-green-600";
 if (delta < -0.01) return "text-red-600";
 return "text-muted-foreground";
}
