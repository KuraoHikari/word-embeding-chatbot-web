// ============================================================
// normalize.ts — Pure functions to transform raw JSON into
// NormalizedExperiment. No React dependency.
// ============================================================

import type { ModelType, NormalizedExperiment, NormalizedRecord, ParseResult, RetrievalSnippet } from "./types";

// --------------- helpers ---------------

/** Simple deterministic hash for fallback IDs */
function simpleHash(str: string): string {
 let hash = 0;
 for (let i = 0; i < str.length; i++) {
  const ch = str.charCodeAt(i);
  hash = (hash << 5) - hash + ch;
  hash |= 0; // 32-bit int
 }
 return Math.abs(hash).toString(36);
}

/** Safely extract an array of records from various wrapper shapes */
function extractRecordsArray(raw: unknown): unknown[] {
 if (Array.isArray(raw)) return raw;
 if (raw && typeof raw === "object") {
  const obj = raw as Record<string, unknown>;
  // Common wrappers: { results: [...] }, { responses: [...] }, { data: [...] }, { records: [...] }
  for (const key of ["results", "responses", "data", "records", "messages"]) {
   if (Array.isArray(obj[key])) return obj[key] as unknown[];
  }
 }
 return [];
}

/** Try to detect model type from raw JSON */
function detectModelType(raw: unknown): ModelType | undefined {
 const str = JSON.stringify(raw).toLowerCase();
 if (str.includes("fasttext_hybrid") || str.includes('"hybrid"')) return "hybrid";
 if (str.includes("fasttext_baseline") || str.includes('"baseline"')) return "baseline";
 return undefined;
}

// --------------- per-record normalizer (baseline) ---------------

function normalizeBaselineRecord(item: any, index: number): NormalizedRecord {
 const res = item?.results ?? item;
 const query: string = res?.query ?? item?.query ?? "";
 const id: string = item?.id?.toString() ?? `bl-${simpleHash(query + index)}`;

 // processing time: field is in seconds in the sample data
 const rawTime = res?.processing_time;
 const processingTimeMs = typeof rawTime === "number" ? rawTime * 1000 : undefined;

 // tokens
 const gen = res?.gpt_generation;
 const tokens = gen
  ? {
     prompt: gen.prompt_tokens as number | undefined,
     completion: gen.completion_tokens as number | undefined,
     total: gen.tokens_used as number | undefined,
    }
  : undefined;

 // answer
 const answerText: string | undefined = gen?.answer ?? item?.text;
 const answer = answerText ? { text: answerText } : undefined;

 // retrieval
 const rawResults: any[] = Array.isArray(res?.results) ? res.results : [];
 const scores = rawResults.map((r: any) => r?.similarity_score ?? r?.score).filter((s: any) => typeof s === "number") as number[];
 const topSnippets: RetrievalSnippet[] = rawResults.map((r: any) => ({
  rank: r?.rank ?? 0,
  text: r?.text,
  score: r?.similarity_score ?? r?.score,
  meta: {
   doc_index: r?.doc_index,
   method: r?.method,
  },
 }));
 const retrieval = {
  retrievedCount: rawResults.length,
  rerankedCount: undefined as number | undefined,
  scores,
  topSnippets,
 };

 // ragas
 const ragasRaw = res?.ragas_evaluation;
 const ragas = ragasRaw
  ? {
     contextRelevance: ragasRaw.context_relevance as number | undefined,
     faithfulness: ragasRaw.faithfulness as number | undefined,
     answerRelevance: ragasRaw.answer_relevance as number | undefined,
     overallScore: ragasRaw.overall_score as number | undefined,
    }
  : undefined;

 return {
  id,
  index,
  query,
  createdAt: item?.createdAt,
  processingTimeMs,
  tokens,
  answer,
  retrieval,
  ragas,
  raw: item,
 };
}

// --------------- per-record normalizer (hybrid) ---------------

