import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { NormalizedExperiment } from "@/lib/types";
import { buildLatencyChartData, buildTokenChartData } from "@/lib/metrics";

// ---------- configs ----------

const latencyConfig: ChartConfig = {
 latencyA: {
  label: "A (Baseline)",
  color: "hsl(var(--chart-1))",
 },
 latencyB: {
  label: "B (Hybrid)",
  color: "hsl(var(--chart-2))",
 },
};

const tokenConfig: ChartConfig = {
 promptA: { label: "Prompt A", color: "hsl(var(--chart-1))" },
 completionA: { label: "Completion A", color: "hsl(var(--chart-3))" },
 promptB: { label: "Prompt B", color: "hsl(var(--chart-2))" },
 completionB: { label: "Completion B", color: "hsl(var(--chart-4))" },
};

// ---------- component ----------

interface Props {
 expA: NormalizedExperiment;
 expB: NormalizedExperiment;
}

export default function OverviewCharts({ expA, expB }: Props) {
 const latencyData = buildLatencyChartData(expA, expB);
 const tokenData = buildTokenChartData(expA, expB);

 return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
   {/* Latency per query */}
   <Card>
    <CardHeader>
     <CardTitle className="text-base">Latency per Query</CardTitle>
     <CardDescription>Processing time in ms — A vs B</CardDescription>
    </CardHeader>
    <CardContent>
     {latencyData.length === 0 ? (
      <p className="text-sm text-muted-foreground text-center py-8">processing_time not found</p>
     ) : (
      <ChartContainer config={latencyConfig} className="h-[280px] w-full">
       <AreaChart data={latencyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" tickLine={false} axisLine={false} fontSize={12} label={{ value: "query", position: "insideBottom", offset: -5 }} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `${v.toFixed(0)}ms`} label={{ value: "latency (ms)", angle: -90, position: "insideLeft", offset: 0 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="latencyA" type="monotone" fill="var(--color-latencyA)" fillOpacity={0.2} stroke="var(--color-latencyA)" strokeWidth={2} />
        <Area dataKey="latencyB" type="monotone" fill="var(--color-latencyB)" fillOpacity={0.2} stroke="var(--color-latencyB)" strokeWidth={2} />
       </AreaChart>
      </ChartContainer>
     )}
    </CardContent>
   </Card>

   {/* Token usage */}
   <Card>
    <CardHeader>
     <CardTitle className="text-base">Token Usage</CardTitle>
     <CardDescription>Prompt vs Completion tokens</CardDescription>
    </CardHeader>
    <CardContent>
     {tokenData.length === 0 ? (
      <p className="text-sm text-muted-foreground text-center py-8">Token data not found</p>
     ) : (
      <ChartContainer config={tokenConfig} className="h-[280px] w-full">
       <AreaChart data={tokenData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" tickLine={false} axisLine={false} fontSize={12} label={{ value: "query", position: "insideBottom", offset: -5 }} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} label={{ value: "tokens", angle: -90, position: "insideLeft", offset: 0 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="promptA" type="monotone" fill="var(--color-promptA)" fillOpacity={0.15} stroke="var(--color-promptA)" strokeWidth={2} />
        <Area dataKey="completionA" type="monotone" fill="var(--color-completionA)" fillOpacity={0.15} stroke="var(--color-completionA)" strokeWidth={2} strokeDasharray="5 5" />
        <Area dataKey="promptB" type="monotone" fill="var(--color-promptB)" fillOpacity={0.15} stroke="var(--color-promptB)" strokeWidth={2} />
        <Area dataKey="completionB" type="monotone" fill="var(--color-completionB)" fillOpacity={0.15} stroke="var(--color-completionB)" strokeWidth={2} strokeDasharray="5 5" />
       </AreaChart>
      </ChartContainer>
     )}
    </CardContent>
   </Card>
  </div>
 );
}
