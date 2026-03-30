import { useState, useMemo } from "react";
import { Search, ArrowUpDown, AlertCircle, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NormalizedExperiment, NormalizedRecord } from "@/lib/types";
import { buildWinRegression, formatMs, formatScore, formatDelta, deltaClass } from "@/lib/metrics";
import { useCompareStore } from "@/store/compare.store";

interface Props {
 expA: NormalizedExperiment;
 expB: NormalizedExperiment;
}

type SortMode = "delta-desc" | "delta-asc" | "latency-desc" | "index-asc";
type FilterMode = "all" | "wins" | "regressions" | "high-latency" | "missing-ragas";

export default function QueryDrilldown({ expA, expB }: Props) {
 const selectedQueryIndex = useCompareStore((s) => s.selectedQueryIndex);
 const selectQuery = useCompareStore((s) => s.selectQuery);

 const [search, setSearch] = useState("");
 const [sortMode, setSortMode] = useState<SortMode>("index-asc");
 const [filterMode, setFilterMode] = useState<FilterMode>("all");

 const winReg = useMemo(() => buildWinRegression(expA, expB), [expA, expB]);

 const filtered = useMemo(() => {
  let result = [...winReg];

  // search
  if (search.trim()) {
   const q = search.toLowerCase();
   result = result.filter((r) => r.query.toLowerCase().includes(q));
  }

  // filter
  if (filterMode === "wins") result = result.filter((r) => r.delta > 0.01);
  if (filterMode === "regressions") result = result.filter((r) => r.delta < -0.01);
  if (filterMode === "high-latency") result = result.filter((r) => r.flags.includes("high-latency"));
  if (filterMode === "missing-ragas") result = result.filter((r) => r.flags.includes("missing-ragas-a") || r.flags.includes("missing-ragas-b"));

  // sort
  if (sortMode === "delta-desc") result.sort((a, b) => b.delta - a.delta);
  if (sortMode === "delta-asc") result.sort((a, b) => a.delta - b.delta);
  if (sortMode === "latency-desc") result.sort((a, b) => (b.latencyB ?? 0) - (a.latencyB ?? 0));
  if (sortMode === "index-asc") result.sort((a, b) => a.queryIndex - b.queryIndex);

  return result;
 }, [winReg, search, filterMode, sortMode]);

 const selectedA = selectedQueryIndex !== null ? (expA.records[selectedQueryIndex] ?? null) : null;
 const selectedB = selectedQueryIndex !== null ? (expB.records[selectedQueryIndex] ?? null) : null;

 return (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[500px]">
   {/* Left list panel */}
   <div className="lg:col-span-4 space-y-3">
    {/* Search */}
    <div className="relative">
     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
     <Input className="pl-9" placeholder="Search queries..." value={search} onChange={(e) => setSearch(e.target.value)} />
    </div>

    {/* Filters + sort */}
    <div className="flex gap-2">
     <Select value={filterMode} onValueChange={(v) => setFilterMode(v as FilterMode)}>
      <SelectTrigger className="flex-1">
       <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
       <SelectItem value="all">All</SelectItem>
       <SelectItem value="wins">Wins only</SelectItem>
       <SelectItem value="regressions">Regressions</SelectItem>
       <SelectItem value="high-latency">High latency</SelectItem>
       <SelectItem value="missing-ragas">Missing RAGAS</SelectItem>
      </SelectContent>
     </Select>
     <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
      <SelectTrigger className="flex-1">
       <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
       <SelectItem value="index-asc">Index ↑</SelectItem>
       <SelectItem value="delta-desc">Δ Desc</SelectItem>
       <SelectItem value="delta-asc">Δ Asc</SelectItem>
       <SelectItem value="latency-desc">Latency Desc</SelectItem>
      </SelectContent>
     </Select>
    </div>

    {/* Query list */}
    <ScrollArea className="h-[420px] rounded-md border">
     <div className="p-1">
      {filtered.length === 0 ? (
       <p className="text-sm text-muted-foreground text-center py-6">No queries match your filters.</p>
      ) : (
       filtered.map((row) => (
        <button
         key={row.queryIndex}
         onClick={() => selectQuery(row.queryIndex)}
         className={`w-full text-left p-2 rounded-md text-sm hover:bg-accent transition-colors ${selectedQueryIndex === row.queryIndex ? "bg-accent border border-primary/20" : ""}`}
        >
         <div className="flex items-center justify-between">
          <span className="font-medium truncate max-w-[70%]">
           #{row.queryIndex + 1} {row.query.slice(0, 40)}
          </span>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${deltaClass(row.delta)}`}>
           {formatDelta(row.delta)}
          </Badge>
         </div>
         {row.latencyB !== undefined && <span className="text-[10px] text-muted-foreground">B: {formatMs(row.latencyB)}</span>}
        </button>
       ))
      )}
     </div>
    </ScrollArea>
   </div>

   {/* Right detail panel */}
   <div className="lg:col-span-8">
    {selectedQueryIndex === null ? (
     <Card className="h-full flex items-center justify-center">
      <CardContent className="text-center py-12">
       <ArrowUpDown className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
       <p className="text-sm text-muted-foreground">Select a query from the list to see side-by-side comparison.</p>
      </CardContent>
     </Card>
    ) : (
     <QueryDetailPanel index={selectedQueryIndex} recordA={selectedA} recordB={selectedB} />
    )}
   </div>
  </div>
 );
}

// ---------- Detail panel ----------

function QueryDetailPanel({ index, recordA, recordB }: { index: number; recordA: NormalizedRecord | null; recordB: NormalizedRecord | null }) {
 const query = recordA?.query ?? recordB?.query ?? `Query #${index + 1}`;

 return (
  <Card>
   <CardHeader>
    <CardTitle className="text-base">
     #{index + 1} — {query}
    </CardTitle>
    <div className="text-xs text-muted-foreground">
     {recordA?.createdAt && <span>A: {recordA.createdAt} | </span>}
     {recordB?.createdAt && <span>B: {recordB.createdAt}</span>}
    </div>
   </CardHeader>
   <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     <RecordColumn label="A — Baseline" record={recordA} />
     <RecordColumn label="B — Hybrid" record={recordB} />
    </div>
   </CardContent>
  </Card>
 );
}

function RecordColumn({ label, record }: { label: string; record: NormalizedRecord | null }) {
 if (!record) {
  return (
   <div className="rounded-lg border border-dashed border-yellow-400 p-4">
    <p className="text-sm font-medium mb-2">{label}</p>
    <div className="flex items-center gap-2 text-yellow-600">
     <AlertCircle className="h-4 w-4" />
     <span className="text-sm">Record not available for this query.</span>
    </div>
   </div>
  );
 }

 return (
  <div className="rounded-lg border p-4 space-y-3">
   <p className="text-sm font-bold">{label}</p>

   {/* Answer */}
   <div>
    <p className="text-xs font-medium text-muted-foreground mb-1">Answer</p>
    <p className="text-sm bg-muted/50 rounded p-2 line-clamp-4">{record.answer?.text ?? <span className="text-yellow-600 italic">No answer</span>}</p>
   </div>

   {/* Tokens */}
   <div className="flex flex-wrap gap-2">
    {record.tokens?.prompt !== undefined && (
     <Badge variant="secondary" className="text-xs">
      Prompt: {record.tokens.prompt}
     </Badge>
    )}
    {record.tokens?.completion !== undefined && (
     <Badge variant="secondary" className="text-xs">
      Completion: {record.tokens.completion}
     </Badge>
    )}
    {record.tokens?.total !== undefined && (
     <Badge variant="outline" className="text-xs">
      Total: {record.tokens.total}
     </Badge>
    )}
   </div>

   {/* Latency */}
   {record.processingTimeMs !== undefined && (
    <div>
     <p className="text-xs text-muted-foreground">Latency: {formatMs(record.processingTimeMs)}</p>
    </div>
   )}

   <Separator />

   {/* RAGAS */}
   <div>
    <p className="text-xs font-medium text-muted-foreground mb-1">RAGAS</p>
    {record.ragas ? (
     <div className="grid grid-cols-2 gap-1 text-xs">
      <span>Context: {record.ragas.contextRelevance?.toFixed(3) ?? "—"}</span>
      <span>Faith: {record.ragas.faithfulness?.toFixed(3) ?? "—"}</span>
      <span>AnswerRel: {record.ragas.answerRelevance?.toFixed(3) ?? "—"}</span>
      <span className="font-medium">Overall: {record.ragas.overallScore?.toFixed(3) ?? "—"}</span>
     </div>
    ) : (
     <p className="text-xs text-yellow-600">RAGAS data missing</p>
    )}
   </div>

   <Separator />

   {/* Retrieval preview */}
   <div>
    <p className="text-xs font-medium text-muted-foreground mb-1">
     Retrieval ({record.retrieval?.retrievedCount ?? 0} docs
     {record.retrieval?.rerankedCount ? ` → ${record.retrieval.rerankedCount} reranked` : ""})
    </p>
    {(record.retrieval?.topSnippets ?? []).slice(0, 2).map((s, i) => (
     <div key={i} className="text-[11px] bg-muted/40 rounded p-1.5 mb-1">
      <span className="font-medium">#{s.rank}</span> <span className="text-muted-foreground">({s.score?.toFixed(4) ?? "—"})</span>
      <p className="line-clamp-2 text-muted-foreground">{s.text?.slice(0, 120)}</p>
     </div>
    ))}
   </div>
  </div>
 );
}