function normalizeHybridRecord(item: any, index: number): NormalizedRecord {
 const res = item?.results ?? item;
 const query: string = res?.query ?? item?.query ?? "";
 const id: string = item?.id?.toString() ?? `hy-${simpleHash(query + index)}`;

 const rawTime = res?.processing_time;
 const processingTimeMs = typeof rawTime === "number" ? rawTime * 1000 : undefined;

 // tokens
 const gen = res?.gpt_generation;
 const tokens = gen
  ? {
     prompt: gen.prompt_tokens as number | undefined,
     completion: gen.completion_tokens as number | undefined,
     total: gen.tokens_used as number | undefined,
    }
  : undefined;

 // answer
 const answerText: string | undefined = gen?.answer ?? item?.text;
 const answer = answerText ? { text: answerText } : undefined;

 // retrieval – hybrid has search_pipeline + reranked counts
 const pipeline = res?.search_pipeline;
 const rawResults: any[] = Array.isArray(res?.results) ? res.results : [];
 const scores = rawResults.map((r: any) => r?.final_score ?? r?.similarity_score ?? r?.score).filter((s: any) => typeof s === "number") as number[];
 const topSnippets: RetrievalSnippet[] = rawResults.map((r: any) => ({
  rank: r?.rank ?? 0,
  text: r?.text,
  score: r?.detailed_scores?.fasttext_similarity ?? r?.similarity_score,
  meta: {
   doc_index: r?.doc_index,
   original_rank: r?.original_rank,
   diversity_penalty: r?.diversity_penalty,
   detailed_scores: r?.detailed_scores,
   context_range: r?.context_range,
  },
 }));

 const retrieval = {
  retrievedCount: pipeline?.hybrid_search_results ?? rawResults.length,
  rerankedCount: pipeline?.mmr_reranked_results as number | undefined,
  scores,
  topSnippets,
 };

 // ragas
 const ragasRaw = res?.ragas_evaluation;
 const ragas = ragasRaw
  ? {
     contextRelevance: ragasRaw.context_relevance as number | undefined,
     faithfulness: ragasRaw.faithfulness as number | undefined,
     answerRelevance: ragasRaw.answer_relevance as number | undefined,
     overallScore: ragasRaw.overall_score as number | undefined,
    }
  : undefined;

 return {
  id,
  index,
  query,
  createdAt: item?.createdAt,
  processingTimeMs,
  tokens,
  answer,
  retrieval,
  ragas,
  raw: item,
 };
}

// --------------- public API ---------------

export function normalizeBaseline(rawJson: unknown, fileName?: string): NormalizedExperiment {
 const arr = extractRecordsArray(rawJson);
 const records = arr.map((item, i) => normalizeBaselineRecord(item, i));
 return {
  modelType: "baseline",
  label: "FastText Baseline",
  sourceFileName: fileName,
  records,
 };
}

export function normalizeHybrid(rawJson: unknown, fileName?: string): NormalizedExperiment {
 const arr = extractRecordsArray(rawJson);
 const records = arr.map((item, i) => normalizeHybridRecord(item, i));
 return {
  modelType: "hybrid",
  label: "FastText Hybrid",
  sourceFileName: fileName,
  records,
 };
}

/**
 * Auto-detect model type and normalize accordingly.
 * Falls back to baseline if detection fails.
 */
export function autoNormalize(rawJson: unknown, fileName?: string): NormalizedExperiment {
 const type = detectModelType(rawJson);
 if (type === "hybrid") return normalizeHybrid(rawJson, fileName);
 return normalizeBaseline(rawJson, fileName);
}

/**
 * Parse a raw JSON string, validate, and normalize.
 * Returns ParseResult with success/error.
 */
export function parseAndNormalize(jsonString: string, slotHint: "A" | "B", fileName?: string): ParseResult {
 const warnings: string[] = [];

 // 1. Parse JSON
 let raw: unknown;
 try {
  raw = JSON.parse(jsonString);
 } catch {
  return { success: false, error: "Invalid JSON — could not parse the file." };
 }

 // 2. Extract records
 const arr = extractRecordsArray(raw);
 if (arr.length === 0) {
  return {
   success: false,
   error: "No records found. Expected a JSON array or an object with a `results` / `responses` / `data` key containing an array.",
  };
 }

 // 3. Detect model type
 const detectedType = detectModelType(raw);
 if (!detectedType) {
  warnings.push(`Could not auto-detect model type. Defaulting to ${slotHint === "A" ? "baseline" : "hybrid"}.`);
 }

 // If slot A → prefer baseline, slot B → prefer hybrid, but respect detected
 const modelType = detectedType ?? (slotHint === "A" ? "baseline" : "hybrid");

 const experiment = modelType === "hybrid" ? normalizeHybrid(raw, fileName) : normalizeBaseline(raw, fileName);

 // 4. Validate records have queries
 const missingQuery = experiment.records.filter((r) => !r.query).length;
 if (missingQuery > 0) {
  warnings.push(`${missingQuery} record(s) have no query text.`);
 }

 // 5. Check ragas availability
 const hasRagas = experiment.records.some((r) => r.ragas?.overallScore !== undefined);
 if (!hasRagas) {
  warnings.push("No RAGAS evaluation data found. RAGAS charts will be empty.");
 }

 return { success: true, experiment, warnings };
}
