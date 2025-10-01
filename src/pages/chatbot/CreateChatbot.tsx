import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Upload, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreateChatbotForm {
  name: string;
  description: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  welcomeMessage: string;
  isPublic: boolean;
}

export default function CreateChatbot() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateChatbotForm>({
    name: "",
    description: "",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: "",
    welcomeMessage: "Hello! How can I help you today?",
    isPublic: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate back to chatbot list
      navigate("/chatbot");
    } catch (error) {
      console.error("Error creating chatbot:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateChatbotForm,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/chatbot")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-600" />
            Create New Chatbot
          </h1>
          <p className="text-muted-foreground">
            Configure your AI chatbot with custom settings and behavior
          </p>
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
                <CardDescription>
                  Set up the basic details of your chatbot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Chatbot Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter chatbot name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your chatbot does"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Input
                    id="welcomeMessage"
                    placeholder="First message users will see"
                    value={formData.welcomeMessage}
                    onChange={(e) =>
                      handleInputChange("welcomeMessage", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPublic", checked)
                    }
                  />
                  <Label htmlFor="isPublic">Make chatbot public</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior">
            <Card>
              <CardHeader>
                <CardTitle>Behavior Settings</CardTitle>
                <CardDescription>
                  Define how your chatbot should behave and respond
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="Define the chatbot's role, personality, and instructions"
                    value={formData.systemPrompt}
                    onChange={(e) =>
                      handleInputChange("systemPrompt", e.target.value)
                    }
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    This prompt will guide your chatbot's behavior and responses
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Training Data</Label>
                  <Card className="border-dashed border-2 hover:border-blue-300 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Click to upload documents or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, TXT, DOCX up to 10MB
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Fine-tune your chatbot's AI model parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select
                    value={formData.model}
                    onValueChange={(value) => handleInputChange("model", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">
                        GPT-3.5 Turbo
                      </SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">
                    Temperature: {formData.temperature}
                  </Label>
                  <input
                    type="range"
                    id="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) =>
                      handleInputChange(
                        "temperature",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Lower values make responses more focused, higher values more
                    creative
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="100"
                    max="4000"
                    value={formData.maxTokens}
                    onChange={(e) =>
                      handleInputChange("maxTokens", parseInt(e.target.value))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum length of chatbot responses
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/chatbot")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !formData.name}>
            {loading ? "Creating..." : "Create Chatbot"}
          </Button>
        </div>
      </form>
    </div>
  );
}
