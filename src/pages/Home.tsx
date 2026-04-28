import { useMemo, useState, type ComponentType } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDashboardQuery } from "@/api/queries/dashboard";
import type { DashboardTrendGroup, DashboardTrendPoint } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Bot, MessageSquare, RotateCcw, Sparkles, TrendingUp, Users } from "lucide-react";

type TrendRange = keyof DashboardTrendGroup;

const rangeLabels: Record<TrendRange, string> = {
 daily: "Harian",
 weekly: "Mingguan",
 monthly: "Bulanan",
};

const numberFormatter = new Intl.NumberFormat("id-ID");
const compactFormatter = new Intl.NumberFormat("id-ID", { notation: "compact" });
const decimalFormatter = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

function formatPeriodLabel(period: string, range: TrendRange): string {
 if (range === "weekly") {
  const [, week] = period.split("-");
  return week ? `W${week}` : period;
 }

 if (range === "monthly") {
  const monthDate = new Date(`${period}-01T00:00:00`);
  return Number.isNaN(monthDate.getTime()) ? period : monthDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
 }

 const dayDate = new Date(period);
 return Number.isNaN(dayDate.getTime()) ? period : dayDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

function mapTrendData(series: DashboardTrendPoint[], range: TrendRange) {
 return series.map((item) => ({
  label: formatPeriodLabel(item.period, range),
  count: item.count,
 }));
}

function sumCounts(series: DashboardTrendPoint[]) {
 return series.reduce((total, item) => total + item.count, 0);
}

export default function Home() {
 const [range, setRange] = useState<TrendRange>("daily");
 const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt } = useDashboardQuery();

 const summary = data?.summary;
 const trends = data?.trends;
 const performance = data?.performance;

 const lastUpdated = dataUpdatedAt ? dateFormatter.format(new Date(dataUpdatedAt)) : "N/A";

 const summaryCards = useMemo(
  () => [
   {
    label: "Total Chatbots",
    value: numberFormatter.format(summary?.totalChatbots ?? 0),
    hint: "Chatbot aktif",
    icon: Bot,
    barClass: "bg-emerald-500/70",
    iconClass: "bg-emerald-500/10 text-emerald-600",
   },
   {
    label: "Total Conversations",
    value: numberFormatter.format(summary?.totalConversations ?? 0),
    hint: "Percakapan unik",
    icon: BarChart3,
    barClass: "bg-sky-500/70",
    iconClass: "bg-sky-500/10 text-sky-600",
   },
   {
    label: "Total Messages",
    value: numberFormatter.format(summary?.totalMessages ?? 0),
    hint: "Pesan masuk",
    icon: MessageSquare,
    barClass: "bg-amber-500/70",
    iconClass: "bg-amber-500/10 text-amber-700",
   },
   {
    label: "Total AI Responses",
    value: numberFormatter.format(summary?.totalAiResponses ?? 0),
    hint: "Balasan AI",
    icon: Sparkles,
    barClass: "bg-fuchsia-500/70",
    iconClass: "bg-fuchsia-500/10 text-fuchsia-600",
   },
   {
    label: "Total Contacts",
    value: numberFormatter.format(summary?.totalContacts ?? 0),
    hint: "Kontak aktif",
    icon: Users,
    barClass: "bg-indigo-500/70",
    iconClass: "bg-indigo-500/10 text-indigo-600",
   },
   {
    label: "Avg Pesan / Percakapan",
    value: decimalFormatter.format(summary?.avgMessagesPerConversation ?? 0),
    hint: "Rata-rata pesan",
    icon: TrendingUp,
    barClass: "bg-rose-500/70",
    iconClass: "bg-rose-500/10 text-rose-600",
   },
  ],
  [summary],
 );

 const incomingSeries = trends?.incomingMessages?.[range] ?? [];
 const conversationsSeries = trends?.newConversations?.[range] ?? [];
 const contactsSeries = trends?.newContacts?.[range] ?? [];
 const autoReplyRatio = trends?.autoReplyRatio ?? 0;
 const autoReplyPercent = Math.min(100, Math.max(0, Math.round(autoReplyRatio * 100)));

 return (
  <div className="space-y-8">
   <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50/80 via-background to-amber-50/70 p-6 shadow-sm">
    <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
    <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-amber-200/40 blur-3xl" />
    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
     <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Analitik Percakapan Chatbot</h1>
      <p className="max-w-2xl text-sm text-muted-foreground">Ringkasan performa chatbot, tren pesan, dan chatbot teratas berdasarkan interaksi pengguna.</p>
     </div>
     <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="bg-background/80 text-xs">
       Diperbarui: {lastUpdated}
      </Badge>
      <Button variant="outline" onClick={() => refetch()} disabled={isFetching} className="gap-2">
       <RotateCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
       Muat ulang
      </Button>
     </div>
    </div>
   </section>

   {isLoading ? (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
     {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="animate-pulse">
       <CardContent className="pt-5 space-y-3">
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-7 w-3/4 rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
       </CardContent>
      </Card>
     ))}
    </section>
   ) : null}

   {isError ? (
    <Card className="border-destructive/40 bg-destructive/5">
     <CardHeader>
      <CardTitle className="text-base">Gagal memuat dashboard</CardTitle>
      <CardDescription>{error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data."}</CardDescription>
     </CardHeader>
     <CardContent>
      <Button onClick={() => refetch()} variant="outline" className="gap-2">
       <RotateCcw className="h-4 w-4" />
       Coba lagi
      </Button>
     </CardContent>
    </Card>
   ) : null}

   {data ? (
    <>
     <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryCards.map((card) => (
       <SummaryCard key={card.label} {...card} />
      ))}
     </section>

     <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
       <div>
        <h2 className="text-lg font-semibold">Tren Aktivitas</h2>
        <p className="text-sm text-muted-foreground">Pantau volume pesan masuk, percakapan baru, dan kontak baru.</p>
       </div>
       <Select value={range} onValueChange={(value) => setRange(value as TrendRange)}>
        <SelectTrigger className="w-[180px]">
         <SelectValue />
        </SelectTrigger>
        <SelectContent>
         {Object.entries(rangeLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>
           {label}
          </SelectItem>
         ))}
        </SelectContent>
       </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
       <TrendCard title="Pesan Masuk" description="Jumlah pesan masuk per periode" range={range} series={incomingSeries} color="hsl(var(--chart-2))" />
       <TrendCard title="Percakapan Baru" description="Percakapan baru yang dimulai" range={range} series={conversationsSeries} color="hsl(var(--chart-3))" />
       <TrendCard title="Kontak Baru" description="Kontak baru yang terdeteksi" range={range} series={contactsSeries} color="hsl(var(--chart-4))" />
       <AutoReplyCard percent={autoReplyPercent} />
      </div>
     </section>

     <section className="space-y-4">
      <div>
       <h2 className="text-lg font-semibold">Kinerja Chatbot</h2>
       <p className="text-sm text-muted-foreground">Chatbot teratas berdasarkan jumlah percakapan, pesan, dan panjang pesan rata-rata.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
       <PerformanceCard
        title="Chatbot Teratas (Percakapan)"
        description="Paling sering dipakai pengguna"
        items={(performance?.topChatbotsByConversations ?? []).map((item) => ({
         id: item.chatbotId,
         title: item.title,
         value: item.conversations,
        }))}
        valueFormatter={(value) => `${numberFormatter.format(value)} percakapan`}
       />
       <PerformanceCard
        title="Chatbot Teratas (Pesan)"
        description="Volume pesan tertinggi"
        items={(performance?.topChatbotsByMessages ?? []).map((item) => ({
         id: item.chatbotId,
         title: item.title,
         value: item.messages,
        }))}
        valueFormatter={(value) => `${numberFormatter.format(value)} pesan`}
       />
       <PerformanceCard
        title="Chatbot Teratas (Avg Panjang Pesan)"
        description="Rata-rata panjang pesan user"
        items={(performance?.topChatbotsByAvgUserMessageLength ?? []).map((item) => ({
         id: item.chatbotId,
         title: item.title,
         value: item.avgLength,
        }))}
        valueFormatter={(value) => `${decimalFormatter.format(value)} karakter`}
       />
      </div>
     </section>
    </>
   ) : null}
  </div>
 );
}

