import { BotIcon } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";
import { RegisterForm } from "@/components/forms/RegisterForm";

interface AuthPageProps {
 mode: "login" | "register"; // Prop to determine which form to display
}

// take props to switch between login and register
export default function AuthPage({ mode }: AuthPageProps) {
 return (
  <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
   <div className="flex w-full max-w-sm flex-col gap-6">
    <a href="#" className="flex items-center gap-2 self-center font-medium">
     <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
      <BotIcon className="size-4" />
     </div>
     Word Embeding Chatbot
    </a>
    {mode === "login" ? <LoginForm /> : <RegisterForm />}
   </div>
  </div>
 );
}
