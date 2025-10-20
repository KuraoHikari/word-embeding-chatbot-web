import { Link } from "react-router-dom";
import { Plus, Bot, Edit, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetChatbots, useDeleteChatbot } from "@/api/queries/chatbot";

export default function ChatbotList() {
 const { data: chatbots, isLoading, error } = useGetChatbots();
 const deleteMutation = useDeleteChatbot();

 const handleDelete = async (id: number, title: string) => {
  if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
   try {
    await deleteMutation.mutateAsync(id);
    alert("Chatbot deleted successfully");
   } catch (err) {
    console.error("Failed to delete chatbot:", err);
    alert("Failed to delete chatbot. Please try again.");
   }
  }
 };

 if (isLoading) {
  return (
   <div className="container mx-auto p-6">
    <div className="flex items-center justify-between mb-6">
     <div>
      <h1 className="text-3xl font-bold">My Chatbots</h1>
      <p className="text-muted-foreground">Manage your AI chatbots</p>
     </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {[1, 2, 3].map((i) => (
      <Card key={i} className="animate-pulse">
       <CardHeader>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
       </CardHeader>
       <CardContent>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
       </CardContent>
      </Card>
     ))}
    </div>
   </div>
  );
 }

 return (
  <div className="container mx-auto p-6">
   <div className="flex items-center justify-between mb-6">
    <div>
     <h1 className="text-3xl font-bold">My Chatbots</h1>
     <p className="text-muted-foreground">Manage your AI chatbots</p>
    </div>
    <Link to="/chatbot/create">
     <Button className="flex items-center gap-2">
      <Plus className="w-4 h-4" />
      Create New Chatbot
     </Button>
    </Link>
   </div>

   {error && (
    <Card className="text-center py-12">
     <CardContent>
      <Bot className="w-12 h-12 mx-auto text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Error loading chatbots</h2>
      <p className="text-muted-foreground mb-4">{error.message || "Failed to load chatbots. Please try again."}</p>
     </CardContent>
    </Card>
   )}

   {!error && chatbots && chatbots.length === 0 && (
    <Card className="text-center py-12">
     <CardContent>
      <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">No chatbots yet</h2>
      <p className="text-muted-foreground mb-4">Create your first chatbot to get started with AI conversations</p>
      <Link to="/chatbot/create">
       <Button>Create Your First Chatbot</Button>
      </Link>
     </CardContent>
    </Card>
   )}

   {!error && chatbots && chatbots.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {chatbots.map((chatbot) => (
      <Card key={chatbot.id} className="hover:shadow-lg transition-shadow">
       <CardHeader>
        <div className="flex items-start justify-between">
         <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg">{chatbot.title}</CardTitle>
         </div>
         <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
        </div>
        <CardDescription className="line-clamp-2">{chatbot.description || "No description provided"}</CardDescription>
       </CardHeader>
       <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
         <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          {chatbot.aiModel}
         </div>
         <div>{chatbot.createdAt ? new Date(chatbot.createdAt).toLocaleDateString() : "N/A"}</div>
        </div>
       </CardContent>
       <CardFooter className="flex gap-2">
        <Link to={`/chatbot/${chatbot.id}`} className="flex-1">
         <Button variant="outline" className="w-full">
          View Details
         </Button>
        </Link>
        <Link to={`/chatbot/${chatbot.id}/edit`}>
         <Button variant="outline" size="icon">
          <Edit className="w-4 h-4" />
         </Button>
        </Link>
        <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(chatbot.id, chatbot.title)} disabled={deleteMutation.isPending}>
         <Trash2 className="w-4 h-4" />
        </Button>
       </CardFooter>
      </Card>
     ))}
    </div>
   )}
  </div>
 );
}