function SummaryCard({ label, value, hint, icon: Icon, barClass, iconClass }: { label: string; value: string; hint: string; icon: ComponentType<{ className?: string }>; barClass: string; iconClass: string }) {
 return (
  <Card className="relative overflow-hidden border bg-gradient-to-br from-background via-muted/60 to-background">
   <div className={`absolute inset-x-0 top-0 h-1 ${barClass}`} />
   <CardContent className="pt-5">
    <div className="flex items-start justify-between gap-4">
     <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
     </div>
     <div className={`rounded-xl p-2 ${iconClass}`}>
      <Icon className="h-4 w-4" />
     </div>
    </div>
   </CardContent>
  </Card>
 );
}

function TrendCard({ title, description, range, series, color }: { title: string; description: string; range: TrendRange; series: DashboardTrendPoint[]; color: string }) {
 const chartData = useMemo(() => mapTrendData(series, range), [series, range]);
 const total = sumCounts(series);
 const latest = series[series.length - 1];
 const previous = series[series.length - 2];
 const delta = latest && previous ? latest.count - previous.count : null;

 const config: ChartConfig = {
  count: { label: title, color },
 };

 return (
  <Card>
   <CardHeader>
    <div className="flex items-start justify-between gap-3">
     <div>
      <CardTitle className="text-base">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
     </div>
     <Badge variant="outline" className="text-xs">
      {rangeLabels[range]}
     </Badge>
    </div>
    <div className="pt-3 flex flex-wrap items-center gap-2">
     <span className="text-2xl font-semibold">{compactFormatter.format(total)}</span>
     <span className="text-xs text-muted-foreground">total</span>
     {delta !== null ? (
      <Badge variant="secondary" className={`text-xs ${delta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
       {delta >= 0 ? "+" : ""}
       {delta}
      </Badge>
     ) : null}
    </div>
   </CardHeader>
   <CardContent>
    {chartData.length === 0 ? (
     <p className="text-sm text-muted-foreground text-center py-8">Belum ada data.</p>
    ) : (
     <ChartContainer config={config} className="h-[180px] w-full">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
       <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} />
       <ChartTooltip content={<ChartTooltipContent />} />
       <Area dataKey="count" type="monotone" fill="var(--color-count)" fillOpacity={0.2} stroke="var(--color-count)" strokeWidth={2} />
      </AreaChart>
     </ChartContainer>
    )}
   </CardContent>
  </Card>
 );
}

function AutoReplyCard({ percent }: { percent: number }) {
 const label = percent >= 80 ? "Tinggi" : percent >= 50 ? "Seimbang" : "Rendah";
 return (
  <Card className="bg-gradient-to-br from-background via-muted/50 to-background">
   <CardHeader>
    <CardTitle className="text-base">Rasio Auto Reply</CardTitle>
    <CardDescription>Proporsi balasan otomatis terhadap total interaksi.</CardDescription>
   </CardHeader>
   <CardContent className="space-y-4">
    <div className="flex items-end justify-between gap-3">
     <div>
      <p className="text-3xl font-semibold">{percent}%</p>
      <p className="text-xs text-muted-foreground">Rasio auto-reply</p>
     </div>
     <Badge variant="outline" className="text-xs">
      {label}
     </Badge>
    </div>
    <Progress value={percent} />
   </CardContent>
  </Card>
 );
}

function PerformanceCard({
 title,
 description,
 items,
 valueFormatter,
}: {
 title: string;
 description: string;
 items: Array<{ id: number; title: string; value: number }>;
 valueFormatter: (value: number) => string;
}) {
 const maxValue = items.length ? Math.max(...items.map((item) => item.value)) : 0;

 return (
  <Card>
   <CardHeader>
    <CardTitle className="text-base">{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
   </CardHeader>
   <CardContent>
    {items.length === 0 ? (
     <p className="text-sm text-muted-foreground text-center py-6">Belum ada data.</p>
    ) : (
     <div className="space-y-3">
      {items.map((item, index) => {
       const percent = maxValue > 0 ? Math.round((item.value / maxValue) * 100) : 0;
       return (
        <div key={item.id} className="rounded-lg border bg-muted/30 p-3">
         <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
           <p className="text-sm font-medium line-clamp-2">{item.title}</p>
           <p className="text-xs text-muted-foreground">#{index + 1} chatbot</p>
          </div>
          <Badge variant="outline" className="text-xs">
           {valueFormatter(item.value)}
          </Badge>
         </div>
         <div className="mt-3 flex items-center gap-2">
          <Progress value={percent} className="h-2" />
          <span className="text-[10px] text-muted-foreground">{percent}%</span>
         </div>
        </div>
       );
      })}
     </div>
    )}
   </CardContent>
  </Card>
 );
}
