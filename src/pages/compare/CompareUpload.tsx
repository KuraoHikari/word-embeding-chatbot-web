import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadPanel from "@/components/compare/UploadPanel";
import QuickPreview from "@/components/compare/QuickPreview";
import { useCompareStore } from "@/store/compare.store";

export default function CompareUpload() {
 const navigate = useNavigate();
 const { id } = useParams<{ id: string }>();
 const slotA = useCompareStore((s) => s.slotA);
 const slotB = useCompareStore((s) => s.slotB);
 const filters = useCompareStore((s) => s.filters);
 const setFilters = useCompareStore((s) => s.setFilters);
 const reset = useCompareStore((s) => s.reset);
 const setChatbotId = useCompareStore((s) => s.setChatbotId);

 const bothValid = slotA.status === "success" && slotB.status === "success";

 function handleGenerate() {
  if (id) setChatbotId(id);
  const base = id ? `/chatbot/${id}/compare/dashboard` : "/compare/dashboard";
  navigate(base);
 }

 return (
  <div className="container mx-auto max-w-[1200px] py-6 px-4 space-y-6">
   {/* Page header */}
   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
     <h1 className="text-2xl font-bold tracking-tight">Upload Experiment Results</h1>
     <p className="text-muted-foreground text-sm mt-1">Upload 2 JSON files to compare FastText baseline vs FastText hybrid retrieval.</p>
    </div>
    <div className="flex gap-2">
     <Button variant="outline" size="sm" onClick={() => reset()}>
      <RotateCcw className="h-4 w-4 mr-1" />
      Reset
     </Button>
    </div>
   </div>

   {/* Main grid: 7fr / 5fr on desktop */}
   <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {/* Left column — upload + settings */}
    <div className="lg:col-span-7 space-y-6">
     <UploadPanel />

     {/* Compare settings */}
     <Card>
      <CardHeader>
       <CardTitle className="text-base">Compare Settings</CardTitle>
      </CardHeader>
      <CardContent>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
         <Label htmlFor="keyword">Keyword query contains</Label>
         <Input id="keyword" placeholder="e.g. room type" value={filters.keyword ?? ""} onChange={(e) => setFilters({ keyword: e.target.value || undefined })} />
        </div>
        <div className="space-y-2">
         <Label htmlFor="latency">Latency threshold (ms)</Label>
         <Input
          id="latency"
          type="number"
          placeholder="e.g. 5000"
          value={filters.latencyThresholdMs ?? ""}
          onChange={(e) =>
           setFilters({
            latencyThresholdMs: e.target.value ? Number(e.target.value) : undefined,
           })
          }
         />
        </div>
        <div className="space-y-2">
         <Label htmlFor="minScore">Min overall score (0..1)</Label>
         <Input
          id="minScore"
          type="number"
          step="0.1"
          min="0"
          max="1"
          placeholder="e.g. 0.5"
          value={filters.minOverallScore ?? ""}
          onChange={(e) =>
           setFilters({
            minOverallScore: e.target.value ? Number(e.target.value) : undefined,
           })
          }
         />
        </div>
       </div>
      </CardContent>
     </Card>

     {/* Primary CTA */}
     <Button className="w-full" size="lg" disabled={!bothValid} onClick={handleGenerate}>
      <ArrowRight className="h-4 w-4 mr-2" />
      Generate Comparison
     </Button>
    </div>

    {/* Right column — quick preview */}
    <div className="lg:col-span-5">
     <div className="sticky top-20">
      <QuickPreview />
     </div>
    </div>
   </div>
  </div>
 );
}
