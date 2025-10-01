import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Bot, Edit, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "training";
  createdAt: string;
  messagesCount: number;
}

// Mock data - replace with actual API call
const mockChatbots: Chatbot[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    status: "active",
    createdAt: "2024-01-15",
    messagesCount: 1250,
  },
  {
    id: "2",
    name: "Product Assistant",
    description: "Helps users navigate product features and documentation",
    status: "training",
    createdAt: "2024-01-20",
    messagesCount: 45,
  },
  {
    id: "3",
    name: "Sales Bot",
    description: "Qualifies leads and schedules sales meetings",
    status: "inactive",
    createdAt: "2024-01-10",
    messagesCount: 892,
  },
];

export default function ChatbotList() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChatbots(mockChatbots);
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
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

      {chatbots.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No chatbots yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first chatbot to get started with AI conversations
            </p>
            <Link to="/chatbot/create">
              <Button>Create Your First Chatbot</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <Card
              key={chatbot.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(chatbot.status)}>
                    {chatbot.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {chatbot.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {chatbot.messagesCount} messages
                  </div>
                  <div>
                    Created {new Date(chatbot.createdAt).toLocaleDateString()}
                  </div>
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
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                >
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
