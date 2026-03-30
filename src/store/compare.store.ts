// ============================================================
// compare.store.ts — Zustand store for the Compare Results feature
// ============================================================

import { create } from "zustand";
import type { CompareFilters, NormalizedExperiment, SummaryMetrics, UploadSlot } from "@/lib/types";
import { parseAndNormalize } from "@/lib/normalize";
import { buildSummaryMetrics } from "@/lib/metrics";

// -------------------- state shape --------------------

interface CompareState {
 // raw JSON (kept for Schema & Logs tab)
 rawA: unknown | null;
 rawB: unknown | null;

 // normalized experiments
 normalizedA: NormalizedExperiment | null;
 normalizedB: NormalizedExperiment | null;

 // upload slot UI state
 slotA: UploadSlot;
 slotB: UploadSlot;

 // summary metrics (recomputed on data change / filter change)
 summary: SummaryMetrics | null;

 // filters
 filters: CompareFilters;

 // drilldown
 selectedQueryIndex: number | null;

 // chatbot context
 chatbotId: string | null;

 // ---- actions ----
 loadFile: (slot: "A" | "B", jsonString: string, fileName: string) => void;
 removeSlot: (slot: "A" | "B") => void;
 setFilters: (filters: Partial<CompareFilters>) => void;
 selectQuery: (index: number | null) => void;
 setChatbotId: (id: string | null) => void;
 reset: () => void;
}

const emptySlot: UploadSlot = { status: "empty" };

const initialState = {
 rawA: null,
 rawB: null,
 normalizedA: null,
 normalizedB: null,
 slotA: { ...emptySlot },
 slotB: { ...emptySlot },
 summary: null,
 filters: {},
 selectedQueryIndex: null,
 chatbotId: null,
};

// -------------------- helpers --------------------

function computeSummary(a: NormalizedExperiment | null, b: NormalizedExperiment | null, filters: CompareFilters): SummaryMetrics | null {
 if (!a || !b) return null;
 return buildSummaryMetrics(a, b, filters);
}

// -------------------- store --------------------

export const useCompareStore = create<CompareState>()((set, get) => ({
 ...initialState,

 loadFile: (slot, jsonString, fileName) => {
  // mark loading
  const slotKey = slot === "A" ? "slotA" : "slotB";
  set({ [slotKey]: { status: "loading" as const, fileName } });

  const result = parseAndNormalize(jsonString, slot, fileName);

  if (!result.success || !result.experiment) {
   set({
    [slotKey]: {
     status: "error" as const,
     fileName,
     error: result.error ?? "Unknown error",
    },
   });
   return;
  }

  const exp = result.experiment;
  const hasRagas = exp.records.some((r) => r.ragas?.overallScore !== undefined);

  const newSlot: UploadSlot = {
   status: "success",
   fileName,
   recordCount: exp.records.length,
   hasRagas,
   modelType: exp.modelType,
  };

  const rawKey = slot === "A" ? "rawA" : "rawB";
  const normalizedKey = slot === "A" ? "normalizedA" : "normalizedB";

  set((state) => {
   const next: any = {
    [rawKey]: jsonString,
    [normalizedKey]: exp,
    [slotKey]: newSlot,
   };

   // Recompute summary if both sides available
   const otherNormalized = slot === "A" ? state.normalizedB : state.normalizedA;
   const a = slot === "A" ? exp : state.normalizedA;
   const b = slot === "B" ? exp : state.normalizedB;

   if (a && b) {
    next.summary = computeSummary(a, b, state.filters);
   }

   return next;
  });
 },

 removeSlot: (slot) => {
  const slotKey = slot === "A" ? "slotA" : "slotB";
  const rawKey = slot === "A" ? "rawA" : "rawB";
  const normalizedKey = slot === "A" ? "normalizedA" : "normalizedB";
  set({
   [rawKey]: null,
   [normalizedKey]: null,
   [slotKey]: { ...emptySlot },
   summary: null,
  });
 },

 setFilters: (partial) => {
  set((state) => {
   const filters = { ...state.filters, ...partial };
   const summary = computeSummary(state.normalizedA, state.normalizedB, filters);
   return { filters, summary };
  });
 },

 selectQuery: (index) => set({ selectedQueryIndex: index }),

 setChatbotId: (id) => set({ chatbotId: id }),

 reset: () => set({ ...initialState, slotA: { ...emptySlot }, slotB: { ...emptySlot } }),
}));
