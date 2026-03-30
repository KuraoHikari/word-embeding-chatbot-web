import { AlertTriangle, RotateCcw } from "lucide-react";
import { useWidgetChatStore } from "../store";

export function ErrorState() {
 const errorMessage = useWidgetChatStore((s) => s.errorMessage);

 const handleReload = () => {
  window.location.reload();
 };

 return (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
   <div className="mx-4 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
     <AlertTriangle className="h-7 w-7 text-red-600" />
    </div>
    <h2 className="mb-2 text-lg font-semibold text-gray-900">Connection Lost</h2>
    <p className="mb-6 text-sm text-gray-500">{errorMessage || "Something went wrong. Please refresh the page."}</p>
    <button
     type="button"
     onClick={handleReload}
     className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
     <RotateCcw className="h-4 w-4" />
     Reload
    </button>
   </div>
  </div>
 );
}
