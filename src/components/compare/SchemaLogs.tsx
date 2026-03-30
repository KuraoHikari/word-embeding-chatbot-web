import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FileCode2, AlertTriangle } from "lucide-react";
import type { NormalizedExperiment } from "@/lib/types";

interface Props {
 expA: NormalizedExperiment;
 expB: NormalizedExperiment;
 rawA: unknown;
 rawB: unknown;
}

export default function SchemaLogs({ expA, expB, rawA, rawB }: Props) {
 return (
  <div className="space-y-4">
   {/* Mapping table */}
   <Card>
    <CardHeader>
     <CardTitle className="text-base flex items-center gap-2">
      <FileCode2 className="h-4 w-4" />
      Field Mapping
     </CardTitle>
     <CardDescription>How raw fields are mapped to the normalized schema</CardDescription>
    </CardHeader>
    <CardContent>
     <Table>
      <TableHeader>
       <TableRow>
        <TableHead>Normalized Field</TableHead>
        <TableHead>Baseline Source</TableHead>
        <TableHead>Hybrid Source</TableHead>
       </TableRow>
      </TableHeader>
      <TableBody>
       {fieldMappings.map((m) => (
        <TableRow key={m.normalized}>
         <TableCell className="font-medium text-xs">{m.normalized}</TableCell>
         <TableCell className="text-xs font-mono">{m.baseline}</TableCell>
         <TableCell className="text-xs font-mono">{m.hybrid}</TableCell>
        </TableRow>
       ))}
      </TableBody>
     </Table>
    </CardContent>
   </Card>

   {/* Parsing warnings */}
   <Card>
    <CardHeader>
     <CardTitle className="text-base flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      Parsing Warnings
     </CardTitle>
    </CardHeader>
    <CardContent>
     <ParsingWarnings expA={expA} expB={expB} />
    </CardContent>
   </Card>

   {/* Raw JSON viewer */}
   <Card>
    <CardHeader>
     <CardTitle className="text-base">Raw JSON Viewer</CardTitle>
     <CardDescription>Collapsible sample records from each file</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
     <RawJsonSection label={`A — ${expA.sourceFileName ?? "Baseline"}`} record={expA.records[0]?.raw} />
     <RawJsonSection label={`B — ${expB.sourceFileName ?? "Hybrid"}`} record={expB.records[0]?.raw} />
    </CardContent>
   </Card>
  </div>
 );
}

// ---------- field mappings ----------

const fieldMappings = [
 { normalized: "query", baseline: "results.query", hybrid: "results.query" },
 { normalized: "processingTimeMs", baseline: "results.processing_time × 1000", hybrid: "results.processing_time × 1000" },
 { normalized: "tokens.prompt", baseline: "results.gpt_generation.prompt_tokens", hybrid: "results.gpt_generation.prompt_tokens" },
 { normalized: "tokens.completion", baseline: "results.gpt_generation.completion_tokens", hybrid: "results.gpt_generation.completion_tokens" },
 { normalized: "tokens.total", baseline: "results.gpt_generation.tokens_used", hybrid: "results.gpt_generation.tokens_used" },
 { normalized: "answer.text", baseline: "results.gpt_generation.answer", hybrid: "results.gpt_generation.answer" },
 { normalized: "retrieval.retrievedCount", baseline: "results.results.length", hybrid: "results.search_pipeline.hybrid_search_results" },
 { normalized: "retrieval.rerankedCount", baseline: "—", hybrid: "results.search_pipeline.mmr_reranked_results" },
 { normalized: "retrieval.scores[]", baseline: "results.results[].similarity_score", hybrid: "results.results[].final_score" },
 { normalized: "ragas.contextRelevance", baseline: "results.ragas_evaluation.context_relevance", hybrid: "results.ragas_evaluation.context_relevance" },
 { normalized: "ragas.faithfulness", baseline: "results.ragas_evaluation.faithfulness", hybrid: "results.ragas_evaluation.faithfulness" },
 { normalized: "ragas.answerRelevance", baseline: "results.ragas_evaluation.answer_relevance", hybrid: "results.ragas_evaluation.answer_relevance" },
 { normalized: "ragas.overallScore", baseline: "results.ragas_evaluation.overall_score", hybrid: "results.ragas_evaluation.overall_score" },
];

// ---------- parsing warnings ----------

function ParsingWarnings({ expA, expB }: { expA: NormalizedExperiment; expB: NormalizedExperiment }) {
 const warnings: { file: string; message: string }[] = [];

 // Check for records without queries
 const noQueryA = expA.records.filter((r) => !r.query).length;
 const noQueryB = expB.records.filter((r) => !r.query).length;
 if (noQueryA > 0) warnings.push({ file: "A", message: `${noQueryA} records have no query text` });
 if (noQueryB > 0) warnings.push({ file: "B", message: `${noQueryB} records have no query text` });

 // Check ragas missing
 const noRagasA = expA.records.filter((r) => r.ragas?.overallScore === undefined).length;
 const noRagasB = expB.records.filter((r) => r.ragas?.overallScore === undefined).length;
 if (noRagasA > 0 && noRagasA < expA.records.length) warnings.push({ file: "A", message: `${noRagasA}/${expA.records.length} records missing RAGAS` });
 if (noRagasB > 0 && noRagasB < expB.records.length) warnings.push({ file: "B", message: `${noRagasB}/${expB.records.length} records missing RAGAS` });

 // Record count mismatch
 if (expA.records.length !== expB.records.length) {
  warnings.push({
   file: "Both",
   message: `Record count mismatch: A=${expA.records.length}, B=${expB.records.length}`,
  });
 }

 if (warnings.length === 0) {
  return <p className="text-sm text-muted-foreground">No warnings — data looks good.</p>;
 }

 return (
  <div className="space-y-2">
   {warnings.map((w, i) => (
    <div key={i} className="flex items-start gap-2 text-sm">
     <Badge variant="outline" className="shrink-0 text-[10px]">
      {w.file}
     </Badge>
     <span className="text-muted-foreground">{w.message}</span>
    </div>
   ))}
  </div>
 );
}

// ---------- raw JSON section ----------

function RawJsonSection({ label, record }: { label: string; record: unknown }) {
 const [open, setOpen] = useState(false);

 return (
  <Collapsible open={open} onOpenChange={setOpen}>
   <CollapsibleTrigger asChild>
    <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
     {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
     {label}
    </Button>
   </CollapsibleTrigger>
   <CollapsibleContent>
    <ScrollArea className="max-h-[400px] rounded-md border bg-muted/30 p-3">
     <pre className="text-xs whitespace-pre-wrap">{record ? JSON.stringify(record, null, 2) : "No raw data available."}</pre>
    </ScrollArea>
   </CollapsibleContent>
  </Collapsible>
 );
}
