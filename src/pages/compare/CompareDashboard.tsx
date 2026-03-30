import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KPIGrid from "@/components/compare/KPIGrid";
import SummaryTable from "@/components/compare/SummaryTable";
import OverviewCharts from "@/components/compare/OverviewCharts";
import RetrievalComparePanel from "@/components/compare/RetrievalComparePanel";
import RagasCharts from "@/components/compare/RagasCharts";
import QueryDrilldown from "@/components/compare/QueryDrilldown";
import SchemaLogs from "@/components/compare/SchemaLogs";
import { useCompareStore } from "@/store/compare.store";

export default function CompareDashboard() {
 const navigate = useNavigate();
 const { id } = useParams<{ id: string }>();
 const normalizedA = useCompareStore((s) => s.normalizedA);
 const normalizedB = useCompareStore((s) => s.normalizedB);
 const summary = useCompareStore((s) => s.summary);
 const rawA = useCompareStore((s) => s.rawA);
 const rawB = useCompareStore((s) => s.rawB);

 const uploadPath = id ? `/chatbot/${id}/compare/upload` : "/compare/upload";

 // Empty state — no data loaded
 if (!normalizedA || !normalizedB) {
  return (
   <div className="container mx-auto max-w-[1200px] py-12 px-4 text-center space-y-4">
    <FileJson className="h-12 w-12 mx-auto text-muted-foreground" />
    <h2 className="text-xl font-semibold">No comparison data</h2>
    <p className="text-muted-foreground">Upload two JSON experiment files first to generate a comparison dashboard.</p>
    <Button onClick={() => navigate(uploadPath)}>
     <ArrowLeft className="h-4 w-4 mr-2" />
     Back to Upload
    </Button>
   </div>
  );
 }

 function handleExportCsv() {
  if (!summary) return;
  const rows = [
   ["Metric", "A (Baseline)", "B (Hybrid)"],
   ["Records", summary.recordsA.toString(), summary.recordsB.toString()],
   ["Avg Latency (ms)", summary.avgLatencyA.toFixed(0), summary.avgLatencyB.toFixed(0)],
   ["P95 Latency (ms)", summary.p95LatencyA.toFixed(0), summary.p95LatencyB.toFixed(0)],
   ["Avg Overall Score", summary.avgOverallA.toFixed(4), summary.avgOverallB.toFixed(4)],
   ["Failure Rate", (summary.failureRateA * 100).toFixed(1) + "%", (summary.failureRateB * 100).toFixed(1) + "%"],
   ["Avg Tokens", summary.avgTokensA.toFixed(0), summary.avgTokensB.toFixed(0)],
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "comparison-summary.csv";
  a.click();
  URL.revokeObjectURL(url);
 }

 return (
  <div className="container mx-auto max-w-[1200px] py-6 px-4 space-y-6">
   {/* Page header */}
   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
     <h1 className="text-2xl font-bold tracking-tight">Comparison Dashboard</h1>
     <p className="text-muted-foreground text-sm mt-1">Visualize metrics, retrieval quality, and RAGAS scores between A and B.</p>
    </div>
    <div className="flex gap-2 flex-wrap">
     <Badge variant="outline">A: {normalizedA.sourceFileName ?? "Baseline"}</Badge>
     <Badge variant="outline">B: {normalizedB.sourceFileName ?? "Hybrid"}</Badge>
     <Button variant="outline" size="sm" onClick={handleExportCsv}>
      <Download className="h-4 w-4 mr-1" />
      Export CSV
     </Button>
     <Button variant="outline" size="sm" onClick={() => navigate(uploadPath)}>
      <ArrowLeft className="h-4 w-4 mr-1" />
      Back to Upload
     </Button>
    </div>
   </div>

   {/* KPI Grid */}
   <KPIGrid summary={summary} />

   {/* Tabs */}
   <Tabs defaultValue="overview">
    <TabsList className="flex-wrap">
     <TabsTrigger value="overview">Overview</TabsTrigger>
     <TabsTrigger value="retrieval">Retrieval</TabsTrigger>
     <TabsTrigger value="ragas">RAGAS</TabsTrigger>
     <TabsTrigger value="queries">Queries</TabsTrigger>
     <TabsTrigger value="schema">Schema & Logs</TabsTrigger>
    </TabsList>

    {/* Overview */}
    <TabsContent value="overview" className="space-y-4 mt-4">
     <OverviewCharts expA={normalizedA} expB={normalizedB} />
     <SummaryTable summary={summary} />
    </TabsContent>

    {/* Retrieval */}
    <TabsContent value="retrieval" className="mt-4">
     <RetrievalComparePanel expA={normalizedA} expB={normalizedB} />
    </TabsContent>

    {/* RAGAS */}
    <TabsContent value="ragas" className="mt-4">
     <RagasCharts expA={normalizedA} expB={normalizedB} />
    </TabsContent>

    {/* Queries drilldown */}
    <TabsContent value="queries" className="mt-4">
     <QueryDrilldown expA={normalizedA} expB={normalizedB} />
    </TabsContent>

    {/* Schema & Logs */}
    <TabsContent value="schema" className="mt-4">
     <SchemaLogs expA={normalizedA} expB={normalizedB} rawA={rawA} rawB={rawB} />
    </TabsContent>
   </Tabs>
  </div>
 );
}
