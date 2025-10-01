import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  Edit,
  Trash2,
  MessageSquare,
  Users,
  TrendingUp,
  Play,
  Pause,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ChatbotDetails {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "training";
  createdAt: string;
  updatedAt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  welcomeMessage: string;
  isPublic: boolean;
  stats: {
    totalMessages: number;
    totalUsers: number;
    avgResponseTime: number;
    successRate: number;
  };
}

// Mock data - replace with actual API call
const mockChatbotDetails: ChatbotDetails = {
  id: "1",
  name: "Customer Support Bot",
  description:
    "Handles customer inquiries and support tickets with advanced natural language processing capabilities",
  status: "active",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-25T14:20:00Z",
  model: "gpt-4-turbo",
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt:
    "You are a helpful customer support assistant. Always be polite, professional, and try to resolve customer issues efficiently.",
  welcomeMessage:
    "Hello! I'm here to help you with any questions or issues you might have. How can I assist you today?",
  isPublic: true,
  stats: {
    totalMessages: 1250,
    totalUsers: 342,
    avgResponseTime: 1.2,
    successRate: 94.5,
  },
};

export default function ChatbotDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState<ChatbotDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChatbot(mockChatbotDetails);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "training":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleStatusToggle = () => {
    if (chatbot) {
      const newStatus = chatbot.status === "active" ? "inactive" : "active";
      setChatbot({ ...chatbot, status: newStatus });
      // Here you would make an API call to update the status
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this chatbot? This action cannot be undone."
      )
    ) {
      // Make API call to delete chatbot
      navigate("/chatbot");
    }
  };

  if (loading) {
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
            <p className="text-muted-foreground mb-4">
              The chatbot you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/chatbot")}>
              Back to Chatbots
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/chatbot")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bot className="w-8 h-8 text-blue-600" />
                {chatbot.name}
              </h1>
              <Badge className={getStatusColor(chatbot.status)}>
                {chatbot.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{chatbot.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleStatusToggle}
            className="flex items-center gap-2"
          >
            {chatbot.status === "active" ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Activate
              </>
            )}
          </Button>
          <Link to={`/chatbot/${chatbot.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
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
            <p className="text-2xl font-bold mt-1">
              {chatbot.stats.totalMessages.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {chatbot.stats.totalUsers.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Avg Response Time</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {chatbot.stats.avgResponseTime}s
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {chatbot.stats.successRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-base">{chatbot.name}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="text-base">{chatbot.description}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Welcome Message
                  </p>
                  <p className="text-base italic">"{chatbot.welcomeMessage}"</p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created
                    </p>
                    <p className="text-base">
                      {new Date(chatbot.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="text-base">
                      {new Date(chatbot.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    AI Model
                  </p>
                  <p className="text-base font-mono">{chatbot.model}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Temperature
                  </p>
                  <p className="text-base">{chatbot.temperature}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Max Tokens
                  </p>
                  <p className="text-base">{chatbot.maxTokens}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Visibility
                  </p>
                  <Badge variant={chatbot.isPublic ? "default" : "secondary"}>
                    {chatbot.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>
                The instructions that guide your chatbot's behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-mono whitespace-pre-wrap">
                  {chatbot.systemPrompt || "No system prompt configured"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Detailed performance metrics and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Analytics dashboard coming soon. This will show detailed charts
                and metrics about your chatbot's performance.
              </p>
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
              <CardDescription>
                View and analyze recent chatbot conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Conversation history coming soon. This will show recent
                conversations and allow you to analyze interactions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
