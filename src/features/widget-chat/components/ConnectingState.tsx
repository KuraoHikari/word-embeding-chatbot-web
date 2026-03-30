import { Loader2 } from "lucide-react";

export function ConnectingState() {
 return (
  <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
   <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
   <p className="text-sm font-medium text-gray-600">Connecting you to agent…</p>
  </div>
 );
}
