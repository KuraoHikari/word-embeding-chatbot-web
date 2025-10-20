import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bot, Edit, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useGetChatbotById, useDeleteChatbot } from "@/api/queries/chatbot";

export default function ChatbotDetails() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const chatbotId = parseInt(id || "0");

 const { data: chatbot, isLoading } = useGetChatbotById(chatbotId, !!id);
 const deleteMutation = useDeleteChatbot();

 const handleDelete = async () => {
  if (confirm(`Are you sure you want to delete "${chatbot?.title}"? This action cannot be undone.`)) {
   try {
    await deleteMutation.mutateAsync(chatbotId);
    alert("Chatbot deleted successfully!");
    navigate("/chatbot");
   } catch (error) {
    console.error("Error deleting chatbot:", error);
    alert("Failed to delete chatbot. Please try again.");
   }
  }
 };

 if (isLoading) {
  return (
   <div className="container mx-auto p-6 max-w-6xl">
    <div className="animate-pulse">
     <div className="flex items-center gap-4 mb-6">
      <div className="w-10 h-10 bg-gray-200 rounded"></div>
      <div>
       <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
       <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
       <Card key={i}>
        <CardContent className="p-4">
         <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
         <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
       </Card>
      ))}
     </div>
    </div>
   </div>
  );
 }

 if (!chatbot) {
  return (
   <div className="container mx-auto p-6 max-w-6xl">
    <Card className="text-center py-12">
     <CardContent>
      <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Chatbot not found</h2>
      <p className="text-muted-foreground mb-4">The chatbot you're looking for doesn't exist or has been removed.</p>
      <Button onClick={() => navigate("/chatbot")}>Back to Chatbots</Button>
     </CardContent>
    </Card>
   </div>
  );
 }

 return (
  <div className="container mx-auto p-6 max-w-6xl">
   <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-4">
     <Button variant="outline" size="icon" onClick={() => navigate("/chatbot")}>
      <ArrowLeft className="w-4 h-4" />
     </Button>
     <div>
      <div className="flex items-center gap-2 mb-1">
       <h1 className="text-3xl font-bold flex items-center gap-2">
        <Bot className="w-8 h-8 text-blue-600" />
        {chatbot.title}
       </h1>
       <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
      </div>
      <p className="text-muted-foreground">{chatbot.description || "No description"}</p>
     </div>
    </div>
    <div className="flex gap-2">
     <Link to={`/chatbot/${chatbot.id}/edit`}>
      <Button variant="outline" className="flex items-center gap-2">
       <Edit className="w-4 h-4" />
       Edit
      </Button>
     </Link>
     <Button variant="outline" onClick={handleDelete} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-700 flex items-center gap-2">
      <Trash2 className="w-4 h-4" />
      Delete
     </Button>
    </div>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card>
     <CardContent className="p-4">
      <div className="flex items-center gap-2">
       <MessageSquare className="w-4 h-4 text-blue-600" />
       <p className="text-sm text-muted-foreground">AI Model</p>
      </div>
      <p className="text-2xl font-bold mt-1">{chatbot.aiModel}</p>
     </CardContent>
    </Card>
    <Card>
     <CardContent className="p-4">
      <div className="flex items-center gap-2">
       <MessageSquare className="w-4 h-4 text-green-600" />
       <p className="text-sm text-muted-foreground">Max Tokens</p>
      </div>
      <p className="text-2xl font-bold mt-1">{chatbot.maxTokens}</p>
     </CardContent>
    </Card>
    <Card>
     <CardContent className="p-4">
      <div className="flex items-center gap-2">
       <MessageSquare className="w-4 h-4 text-yellow-600" />
       <p className="text-sm text-muted-foreground">Temperature</p>
      </div>
      <p className="text-2xl font-bold mt-1">{chatbot.temperature}</p>
     </CardContent>
    </Card>
    <Card>
     <CardContent className="p-4">
      <div className="flex items-center gap-2">
       <MessageSquare className="w-4 h-4 text-purple-600" />
       <p className="text-sm text-muted-foreground">Public</p>
      </div>
      <p className="text-2xl font-bold mt-1">{chatbot.isPublic ? "Yes" : "No"}</p>
     </CardContent>
    </Card>
   </div>

   <Tabs defaultValue="overview" className="w-full">
    <TabsList className="grid w-full grid-cols-2">
     <TabsTrigger value="overview">Overview</TabsTrigger>
     <TabsTrigger value="configuration">Configuration</TabsTrigger>
    </TabsList>

    <TabsContent value="overview">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
       <CardHeader>
        <CardTitle>Basic Information</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
        <div>
         <p className="text-sm text-muted-foreground">Title</p>
         <p className="text-base">{chatbot.title}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm text-muted-foreground">Description</p>
         <p className="text-base">{chatbot.description || "No description"}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm text-muted-foreground">PDF Document</p>
         <a href={chatbot.pdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {chatbot.pdfTitle}
         </a>
        </div>
        <Separator />
        <div>
         <p className="text-sm text-muted-foreground">Created At</p>
         <p className="text-base">{chatbot.createdAt ? new Date(chatbot.createdAt).toLocaleDateString() : "N/A"}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm text-muted-foreground">Last Updated</p>
         <p className="text-base">{chatbot.updatedAt ? new Date(chatbot.updatedAt).toLocaleDateString() : "N/A"}</p>
        </div>
       </CardContent>
      </Card>

      <Card>
       <CardHeader>
        <CardTitle>Messages & Prompts</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
        <div>
         <p className="text-sm text-muted-foreground">Welcome Message</p>
         <p className="text-base">{chatbot.welcomeMessage}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm text-muted-foreground">Suggestion Message</p>
         <p className="text-base">{chatbot.suggestionMessage}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm text-muted-foreground">System Prompt</p>
         <p className="text-base">{chatbot.systemPrompt}</p>
        </div>
       </CardContent>
      </Card>
     </div>
    </TabsContent>

    <TabsContent value="configuration">
     <Card>
      <CardHeader>
       <CardTitle>Model Configuration</CardTitle>
       <CardDescription>AI model settings and parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
        <div>
         <p className="text-sm text-muted-foreground">AI Model</p>
         <p className="text-base font-medium">{chatbot.aiModel}</p>
        </div>
        <div>
         <p className="text-sm text-muted-foreground">Embedding Model</p>
         <p className="text-base font-medium">{chatbot.embeddingModel}</p>
        </div>
        <div>
         <p className="text-sm text-muted-foreground">Temperature</p>
         <p className="text-base font-medium">{chatbot.temperature}</p>
        </div>
        <div>
         <p className="text-sm text-muted-foreground">Max Tokens</p>
         <p className="text-base font-medium">{chatbot.maxTokens}</p>
        </div>
        <div>
         <p className="text-sm text-muted-foreground">Proposed Model</p>
         <p className="text-base font-medium">{chatbot.isProposedModel ? "Yes" : "No"}</p>
        </div>
        <div>
         <p className="text-sm text-muted-foreground">Public Access</p>
         <p className="text-base font-medium">{chatbot.isPublic ? "Yes" : "No"}</p>
        </div>
       </div>
      </CardContent>
     </Card>
    </TabsContent>
   </Tabs>
  </div>
 );
}
