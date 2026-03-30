// ============================================================
// Compare Results — Internal Types
// ============================================================

export type ModelType = "baseline" | "hybrid";

export interface NormalizedExperiment {
 modelType: ModelType;
 label: string; // "FastText Baseline" / "FastText Hybrid"
 sourceFileName?: string;
 records: NormalizedRecord[];
}

export interface NormalizedRecord {
 id: string; // stable id: recordId if available, fallback hash(query+index)
 index: number; // sequential order
 query: string;
 createdAt?: string;
 processingTimeMs?: number;

 tokens?: {
  prompt?: number;
  completion?: number;
  total?: number;
 };

 answer?: {
  text?: string;
 };

 retrieval?: {
  retrievedCount?: number;
  rerankedCount?: number;
  scores?: number[]; // similarity / final scores
  topSnippets?: RetrievalSnippet[];
 };

 ragas?: {
  contextRelevance?: number;
  faithfulness?: number;
  answerRelevance?: number;
  overallScore?: number;
 };

 raw?: any; // original record for debug / schema view
}

export interface RetrievalSnippet {
 rank: number;
 text?: string;
 score?: number;
 meta?: Record<string, any>;
}

// ============================================================
// Filters
// ============================================================

export interface CompareFilters {
 keyword?: string;
 minOverallScore?: number;
 latencyThresholdMs?: number;
}

// ============================================================
// Summary Metrics (computed for KPI cards + tables)
// ============================================================

export interface SummaryMetrics {
 recordsA: number;
 recordsB: number;
 avgLatencyA: number;
 avgLatencyB: number;
 p95LatencyA: number;
 p95LatencyB: number;
 avgOverallA: number;
 avgOverallB: number;
 failureRateA: number;
 failureRateB: number;
 avgTokensA: number;
 avgTokensB: number;
}

// ============================================================
// Win / Regression Row (per matched query)
// ============================================================

export interface WinRegressionRow {
 queryIndex: number;
 query: string;
 overallA?: number;
 overallB?: number;
 delta: number; // B - A (positive = win, negative = regression)
 latencyA?: number;
 latencyB?: number;
 flags: WinRegressionFlag[];
}

export type WinRegressionFlag = "high-latency" | "missing-ragas-a" | "missing-ragas-b" | "empty-answer-a" | "empty-answer-b";

// ============================================================
// Distribution bucket (for histogram)
// ============================================================

export interface DistributionBucket {
 rangeLabel: string; // e.g. "0.0–0.2"
 min: number;
 max: number;
 countA: number;
 countB: number;
}

// ============================================================
// Parsing result wrapper
// ============================================================

export interface ParseResult {
 success: boolean;
 experiment?: NormalizedExperiment;
 error?: string;
 warnings?: string[];
}

// ============================================================
// Upload slot state
// ============================================================

export type UploadSlotStatus = "empty" | "loading" | "success" | "error";

export interface UploadSlot {
 status: UploadSlotStatus;
 fileName?: string;
 recordCount?: number;
 hasRagas?: boolean;
 modelType?: ModelType;
 error?: string;
}
