import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { SummaryMetrics } from "@/lib/types";
import { formatMs, formatPercent, formatScore } from "@/lib/metrics";
import { Activity, Clock, TrendingUp, AlertTriangle } from "lucide-react";

interface Props {
 summary: SummaryMetrics | null;
}

export default function KPIGrid({ summary }: Props) {
 if (!summary) {
  return (
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
     <Card key={i}>
      <CardHeader className="pb-2">
       <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
       <Skeleton className="h-8 w-full" />
      </CardContent>
     </Card>
    ))}
   </div>
  );
 }

 const latencyDelta = summary.avgLatencyB - summary.avgLatencyA;
 const latencyPct = summary.avgLatencyA > 0 ? ((latencyDelta / summary.avgLatencyA) * 100).toFixed(0) : "0";

 const overallDelta = summary.avgOverallB - summary.avgOverallA;
 const overallPct = (overallDelta * 100).toFixed(1);

 return (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
   {/* Records */}
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Records</CardTitle>
     <Activity className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold">A: {summary.recordsA}</span>
      <span className="text-2xl font-bold">B: {summary.recordsB}</span>
     </div>
     <p className="text-xs text-muted-foreground mt-1">{summary.recordsA === summary.recordsB ? "Coverage OK" : "Record count mismatch"}</p>
    </CardContent>
   </Card>

   {/* Avg Latency */}
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
     <Clock className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold">{formatMs(summary.avgLatencyB)}</span>
      <Badge variant="outline" className={latencyDelta < 0 ? "text-green-600 border-green-300" : latencyDelta > 0 ? "text-red-600 border-red-300" : ""}>
       {latencyDelta < 0 ? "▼" : latencyDelta > 0 ? "▲" : "≈"} {Math.abs(Number(latencyPct))}%
      </Badge>
     </div>
     <p className="text-xs text-muted-foreground mt-1">
      A: {formatMs(summary.avgLatencyA)} | p95 A: {formatMs(summary.p95LatencyA)} | p95 B: {formatMs(summary.p95LatencyB)}
     </p>
    </CardContent>
   </Card>

   {/* Avg RAGAS Overall */}
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Avg RAGAS Overall</CardTitle>
     <TrendingUp className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold">{formatScore(summary.avgOverallB)}</span>
      <Badge variant="outline" className={overallDelta > 0.01 ? "text-green-600 border-green-300" : overallDelta < -0.01 ? "text-red-600 border-red-300" : ""}>
       {overallDelta > 0 ? "▲" : overallDelta < 0 ? "▼" : "≈"} {Math.abs(Number(overallPct))}%
      </Badge>
     </div>
     <p className="text-xs text-muted-foreground mt-1">A: {formatScore(summary.avgOverallA)}</p>
    </CardContent>
   </Card>

   {/* Failure Rate */}
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
     <AlertTriangle className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold">A: {formatPercent(summary.failureRateA)}</span>
      <span className="text-2xl font-bold">B: {formatPercent(summary.failureRateB)}</span>
     </div>
     <p className="text-xs text-muted-foreground mt-1">Missing RAGAS or score below threshold</p>
    </CardContent>
   </Card>
  </div>
 );
}
