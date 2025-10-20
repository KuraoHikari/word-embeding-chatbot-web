import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, FileText, Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetChatbotById, useUpdateChatbot } from "@/api/queries/chatbot";
import type { UpdateChatbotPayload } from "@/api/types";

interface EditChatbotForm {
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

export default function EditChatbot() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const chatbotId = parseInt(id || "0");

 const { data: chatbot, isLoading } = useGetChatbotById(chatbotId, !!id);
 const updateMutation = useUpdateChatbot(chatbotId);

 const [formData, setFormData] = useState<EditChatbotForm>({
  title: chatbot?.title || "",
  description: chatbot?.description || "",
  aiModel: chatbot?.aiModel || "gpt-3.5-turbo",
  embeddingModel: chatbot?.embeddingModel || "text-embedding-ada-002",
  temperature: chatbot?.temperature || 0.7,
  maxTokens: chatbot?.maxTokens || 1000,
  systemPrompt: chatbot?.systemPrompt || "",
  welcomeMessage: chatbot?.welcomeMessage || "Hello! How can I help you today?",
  suggestionMessage: chatbot?.suggestionMessage || "Ask me anything!",
  isPublic: chatbot?.isPublic || false,
  isProposedModel: chatbot?.isProposedModel || false,
  pdf: null,
 });

 // Update form data when chatbot data is loaded
 useState(() => {
  if (chatbot) {
   setFormData({
    title: chatbot.title,
    description: chatbot.description || "",
    aiModel: chatbot.aiModel,
    embeddingModel: chatbot.embeddingModel,
    temperature: chatbot.temperature,
    maxTokens: chatbot.maxTokens,
    systemPrompt: chatbot.systemPrompt,
    welcomeMessage: chatbot.welcomeMessage,
    suggestionMessage: chatbot.suggestionMessage,
    isPublic: chatbot.isPublic,
    isProposedModel: chatbot.isProposedModel,
    pdf: null,
   });
  }
 });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
   const payload: UpdateChatbotPayload = {
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
   };

   if (formData.pdf) {
    payload.pdf = formData.pdf;
   }

   await updateMutation.mutateAsync(payload);
   alert("Chatbot updated successfully!");
   navigate(`/chatbot/${id}`);
  } catch (error) {
   console.error("Error updating chatbot:", error);
   alert("Failed to update chatbot. Please try again.");
  }
 };

 const handleInputChange = (field: keyof EditChatbotForm, value: string | number | boolean | File | null) => {
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

 if (isLoading) {
  return (
   <div className="container mx-auto p-6 max-w-4xl">
    <div className="animate-pulse">
     <div className="flex items-center gap-4 mb-6">
      <div className="w-10 h-10 bg-gray-200 rounded"></div>
      <div>
       <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
       <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>
     </div>
     <div className="space-y-4">
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
     </div>
    </div>
   </div>
  );
 }

 if (!chatbot) {
  return (
   <div className="container mx-auto p-6 max-w-4xl">
    <Card className="text-center py-12">
     <CardContent>
      <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Chatbot not found</h2>
      <p className="text-muted-foreground mb-4">The chatbot you're looking for doesn't exist.</p>
      <Button onClick={() => navigate("/chatbot")}>Back to Chatbots</Button>
     </CardContent>
    </Card>
   </div>
  );
 }

 return (
  <div className="container mx-auto p-6 max-w-4xl">
   <div className="flex items-center gap-4 mb-6">
    <Button variant="outline" size="icon" onClick={() => navigate(`/chatbot/${id}`)}>
     <ArrowLeft className="w-4 h-4" />
    </Button>
    <div>
     <h1 className="text-3xl font-bold flex items-center gap-2">
      <Bot className="w-8 h-8 text-blue-600" />
      Edit Chatbot
     </h1>
     <p className="text-muted-foreground">Update your chatbot's configuration and behavior</p>
    </div>
   </div>

   <form onSubmit={handleSubmit}>
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
        <CardDescription>Update the basic details of your chatbot</CardDescription>
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
         <Label htmlFor="pdf">Update Training Data (PDF)</Label>
         <Input id="pdf" type="file" accept=".pdf" onChange={handleFileChange} />
         {formData.pdf && <p className="text-sm text-muted-foreground">Selected: {formData.pdf.name}</p>}
         <p className="text-sm text-muted-foreground">Upload new PDF to replace the current training data (optional)</p>
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
           <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
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
           <SelectItem value="text-embedding-ada-002">Text Embedding Ada 002</SelectItem>
           <SelectItem value="text-embedding-3-small">Text Embedding 3 Small</SelectItem>
           <SelectItem value="text-embedding-3-large">Text Embedding 3 Large</SelectItem>
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

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
         <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Changes to advanced settings may affect your chatbot's performance. Test thoroughly after making changes.
         </p>
        </div>
       </CardContent>
      </Card>
     </TabsContent>
    </Tabs>

    <div className="flex gap-4 mt-6">
     <Button type="button" variant="outline" onClick={() => navigate(`/chatbot/${id}`)}>
      Cancel
     </Button>
     <Button type="submit" disabled={updateMutation.isPending || !formData.title} className="flex items-center gap-2">
      <Save className="w-4 h-4" />
      {updateMutation.isPending ? "Saving..." : "Save Changes"}
     </Button>
    </div>
   </form>
  </div>
 );
}
