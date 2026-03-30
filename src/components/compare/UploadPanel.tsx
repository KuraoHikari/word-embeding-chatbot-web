import { useCallback } from "react";
import { Upload, X, CheckCircle2, AlertCircle, Loader2, FileJson } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompareStore } from "@/store/compare.store";
import type { UploadSlot } from "@/lib/types";

// ---------- single dropzone ----------

function Dropzone({ slot, label, helper, slotState }: { slot: "A" | "B"; label: string; helper: string; slotState: UploadSlot }) {
 const loadFile = useCompareStore((s) => s.loadFile);
 const removeSlot = useCompareStore((s) => s.removeSlot);

 const handleDrop = useCallback(
  (e: React.DragEvent<HTMLDivElement>) => {
   e.preventDefault();
   const file = e.dataTransfer.files[0];
   if (file) readFile(file);
  },
  [slot],
 );

 const handleChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (file) readFile(file);
  },
  [slot],
 );

 function readFile(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
   if (typeof reader.result === "string") {
    loadFile(slot, reader.result, file.name);
   }
  };
  reader.readAsText(file);
 }

 if (slotState.status === "loading") {
  return (
   <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 p-8 text-center min-h-[180px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="text-sm text-muted-foreground">Parsing…</span>
   </div>
  );
 }

 if (slotState.status === "success") {
  return (
   <div className="flex flex-col gap-3 rounded-lg border-2 border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-700 p-4 min-h-[180px]">
    <div className="flex items-center gap-2">
     <CheckCircle2 className="h-5 w-5 text-green-600" />
     <span className="font-medium text-sm truncate">{slotState.fileName}</span>
    </div>
    <div className="flex flex-wrap gap-2">
     <Badge variant="secondary">Records: {slotState.recordCount}</Badge>
     <Badge variant={slotState.hasRagas ? "default" : "outline"}>RAGAS: {slotState.hasRagas ? "Yes" : "No"}</Badge>
     {slotState.modelType && (
      <Badge variant="outline" className="capitalize">
       {slotState.modelType}
      </Badge>
     )}
    </div>
    <Button variant="ghost" size="sm" className="self-start text-destructive hover:text-destructive" onClick={() => removeSlot(slot)}>
     <X className="h-4 w-4 mr-1" /> Remove
    </Button>
   </div>
  );
 }

 if (slotState.status === "error") {
  return (
   <div className="flex flex-col gap-3 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-4 min-h-[180px]">
    <div className="flex items-center gap-2">
     <AlertCircle className="h-5 w-5 text-destructive" />
     <span className="font-medium text-sm">Upload failed</span>
    </div>
    <p className="text-sm text-destructive">{slotState.error}</p>
    <Button variant="ghost" size="sm" className="self-start text-destructive" onClick={() => removeSlot(slot)}>
     <X className="h-4 w-4 mr-1" /> Remove
    </Button>
   </div>
  );
 }

 // empty state
 return (
  <div
   className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/30 transition-colors p-8 text-center min-h-[180px] cursor-pointer"
   onDragOver={(e) => e.preventDefault()}
   onDrop={handleDrop}
   onClick={() => document.getElementById(`file-input-${slot}`)?.click()}
  >
   <Upload className="h-8 w-8 text-muted-foreground" />
   <p className="text-sm font-medium">{label}</p>
   <p className="text-xs text-muted-foreground">{helper}</p>
   <p className="text-xs text-muted-foreground">Drag & drop JSON here or click to browse</p>
   <input id={`file-input-${slot}`} type="file" accept=".json,application/json" className="hidden" onChange={handleChange} />
  </div>
 );
}

// ---------- full upload panel ----------

export default function UploadPanel() {
 const slotA = useCompareStore((s) => s.slotA);
 const slotB = useCompareStore((s) => s.slotB);

 return (
  <Card>
   <CardHeader>
    <CardTitle className="flex items-center gap-2">
     <FileJson className="h-5 w-5" />
     Upload Files
    </CardTitle>
    <CardDescription>Drop files into slots A and B. We'll validate schema and compute preview metrics.</CardDescription>
   </CardHeader>
   <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     <div>
      <p className="text-sm font-medium mb-2">File A — FastText Baseline</p>
      <Dropzone slot="A" label="FastText Baseline" helper="JSON file output" slotState={slotA} />
     </div>
     <div>
      <p className="text-sm font-medium mb-2">File B — FastText Hybrid</p>
      <Dropzone slot="B" label="FastText Hybrid" helper="JSON file output" slotState={slotB} />
     </div>
    </div>

    {/* Validation banner */}
    {slotA.status !== "success" || slotB.status !== "success" ? (
     <div className="mt-4 rounded-md bg-muted p-3 text-sm text-muted-foreground">
      {slotA.status !== "success" && slotB.status !== "success" ? "Upload 2 files to enable comparison." : "Upload 1 more file to enable comparison."}
     </div>
    ) : null}
   </CardContent>
  </Card>
 );
}
