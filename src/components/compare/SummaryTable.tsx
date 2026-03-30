import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SummaryMetrics } from "@/lib/types";
import { formatMs, formatPercent, formatScore, formatDelta, deltaClass } from "@/lib/metrics";

interface Props {
 summary: SummaryMetrics | null;
}

interface MetricRow {
 label: string;
 valueA: string;
 valueB: string;
 delta: string;
 deltaNum: number;
 invertDelta?: boolean;
}

export default function SummaryTable({ summary }: Props) {
 if (!summary) {
  return (
   <Card>
    <CardHeader>
     <CardTitle className="text-base">Summary Metrics</CardTitle>
    </CardHeader>
    <CardContent>
     <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
       <Skeleton key={i} className="h-8 w-full" />
      ))}
     </div>
    </CardContent>
   </Card>
  );
 }

 const rows: MetricRow[] = [
  {
   label: "Avg Latency",
   valueA: formatMs(summary.avgLatencyA),
   valueB: formatMs(summary.avgLatencyB),
   delta: formatMs(Math.abs(summary.avgLatencyB - summary.avgLatencyA)),
   deltaNum: summary.avgLatencyB - summary.avgLatencyA,
   invertDelta: true, // lower is better
  },
  {
   label: "P95 Latency",
   valueA: formatMs(summary.p95LatencyA),
   valueB: formatMs(summary.p95LatencyB),
   delta: formatMs(Math.abs(summary.p95LatencyB - summary.p95LatencyA)),
   deltaNum: summary.p95LatencyB - summary.p95LatencyA,
   invertDelta: true,
  },
  {
   label: "Avg Tokens",
   valueA: summary.avgTokensA.toFixed(0),
   valueB: summary.avgTokensB.toFixed(0),
   delta: (summary.avgTokensB - summary.avgTokensA).toFixed(0),
   deltaNum: summary.avgTokensB - summary.avgTokensA,
  },
  {
   label: "Avg Overall Score",
   valueA: formatScore(summary.avgOverallA),
   valueB: formatScore(summary.avgOverallB),
   delta: formatDelta(summary.avgOverallB - summary.avgOverallA),
   deltaNum: summary.avgOverallB - summary.avgOverallA,
  },
  {
   label: "Failure Rate",
   valueA: formatPercent(summary.failureRateA),
   valueB: formatPercent(summary.failureRateB),
   delta: formatDelta(summary.failureRateB - summary.failureRateA),
   deltaNum: summary.failureRateB - summary.failureRateA,
   invertDelta: true,
  },
 ];

 return (
  <Card>
   <CardHeader>
    <CardTitle className="text-base">Summary Metrics</CardTitle>
   </CardHeader>
   <CardContent>
    <Table>
     <TableHeader>
      <TableRow>
       <TableHead>Metric</TableHead>
       <TableHead className="text-right">A (Baseline)</TableHead>
       <TableHead className="text-right">B (Hybrid)</TableHead>
       <TableHead className="text-right">Δ</TableHead>
      </TableRow>
     </TableHeader>
     <TableBody>
      {rows.map((row) => {
       const d = row.invertDelta ? -row.deltaNum : row.deltaNum;
       return (
        <TableRow key={row.label}>
         <TableCell className="font-medium">{row.label}</TableCell>
         <TableCell className="text-right">{row.valueA}</TableCell>
         <TableCell className="text-right">{row.valueB}</TableCell>
         <TableCell className={`text-right font-medium ${deltaClass(d)}`}>{row.delta}</TableCell>
        </TableRow>
       );
      })}
     </TableBody>
    </Table>
   </CardContent>
  </Card>
 );
}
