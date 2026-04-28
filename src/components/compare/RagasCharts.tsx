import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NormalizedExperiment, WinRegressionRow } from "@/lib/types";
import { buildRagasTrendData, buildDistribution, buildWinRegression, formatScore, formatDelta, deltaClass, formatMs, calcAvgOverall } from "@/lib/metrics";

const trendConfig: ChartConfig = {
 overallA: { label: "Overall A", color: "hsl(var(--chart-1))" },
 overallB: { label: "Overall B", color: "hsl(var(--chart-2))" },
 contextA: { label: "Context A", color: "hsl(var(--chart-1))" },
 contextB: { label: "Context B", color: "hsl(var(--chart-2))" },
 faithA: { label: "Faith A", color: "hsl(var(--chart-1))" },
 faithB: { label: "Faith B", color: "hsl(var(--chart-2))" },
 answerRelA: { label: "AnswerRel A", color: "hsl(var(--chart-1))" },
 answerRelB: { label: "AnswerRel B", color: "hsl(var(--chart-2))" },
};

const distConfig: ChartConfig = {
 countA: { label: "A (Baseline)", color: "hsl(var(--chart-1))" },
 countB: { label: "B (Hybrid)", color: "hsl(var(--chart-2))" },
};

interface Props {
 expA: NormalizedExperiment;
 expB: NormalizedExperiment;
}

type TrendMetric = "overall" | "context" | "faithfulness" | "answerRel";

export default function RagasCharts({ expA, expB }: Props) {
 const [trendMetric, setTrendMetric] = useState<TrendMetric>("overall");
 const trendData = buildRagasTrendData(expA, expB);
 const distData = buildDistribution(expA.records, expB.records, 0.2);
 const winRegData = buildWinRegression(expA, expB);

 // Mini KPIs
 const avgCtxA = mean(expA.records.map((r) => r.ragas?.contextRelevance ?? 0));
 const avgCtxB = mean(expB.records.map((r) => r.ragas?.contextRelevance ?? 0));
 const avgFaithA = mean(expA.records.map((r) => r.ragas?.faithfulness ?? 0));
 const avgFaithB = mean(expB.records.map((r) => r.ragas?.faithfulness ?? 0));
 const avgAnsA = mean(expA.records.map((r) => r.ragas?.answerRelevance ?? 0));
 const avgAnsB = mean(expB.records.map((r) => r.ragas?.answerRelevance ?? 0));
 const avgOverA = calcAvgOverall(expA.records);
 const avgOverB = calcAvgOverall(expB.records);

 // Data keys based on selected metric
 const keyA = trendMetric === "overall" ? "overallA" : trendMetric === "context" ? "contextA" : trendMetric === "faithfulness" ? "faithA" : "answerRelA";
 const keyB = trendMetric === "overall" ? "overallB" : trendMetric === "context" ? "contextB" : trendMetric === "faithfulness" ? "faithB" : "answerRelB";

 return (
  <div className="space-y-4">
   {/* Mini KPI row */}
   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <MiniKpi label="Context Relevance" a={avgCtxA} b={avgCtxB} />
    <MiniKpi label="Faithfulness" a={avgFaithA} b={avgFaithB} />
    <MiniKpi label="Answer Relevance" a={avgAnsA} b={avgAnsB} />
    <MiniKpi label="Overall Score" a={avgOverA} b={avgOverB} />
   </div>

   {/* Trend chart */}
   <Card>
    <CardHeader>
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
       <CardTitle className="text-base">RAGAS Trend</CardTitle>
       <CardDescription>Score per query — A vs B</CardDescription>
      </div>
      <Select value={trendMetric} onValueChange={(v) => setTrendMetric(v as TrendMetric)}>
       <SelectTrigger className="w-[180px]">
        <SelectValue />
       </SelectTrigger>
       <SelectContent>
        <SelectItem value="overall">Overall</SelectItem>
        <SelectItem value="context">Context Relevance</SelectItem>
        <SelectItem value="faithfulness">Faithfulness</SelectItem>
        <SelectItem value="answerRel">Answer Relevance</SelectItem>
       </SelectContent>
      </Select>
     </div>
    </CardHeader>
    <CardContent>
     <ChartContainer config={trendConfig} className="h-[265px] w-full">
      <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="index" fontSize={12} tickLine={false} axisLine={false} label={{ value: "query", position: "insideBottom", offset: -5 }} />

       <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 1]} label={{ value: "score", angle: -90, position: "insideLeft", offset: 0 }} />

       <ChartTooltip content={<ChartTooltipContent />} />
       <Area dataKey={keyA} type="monotone" fill={`var(--color-${keyA})`} fillOpacity={0.2} stroke={`var(--color-${keyA})`} strokeWidth={2} />
       <Area dataKey={keyB} type="monotone" fill={`var(--color-${keyB})`} fillOpacity={0.2} stroke={`var(--color-${keyB})`} strokeWidth={2} />
      </AreaChart>
     </ChartContainer>
    </CardContent>
   </Card>

   {/* Distribution histogram */}
   {/* <Card>
    <CardHeader>
     <CardTitle className="text-base">Overall Score Distribution</CardTitle>
     <CardDescription>Bucket histogram 0–1 (A vs B)</CardDescription>
    </CardHeader>
    <CardContent>
     <ChartContainer config={distConfig} className="h-[240px] w-full">
      <BarChart data={distData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="rangeLabel" fontSize={12} tickLine={false} axisLine={false} />

       <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
       <ChartTooltip content={<ChartTooltipContent />} />
       <Bar dataKey="countA" fill="var(--color-countA)" radius={[4, 4, 0, 0]} />
       <Bar dataKey="countB" fill="var(--color-countB)" radius={[4, 4, 0, 0]} />
      </BarChart>
     </ChartContainer>
    </CardContent>
   </Card> */}

   {/* Biggest Wins / Regressions table */}
   <Card>
    <CardHeader>
     <CardTitle className="text-base">Biggest Wins & Regressions</CardTitle>
     <CardDescription>Sorted by Δ overall score (B − A). Positive = win, Negative = regression.</CardDescription>
    </CardHeader>
    <CardContent>
     <WinRegressionTable rows={winRegData} />
    </CardContent>
   </Card>
  </div>
 );
}

