import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateChatbot } from "@/api/queries/chatbot";
import { toast } from "sonner";

interface CreateChatbotForm {
 title: string;
 description: string;
 aiModel: string;
 embeddingModel: string;
 temperature: number;
 maxTokens: number;
 systemPrompt: string;
 welcomeMessage: string;
 suggestionMessage: string;
 isPublic: boolean;
 isProposedModel: boolean;
 pdf: File | null;
}

export default function CreateChatbot() {
 const navigate = useNavigate();
 const createMutation = useCreateChatbot();
 const pdfInputRef = useRef<HTMLInputElement | null>(null);
 const [formData, setFormData] = useState<CreateChatbotForm>({
  title: "",
  description: "",
  aiModel: "gpt-3.5-turbo",
  embeddingModel: "fasttext",
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: "",
  welcomeMessage: "Hello! How can I help you today?",
  suggestionMessage: "Ask me anything!",
  isPublic: false,
  isProposedModel: false,
  pdf: null,
 });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.pdf) {
   toast.warning("Silakan upload file PDF terlebih dahulu.");
   return;
  }

  try {
   await createMutation.mutateAsync({
    title: formData.title,
    description: formData.description,
    aiModel: formData.aiModel,
    embeddingModel: formData.embeddingModel,
    temperature: formData.temperature,
    maxTokens: formData.maxTokens,
    systemPrompt: formData.systemPrompt,
    welcomeMessage: formData.welcomeMessage,
    suggestionMessage: formData.suggestionMessage,
    isPublic: formData.isPublic,
    isProposedModel: formData.isProposedModel,
    pdf: formData.pdf,
   });

   toast.success("Chatbot berhasil dibuat.");
   navigate("/chatbot");
  } catch (error) {
   console.error("Error creating chatbot:", error);
   toast.error("Gagal membuat chatbot. Silakan coba lagi.");
  }
 };

 const handleInputChange = (field: keyof CreateChatbotForm, value: string | number | boolean | File | null) => {
  setFormData((prev) => ({
   ...prev,
   [field]: value,
  }));
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   handleInputChange("pdf", file);
  }
 };

 const handleSelectPdfClick = () => {
  pdfInputRef.current?.click();
 };

 const handleClearPdf = () => {
  handleInputChange("pdf", null);
  if (pdfInputRef.current) {
   pdfInputRef.current.value = "";
  }
 };

 return (
  <div className="container mx-auto p-6 max-w-4xl">
   <div className="flex items-center gap-4 mb-6">
    <Button variant="outline" size="icon" onClick={() => navigate("/chatbot")}>
     <ArrowLeft className="w-4 h-4" />
    </Button>
    <div>
     <h1 className="text-3xl font-bold flex items-center gap-2">
      <Bot className="w-8 h-8 text-blue-600" />
      Create New Chatbot
     </h1>
     <p className="text-muted-foreground">Configure your AI chatbot with custom settings and behavior</p>
    </div>
   </div>

   <form onSubmit={handleSubmit}>
    <input ref={pdfInputRef} id="pdf" type="file" accept=".pdf" onChange={handleFileChange} className="sr-only" />

    <Tabs defaultValue="basic" className="w-full">
     <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="basic" className="flex items-center gap-2">
       <Bot className="w-4 h-4" />
       Basic Info
      </TabsTrigger>
      <TabsTrigger value="behavior" className="flex items-center gap-2">
       <FileText className="w-4 h-4" />
       Behavior
      </TabsTrigger>
      <TabsTrigger value="advanced" className="flex items-center gap-2">
       <Settings className="w-4 h-4" />
       Advanced
      </TabsTrigger>
     </TabsList>

     <TabsContent value="basic">
      <Card>
       <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Set up the basic details of your chatbot</CardDescription>
       </CardHeader>
       <CardContent className="space-y-4">
        <div className="space-y-2">
         <Label htmlFor="title">Chatbot Title *</Label>
         <Input id="title" placeholder="Enter chatbot title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required />
        </div>

        <div className="space-y-2">
         <Label htmlFor="description">Description</Label>
         <Textarea id="description" placeholder="Describe what your chatbot does" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={3} />
        </div>

        <div className="space-y-2">
         <Label htmlFor="welcomeMessage">Welcome Message *</Label>
         <Input id="welcomeMessage" placeholder="First message users will see" value={formData.welcomeMessage} onChange={(e) => handleInputChange("welcomeMessage", e.target.value)} required />
        </div>

        <div className="space-y-2">
         <Label htmlFor="suggestionMessage">Suggestion Message *</Label>
         <Input id="suggestionMessage" placeholder="Suggestion for users" value={formData.suggestionMessage} onChange={(e) => handleInputChange("suggestionMessage", e.target.value)} required />
        </div>

        <div className="flex items-center space-x-2">
         <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={(checked) => handleInputChange("isPublic", checked)} />
         <Label htmlFor="isPublic">Make chatbot public</Label>
        </div>
       </CardContent>
      </Card>
     </TabsContent>

     <TabsContent value="behavior">
      <Card>
       <CardHeader>
        <CardTitle>Behavior Settings</CardTitle>
        <CardDescription>Define how your chatbot should behave and respond</CardDescription>
       </CardHeader>
       <CardContent className="space-y-4">
        <div className="space-y-2">
         <Label htmlFor="systemPrompt">System Prompt</Label>
         <Textarea
          id="systemPrompt"
          placeholder="Define the chatbot's role, personality, and instructions"
          value={formData.systemPrompt}
          onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
          rows={6}
         />
         <p className="text-sm text-muted-foreground">This prompt will guide your chatbot's behavior and responses</p>
        </div>

        <div className="space-y-2">
         <Label htmlFor="pdf">Training Data (PDF) *</Label>
         <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={handleSelectPdfClick}>
           Pilih PDF
          </Button>
          {formData.pdf ? (
           <Button type="button" variant="ghost" onClick={handleClearPdf}>
            Hapus File
           </Button>
          ) : null}
         </div>

         <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-medium">Peringatan Keamanan Sebelum Upload</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
           <li>Hapus data pribadi: nomor telepon, email, alamat rumah, nomor identitas/paspor, dan data rekening.</li>
           <li>Hapus kredensial dan rahasia: password, API key, token, sertifikat privat, serta URL internal.</li>
           <li>Hapus informasi rahasia perusahaan: kontrak, strategi harga, dokumen legal internal, roadmap yang belum rilis, dan data sensitif klien.</li>
           <li>Dokumen yang diunggah dapat diproses menjadi index/context untuk retrieval, sehingga isi dokumen bisa muncul dalam jawaban chatbot.</li>
           <li>Pastikan hanya mengunggah konten yang sudah disetujui untuk penggunaan chatbot dan aman untuk direferensikan dalam respons.</li>
          </ul>
         </div>

         {!formData.pdf && <p className="text-sm text-muted-foreground">Belum ada file dipilih.</p>}
         {formData.pdf && <p className="text-sm text-muted-foreground">File terpilih: {formData.pdf.name}</p>}
        </div>
       </CardContent>
      </Card>
     </TabsContent>

     <TabsContent value="advanced">
      <Card>
       <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>Fine-tune your chatbot's AI model parameters</CardDescription>
       </CardHeader>
       <CardContent className="space-y-4">
        <div className="space-y-2">
         <Label htmlFor="aiModel">AI Model *</Label>
         <Select value={formData.aiModel} onValueChange={(value) => handleInputChange("aiModel", value)}>
          <SelectTrigger>
           <SelectValue />
          </SelectTrigger>
          <SelectContent>
           <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
           <SelectItem value="gpt-4">GPT-4</SelectItem>
           <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          </SelectContent>
         </Select>
        </div>

        <div className="space-y-2">
         <Label htmlFor="embeddingModel">Embedding Model *</Label>
         <Select value={formData.embeddingModel} onValueChange={(value) => handleInputChange("embeddingModel", value)}>
          <SelectTrigger>
           <SelectValue />
          </SelectTrigger>
          <SelectContent>
           <SelectItem value="fasttext">fasttext</SelectItem>
           <SelectItem value="word2vec">word2vec</SelectItem>
          </SelectContent>
         </Select>
        </div>

        <div className="flex items-center space-x-2">
         <Switch id="isProposedModel" checked={formData.isProposedModel} onCheckedChange={(checked) => handleInputChange("isProposedModel", checked)} />
         <Label htmlFor="isProposedModel">Use Proposed Model</Label>
        </div>

        <div className="space-y-2">
         <Label htmlFor="temperature">Temperature: {formData.temperature}</Label>
         <input type="range" id="temperature" min="0" max="1" step="0.1" value={formData.temperature} onChange={(e) => handleInputChange("temperature", parseFloat(e.target.value))} className="w-full" />
         <p className="text-sm text-muted-foreground">Lower values make responses more focused, higher values more creative</p>
        </div>

        <div className="space-y-2">
         <Label htmlFor="maxTokens">Max Tokens *</Label>
         <Input id="maxTokens" type="number" min="100" max="4000" value={formData.maxTokens} onChange={(e) => handleInputChange("maxTokens", parseInt(e.target.value))} required />
         <p className="text-sm text-muted-foreground">Maximum length of chatbot responses</p>
        </div>
       </CardContent>
      </Card>
     </TabsContent>
    </Tabs>

    <div className="flex gap-4 mt-6">
     <Button type="button" variant="outline" onClick={() => navigate("/chatbot")}>
      Cancel
     </Button>
     <Button type="submit" disabled={createMutation.isPending || !formData.title || !formData.pdf}>
      {createMutation.isPending ? "Creating..." : "Create Chatbot"}
     </Button>
    </div>
   </form>
  </div>
 );
}
