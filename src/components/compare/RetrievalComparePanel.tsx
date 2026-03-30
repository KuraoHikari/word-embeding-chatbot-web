import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NormalizedExperiment, NormalizedRecord } from "@/lib/types";
import { buildRetrievalChartData } from "@/lib/metrics";
import { useCompareStore } from "@/store/compare.store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch } from "lucide-react";

const chartConfig: ChartConfig = {
 retrievedA: { label: "Retrieved A", color: "hsl(var(--chart-1))" },
 retrievedB: { label: "Retrieved B", color: "hsl(var(--chart-2))" },
 rerankedB: { label: "Reranked B", color: "hsl(var(--chart-4))" },
};

interface Props {
 expA: NormalizedExperiment;
 expB: NormalizedExperiment;
}

export default function RetrievalComparePanel({ expA, expB }: Props) {
 const selectedQueryIndex = useCompareStore((s) => s.selectedQueryIndex);
 const selectQuery = useCompareStore((s) => s.selectQuery);
 const chartData = buildRetrievalChartData(expA, expB);

 const maxLen = Math.max(expA.records.length, expB.records.length);
 const selectedA = selectedQueryIndex !== null ? expA.records[selectedQueryIndex] : null;
 const selectedB = selectedQueryIndex !== null ? expB.records[selectedQueryIndex] : null;

 // Compute mini KPIs
 const avgRetrievedA = mean(expA.records.map((r) => r.retrieval?.retrievedCount ?? 0));
 const avgRetrievedB = mean(expB.records.map((r) => r.retrieval?.retrievedCount ?? 0));
 const avgRerankedB = mean(expB.records.map((r) => r.retrieval?.rerankedCount ?? 0));

 return (
  <div className="space-y-4">
   {/* Mini KPI row */}
   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <MiniKPI label="Avg Retrieved (A)" value={avgRetrievedA.toFixed(1)} />
    <MiniKPI label="Avg Retrieved (B)" value={avgRetrievedB.toFixed(1)} />
    <MiniKPI label="Avg Reranked (B)" value={avgRerankedB.toFixed(1)} />
    <MiniKPI label="Similarity Threshold" value={expB.records[0]?.raw?.results?.search_pipeline?.similarity_threshold?.toString() ?? "N/A"} />
   </div>

   {/* Docs count chart */}
   <Card>
    <CardHeader>
     <CardTitle className="text-base">Docs Count Over Queries</CardTitle>
     <CardDescription>Retrieved and reranked document counts per query</CardDescription>
    </CardHeader>
    <CardContent>
     <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="index" fontSize={12} tickLine={false} axisLine={false} />
       <YAxis fontSize={12} tickLine={false} axisLine={false} />
       <ChartTooltip content={<ChartTooltipContent />} />
       <Area dataKey="retrievedA" type="monotone" fill="var(--color-retrievedA)" fillOpacity={0.2} stroke="var(--color-retrievedA)" strokeWidth={2} />
       <Area dataKey="retrievedB" type="monotone" fill="var(--color-retrievedB)" fillOpacity={0.2} stroke="var(--color-retrievedB)" strokeWidth={2} />
       <Area dataKey="rerankedB" type="monotone" fill="var(--color-rerankedB)" fillOpacity={0.2} stroke="var(--color-rerankedB)" strokeWidth={2} strokeDasharray="5 5" />
      </AreaChart>
     </ChartContainer>
    </CardContent>
   </Card>

   {/* Top snippets compare */}
   <Card>
    <CardHeader>
     <CardTitle className="text-base flex items-center gap-2">
      <FileSearch className="h-4 w-4" />
      Top Snippets Comparison
     </CardTitle>
     <CardDescription>Select a query to compare retrieval snippets</CardDescription>
     <div className="pt-2">
      <Select value={selectedQueryIndex?.toString() ?? ""} onValueChange={(v) => selectQuery(v ? Number(v) : null)}>
       <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a query..." />
       </SelectTrigger>
       <SelectContent>
        {Array.from({ length: maxLen }).map((_, i) => {
         const q = expA.records[i]?.query ?? expB.records[i]?.query ?? `#${i + 1}`;
         return (
          <SelectItem key={i} value={i.toString()}>
           #{i + 1} — {q.slice(0, 60)}
          </SelectItem>
         );
        })}
       </SelectContent>
      </Select>
     </div>
    </CardHeader>
    <CardContent>
     {selectedQueryIndex === null ? (
      <p className="text-sm text-muted-foreground text-center py-6">Select a query from the dropdown above or the Queries tab.</p>
     ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <SnippetColumn label="A — Baseline" record={selectedA} />
       <SnippetColumn label="B — Hybrid" record={selectedB} />
      </div>
     )}
    </CardContent>
   </Card>
  </div>
 );
}

// ---------- sub-components ----------

function MiniKPI({ label, value }: { label: string; value: string }) {
 return (
  <Card>
   <CardContent className="pt-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-xl font-bold">{value}</p>
   </CardContent>
  </Card>
 );
}

function SnippetColumn({ label, record }: { label: string; record: NormalizedRecord | null }) {
 if (!record) {
  return (
   <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4">
    <p className="text-sm font-medium mb-2">{label}</p>
    <p className="text-sm text-yellow-600">Record not available for this query.</p>
   </div>
  );
 }

 const snippets = record.retrieval?.topSnippets ?? [];

 return (
  <div className="rounded-lg border p-4 space-y-3">
   <p className="text-sm font-medium">{label}</p>
   {snippets.length === 0 ? (
    <p className="text-sm text-muted-foreground">No retrieval snippets.</p>
   ) : (
    <ScrollArea className="max-h-[300px]">
     <div className="space-y-2">
      {snippets.map((s, i) => (
       <div key={i} className="rounded bg-muted/50 p-2 text-xs space-y-1">
        <div className="flex items-center gap-2">
         <Badge variant="outline" className="text-xs">
          Rank {s.rank}
         </Badge>
         {s.score !== undefined && (
          <Badge variant="secondary" className="text-xs">
           Score: {s.score.toFixed(4)}
          </Badge>
         )}
        </div>
        <p className="line-clamp-3 text-muted-foreground">{s.text ?? "No text"}</p>
       </div>
      ))}
     </div>
    </ScrollArea>
   )}
  </div>
 );
}

function mean(nums: number[]): number {
 if (nums.length === 0) return 0;
 return nums.reduce((a, b) => a + b, 0) / nums.length;
}
