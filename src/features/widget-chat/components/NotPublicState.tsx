import { AlertTriangle } from "lucide-react";

export function NotPublicState() {
 return (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
   <div className="mx-4 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
     <AlertTriangle className="h-7 w-7 text-amber-600" />
    </div>
    <h2 className="mb-2 text-lg font-semibold text-gray-900">Not Available</h2>
    <p className="text-sm text-gray-500">This chatbot is not available publicly. Please contact the administrator.</p>
   </div>
  </div>
 );
}