// ---------- sub-components ----------

function MiniKpi({ label, a, b }: { label: string; a: number; b: number }) {
 const delta = b - a;
 return (
  <Card>
   <CardContent className="pt-4 space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="flex items-baseline gap-2">
     <span className="text-lg font-bold">{formatScore(b)}</span>
     <Badge variant="outline" className={`text-xs ${deltaClass(delta)}`}>
      {formatDelta(delta)}
     </Badge>
    </div>
    <p className="text-xs text-muted-foreground">A: {formatScore(a)}</p>
   </CardContent>
  </Card>
 );
}

function WinRegressionTable({ rows }: { rows: WinRegressionRow[] }) {
 if (rows.length === 0) {
  return <p className="text-sm text-muted-foreground text-center py-4">No data available.</p>;
 }

 return (
  <div className="max-h-[400px] overflow-auto">
   <Table>
    <TableHeader>
     <TableRow>
      <TableHead className="w-8">#</TableHead>
      <TableHead>Query</TableHead>
      <TableHead className="text-right">A</TableHead>
      <TableHead className="text-right">B</TableHead>
      <TableHead className="text-right">Δ</TableHead>
      <TableHead>Flags</TableHead>
     </TableRow>
    </TableHeader>
    <TableBody>
     {rows.map((row) => (
      <TableRow key={row.queryIndex}>
       <TableCell className="text-xs">{row.queryIndex + 1}</TableCell>
       <TableCell className="max-w-[200px] truncate text-xs">{row.query}</TableCell>
       <TableCell className="text-right text-xs">{row.overallA !== undefined ? formatScore(row.overallA) : "—"}</TableCell>
       <TableCell className="text-right text-xs">{row.overallB !== undefined ? formatScore(row.overallB) : "—"}</TableCell>
       <TableCell className={`text-right text-xs font-medium ${deltaClass(row.delta)}`}>{formatDelta(row.delta)}</TableCell>
       <TableCell>
        <div className="flex flex-wrap gap-1">
         {row.flags.map((f) => (
          <Badge key={f} variant="outline" className="text-[10px]">
           {f}
          </Badge>
         ))}
        </div>
       </TableCell>
      </TableRow>
     ))}
    </TableBody>
   </Table>
  </div>
 );
}

function mean(nums: number[]): number {
 if (nums.length === 0) return 0;
 return nums.reduce((a, b) => a + b, 0) / nums.length;
}
