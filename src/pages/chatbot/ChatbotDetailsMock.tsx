import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bot, Edit, Trash2, MessageSquare, Users, TrendingUp, BarChart3, Send, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetChatbotDetail, useDeleteChatbot } from "@/api/queries/chatbot";
import { useCreateMessage } from "@/api/queries/message";
import type { Message } from "@/api/types";

interface ChatMessage {
 id: string;
 role: "user" | "assistant";
 content: string;
 timestamp: Date;
 messageData?: Message;
}

export default function ChatbotDetailsMock() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const chatbotId = parseInt(id || "0");

 const { data: chatbot, isLoading } = useGetChatbotDetail(chatbotId, !!id);
 const deleteMutation = useDeleteChatbot();
 const createMessageMutation = useCreateMessage();

 const [messages, setMessages] = useState<ChatMessage[]>([]);
 const [inputMessage, setInputMessage] = useState("");
 const [isSending, setIsSending] = useState(false);
 const [selectedResult, setSelectedResult] = useState<Message | null>(null);
 const [botResponses, setBotResponses] = useState<Message[]>([]);

 // Initialize chat with welcome message
 useEffect(() => {
  if (chatbot && messages.length === 0) {
   setMessages([
    {
     id: "welcome",
     role: "assistant",
     content: chatbot.welcomeMessage,
     timestamp: new Date(),
    },
   ]);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [chatbot]);

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

 const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!inputMessage.trim() || isSending || !chatbot) return;

  const userMessage: ChatMessage = {
   id: Date.now().toString(),
   role: "user",
   content: inputMessage,
   timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  const messageText = inputMessage;
  setInputMessage("");
  setIsSending(true);

  try {
   // Call the real API
   const response = await createMessageMutation.mutateAsync({
    text: messageText,
    conversationId: chatbot.testConversationId,
    chatbotId: chatbot.id,
   });

   // Store bot response for export
   setBotResponses((prev) => [...prev, response]);

   const botResponse: ChatMessage = {
    id: response.id.toString(),
    role: "assistant",
    content: response.text,
    timestamp: new Date(response.createdAt || new Date()),
    messageData: response,
   };
   setMessages((prev) => [...prev, botResponse]);
  } catch (error) {
   console.error("Error sending message:", error);
   const errorMessage: ChatMessage = {
    id: (Date.now() + 1).toString(),
    role: "assistant",
    content: "Sorry, there was an error processing your message. Please try again.",
    timestamp: new Date(),
   };
   setMessages((prev) => [...prev, errorMessage]);
  } finally {
   setIsSending(false);
  }
 };

 const handleExportResponses = () => {
  const dataStr = JSON.stringify(botResponses, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `chatbot-${chatbotId}-responses-${new Date().toISOString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
 };

 const handleResetChat = () => {
  if (chatbot) {
   setMessages([
    {
     id: "welcome",
     role: "assistant",
     content: chatbot.welcomeMessage,
     timestamp: new Date(),
    },
   ]);
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

   {/* Stats Cards */}
   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card>
     <CardContent className="p-4">
      <div className="flex items-center gap-2">
       <MessageSquare className="w-4 h-4 text-blue-600" />
       <span className="text-sm font-medium">Total Messages</span>
      </div>
      <p className="text-2xl font-bold mt-1">{chatbot.totalMessages.toLocaleString()}</p>
     </CardContent>
    </Card>
    <Card>
     <CardContent className="p-4">
      <div className="flex items-center gap-2">
       <Users className="w-4 h-4 text-green-600" />
       <span className="text-sm font-medium">Total Conversations</span>
      </div>
      <p className="text-2xl font-bold mt-1">{chatbot.totalConversations.toLocaleString()}</p>
     </CardContent>
    </Card>
    <Card>
     <CardContent className="p-4">
      <div className="flex items-center gap-2">
       <TrendingUp className="w-4 h-4 text-yellow-600" />
       <span className="text-sm font-medium">AI Responses</span>
      </div>
      <p className="text-2xl font-bold mt-1">{chatbot.totalAiResponses.toLocaleString()}</p>
     </CardContent>
    </Card>
    <Card>
     <CardContent className="p-4">
      <div className="flex items-center gap-2">
       <BarChart3 className="w-4 h-4 text-purple-600" />
       <span className="text-sm font-medium">Public</span>
      </div>
      <p className="text-2xl font-bold mt-1">{chatbot.isPublic ? "Yes" : "No"}</p>
     </CardContent>
    </Card>
   </div>

   <Tabs defaultValue="overview" className="w-full">
    <TabsList className="grid w-full grid-cols-5">
     <TabsTrigger value="overview">Overview</TabsTrigger>
     <TabsTrigger value="configuration">Configuration</TabsTrigger>
     <TabsTrigger value="test-chat">Test Chat</TabsTrigger>
     <TabsTrigger value="analytics">Analytics</TabsTrigger>
     <TabsTrigger value="conversations">Conversations</TabsTrigger>
    </TabsList>

    <TabsContent value="overview">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
       <CardHeader>
        <CardTitle>Basic Information</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
        <div>
         <p className="text-sm font-medium text-muted-foreground">Title</p>
         <p className="text-base">{chatbot.title}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm font-medium text-muted-foreground">Description</p>
         <p className="text-base">{chatbot.description || "No description"}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm font-medium text-muted-foreground">Welcome Message</p>
         <p className="text-base italic">"{chatbot.welcomeMessage}"</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm font-medium text-muted-foreground">PDF Document</p>
         <a href={chatbot.pdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {chatbot.pdfTitle}
         </a>
        </div>
        <Separator />
        <div className="flex justify-between">
         <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-base">{chatbot.createdAt ? new Date(chatbot.createdAt).toLocaleDateString() : "N/A"}</p>
         </div>
         <div>
          <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
          <p className="text-base">{chatbot.updatedAt ? new Date(chatbot.updatedAt).toLocaleDateString() : "N/A"}</p>
         </div>
        </div>
       </CardContent>
      </Card>

      <Card>
       <CardHeader>
        <CardTitle>Messages & Prompts</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
        <div>
         <p className="text-sm font-medium text-muted-foreground">Welcome Message</p>
         <p className="text-base">{chatbot.welcomeMessage}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm font-medium text-muted-foreground">Suggestion Message</p>
         <p className="text-base">{chatbot.suggestionMessage}</p>
        </div>
        <Separator />
        <div>
         <p className="text-sm font-medium text-muted-foreground">System Prompt</p>
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
         <p className="text-sm font-medium text-muted-foreground">AI Model</p>
         <p className="text-base font-mono">{chatbot.aiModel}</p>
        </div>
        <div>
         <p className="text-sm font-medium text-muted-foreground">Embedding Model</p>
         <p className="text-base font-mono">{chatbot.embeddingModel}</p>
        </div>
        <div>
         <p className="text-sm font-medium text-muted-foreground">Temperature</p>
         <p className="text-base">{chatbot.temperature}</p>
        </div>
        <div>
         <p className="text-sm font-medium text-muted-foreground">Max Tokens</p>
         <p className="text-base">{chatbot.maxTokens}</p>
        </div>
        <div>
         <p className="text-sm font-medium text-muted-foreground">Proposed Model</p>
         <p className="text-base">{chatbot.isProposedModel ? "Yes" : "No"}</p>
        </div>
        <div>
         <p className="text-sm font-medium text-muted-foreground">Public Access</p>
         <p className="text-base">{chatbot.isPublic ? "Yes" : "No"}</p>
        </div>
       </div>
      </CardContent>
     </Card>
    </TabsContent>

    <TabsContent value="test-chat">
     <div className="grid grid-cols-12 gap-4 h-[600px]">
      {/* Chat Area */}
      <Card className={`flex flex-col ${selectedResult ? "col-span-7" : "col-span-12"}`}>
       <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
         <div>
          <CardTitle className="flex items-center gap-2">
           <MessageSquare className="w-5 h-5" />
           Test Chat
          </CardTitle>
          <CardDescription>Test your chatbot as a customer would experience it</CardDescription>
         </div>
         <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportResponses} disabled={botResponses.length === 0}>
           <Download className="w-4 h-4 mr-2" />
           Export ({botResponses.length})
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetChat}>
           Reset Chat
          </Button>
         </div>
        </div>
       </CardHeader>
       <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
         <div className="space-y-4">
          {messages.map((message) => (
           <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
             className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-muted cursor-pointer hover:bg-muted/80"}`}
             onClick={() => {
              if (message.role === "assistant" && message.messageData) {
               setSelectedResult(message.messageData);
              }
             }}
            >
             <p className="text-sm whitespace-pre-wrap">{message.content}</p>
             <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}>
              {message.timestamp.toLocaleTimeString()}
              {message.role === "assistant" && message.messageData && " • Click for details"}
             </p>
            </div>
           </div>
          ))}
          {isSending && (
           <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
             <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
             </div>
            </div>
           </div>
          )}
         </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 flex-shrink-0">
         <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type your message..." disabled={isSending} className="flex-1" />
          <Button type="submit" disabled={isSending || !inputMessage.trim()}>
           <Send className="w-4 h-4" />
          </Button>
         </form>
        </div>
       </CardContent>
      </Card>

      {/* Result Details Panel */}
      {selectedResult && (
       <Card className="col-span-5 overflow-hidden flex flex-col">
        <CardHeader className="flex-shrink-0">
         <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Response Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setSelectedResult(null)}>
           <X className="w-4 h-4" />
          </Button>
         </div>
         <CardDescription>{chatbot?.isProposedModel ? "Proposed Model" : "Baseline Model"} Results</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
         <ScrollArea className="h-full pe-4">
          <div className="space-y-4">
           <div>
            <h4 className="font-semibold mb-2">Query</h4>
            <p className="text-sm bg-muted p-2 rounded">{selectedResult.text}</p>
           </div>

           {selectedResult.results && (
            <>
             <Separator />
             <div>
              <h4 className="font-semibold mb-2">Model Information</h4>
              <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-green-100 text-green-800">{selectedResult.results.status}</Badge>
               </div>
               <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Time:</span>
                <span>{selectedResult.results.processing_time}s</span>
               </div>
               {selectedResult.results.metadata && (
                <div className="flex justify-between">
                 <span className="text-muted-foreground">Model Type:</span>
                 <span className="font-mono text-xs">{selectedResult.results.metadata.model_type}</span>
                </div>
               )}
              </div>
             </div>

             {/* Proposed Model specific fields */}
             {"complexity_analysis" in selectedResult.results && selectedResult.results.complexity_analysis && (
              <>
               <Separator />
               <div>
                <h4 className="font-semibold mb-2">Complexity Analysis</h4>
                <div className="space-y-1 text-sm">
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{selectedResult.results.complexity_analysis.type}</span>
                 </div>
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Score:</span>
                  <span>{selectedResult.results.complexity_analysis.score}</span>
                 </div>
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Word Count:</span>
                  <span>{selectedResult.results.complexity_analysis.word_count}</span>
                 </div>
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Unique Words:</span>
                  <span>{selectedResult.results.complexity_analysis.unique_words}</span>
                 </div>
                </div>
               </div>
              </>
             )}

             {/* Baseline Model specific fields */}
             {"model_approach" in selectedResult.results && (
              <>
               <Separator />
               <div>
                <h4 className="font-semibold mb-2">Model Approach</h4>
                <p className="text-sm">{selectedResult.results.model_approach}</p>
               </div>
              </>
             )}

             {/* Search Results */}
             {selectedResult.results.results && selectedResult.results.results.length > 0 && (
              <>
               <Separator />
               <div>
                <h4 className="font-semibold mb-2">Search Results ({selectedResult.results.results.length})</h4>
                <div className="space-y-2">
                 {selectedResult.results.results.slice(0, 3).map((result, index) => (
                  <div key={index} className="bg-muted p-3 rounded text-sm space-y-1">
                   <div className="flex justify-between items-start">
                    <span className="font-semibold">Rank #{result.rank}</span>
                    {"final_score" in result && <Badge variant="outline">Score: {result.final_score?.toFixed(4)}</Badge>}
                    {"similarity_score" in result && <Badge variant="outline">Similarity: {result.similarity_score?.toFixed(4)}</Badge>}
                   </div>
                   <p className="text-xs line-clamp-2">{result.text}</p>
                  </div>
                 ))}
                </div>
               </div>
              </>
             )}

             {/* GPT Generation */}
             {selectedResult.results.gpt_generation?.answer && (
              <>
               <Separator />
               <div>
                <h4 className="font-semibold mb-2">GPT Generated Answer</h4>
                <p className="text-sm bg-green-50 p-3 rounded border border-green-200">{selectedResult.results.gpt_generation.answer}</p>
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                 <div>Model: {selectedResult.results.gpt_generation.model_used}</div>
                 <div>Tokens: {selectedResult.results.gpt_generation.tokens_used}</div>
                </div>
               </div>
              </>
             )}

             {/* RAGAS Evaluation */}
             {selectedResult.results.ragas_evaluation && (
              <>
               <Separator />
               <div>
                <h4 className="font-semibold mb-2">RAGAS Evaluation</h4>
                <div className="space-y-2">
                 {selectedResult.results.ragas_evaluation.context_relevance !== undefined && (
                  <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Context Relevance:</span>
                   <Badge>{(selectedResult.results.ragas_evaluation.context_relevance * 100).toFixed(1)}%</Badge>
                  </div>
                 )}
                 {selectedResult.results.ragas_evaluation.faithfulness !== undefined && (
                  <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Faithfulness:</span>
                   <Badge>{(selectedResult.results.ragas_evaluation.faithfulness * 100).toFixed(1)}%</Badge>
                  </div>
                 )}
                 {selectedResult.results.ragas_evaluation.answer_relevance !== undefined && (
                  <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Answer Relevance:</span>
                   <Badge>{(selectedResult.results.ragas_evaluation.answer_relevance * 100).toFixed(1)}%</Badge>
                  </div>
                 )}
                 {selectedResult.results.ragas_evaluation.overall_score !== undefined && (
                  <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground font-semibold">Overall Score:</span>
                   <Badge className="bg-blue-100 text-blue-800">{(selectedResult.results.ragas_evaluation.overall_score * 100).toFixed(1)}%</Badge>
                  </div>
                 )}
                </div>
               </div>
              </>
             )}

             {/* Raw JSON */}
             <Separator />
             <div>
              <h4 className="font-semibold mb-2">Raw Response</h4>
              <pre className="text-xs bg-muted p-3 rounded max-h-64 overflow-y-auto whitespace-pre-wrap break-words">{JSON.stringify(selectedResult.results, null, 2)}</pre>
             </div>
            </>
           )}
          </div>
         </ScrollArea>
        </CardContent>
       </Card>
      )}
     </div>
    </TabsContent>

    <TabsContent value="analytics">
     <Card>
      <CardHeader>
       <CardTitle className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Analytics Dashboard
       </CardTitle>
       <CardDescription>Detailed performance metrics and usage statistics</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
       <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
       <p className="text-muted-foreground">Analytics dashboard coming soon. This will show detailed charts and metrics about your chatbot's performance.</p>
      </CardContent>
     </Card>
    </TabsContent>

    <TabsContent value="conversations">
     <Card>
      <CardHeader>
       <CardTitle className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Recent Conversations
       </CardTitle>
       <CardDescription>View and analyze recent chatbot conversations</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
       <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
       <p className="text-muted-foreground">Conversation history coming soon. This will show recent conversations and allow you to analyze interactions.</p>
      </CardContent>
     </Card>
    </TabsContent>
   </Tabs>
  </div>
 );
}
