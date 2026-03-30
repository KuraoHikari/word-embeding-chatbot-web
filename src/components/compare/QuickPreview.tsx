import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompareStore } from "@/store/compare.store";
import { formatMs, formatScore } from "@/lib/metrics";
import { BarChart3 } from "lucide-react";

export default function QuickPreview() {
 const slotA = useCompareStore((s) => s.slotA);
 const slotB = useCompareStore((s) => s.slotB);
 const summary = useCompareStore((s) => s.summary);
 const normalizedA = useCompareStore((s) => s.normalizedA);
 const normalizedB = useCompareStore((s) => s.normalizedB);

 const bothLoaded = slotA.status === "success" && slotB.status === "success";
 const anyLoading = slotA.status === "loading" || slotB.status === "loading";

 return (
  <Card>
   <CardHeader>
    <CardTitle className="flex items-center gap-2">
     <BarChart3 className="h-5 w-5" />
     Quick Snapshot
    </CardTitle>
   </CardHeader>
   <CardContent>
    {!bothLoaded && !anyLoading && <p className="text-sm text-muted-foreground text-center py-6">Upload both files to see preview.</p>}

    {anyLoading && (
     <div className="space-y-3">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-6 w-1/2" />
     </div>
    )}

    {bothLoaded && summary && (
     <div className="space-y-4">
      {/* Records */}
      <KpiRow label="Records" valueA={summary.recordsA.toString()} valueB={summary.recordsB.toString()} delta={summary.recordsA !== summary.recordsB ? "mismatch" : "match"} />

      {/* Avg latency */}
      <KpiRow label="Avg Latency" valueA={formatMs(summary.avgLatencyA)} valueB={formatMs(summary.avgLatencyB)} delta={formatDeltaMs(summary.avgLatencyB - summary.avgLatencyA)} invertColors />

      {/* Avg overall */}
      <KpiRow label="Avg Overall Score" valueA={formatScore(summary.avgOverallA)} valueB={formatScore(summary.avgOverallB)} delta={formatDeltaScore(summary.avgOverallB - summary.avgOverallA)} />

      {/* RAGAS availability */}
      <div className="flex items-center justify-between pt-2 border-t">
       <span className="text-sm font-medium">RAGAS</span>
       <div className="flex gap-2">
        <Badge variant={slotA.hasRagas ? "default" : "outline"}>A: {slotA.hasRagas ? "Available" : "Missing"}</Badge>
        <Badge variant={slotB.hasRagas ? "default" : "outline"}>B: {slotB.hasRagas ? "Available" : "Missing"}</Badge>
       </div>
      </div>

      <p className="text-xs text-muted-foreground pt-2 border-t">Proceed to Dashboard for charts, distributions, and query drilldowns.</p>
     </div>
    )}
   </CardContent>
  </Card>
 );
}

// ---------- mini KPI row ----------

function KpiRow({ label, valueA, valueB, delta, invertColors = false }: { label: string; valueA: string; valueB: string; delta: string; invertColors?: boolean }) {
 const isPositive = delta.startsWith("+") || delta === "match";
 const isNegative = delta.startsWith("-") || delta.startsWith("mismatch");

 // For latency, lower is better so invert color logic
 let colorClass = "text-muted-foreground";
 if (delta === "match") colorClass = "text-green-600";
 else if (delta === "mismatch") colorClass = "text-yellow-600";
 else if (invertColors) {
  colorClass = isNegative ? "text-green-600" : isPositive ? "text-red-600" : "text-muted-foreground";
 } else {
  colorClass = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-muted-foreground";
 }

 return (
  <div className="flex items-center justify-between">
   <span className="text-sm font-medium">{label}</span>
   <div className="flex items-center gap-3 text-sm">
    <span>A: {valueA}</span>
    <span>B: {valueB}</span>
    <Badge variant="outline" className={colorClass}>
     {delta}
    </Badge>
   </div>
  </div>
 );
}

// ---------- format helpers ----------

function formatDeltaMs(deltaMs: number): string {
 const pct = Math.abs(deltaMs) > 0 ? ((deltaMs / Math.max(1, Math.abs(deltaMs))) * 100).toFixed(0) : "0";
 if (deltaMs < -1) return `▼ ${Math.abs(deltaMs).toFixed(0)}ms`;
 if (deltaMs > 1) return `▲ ${deltaMs.toFixed(0)}ms`;
 return "≈ same";
}

function formatDeltaScore(delta: number): string {
 if (delta > 0.001) return `+${(delta * 100).toFixed(1)}%`;
 if (delta < -0.001) return `${(delta * 100).toFixed(1)}%`;
 return "≈ same";
}
