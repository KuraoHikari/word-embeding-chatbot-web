import { useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function LayoutHeader() {
 const location = useLocation();

 // Function to generate breadcrumb title based on current route
 const getBreadcrumbTitle = (pathname: string) => {
  const routeTitles: Record<string, string> = {
   "/": "Dashboard",

   "/chatbot": "Chatbot",
   "/chatbot/create": "Create Chatbot",
   "/chatbot/:id": "Chatbot Details",
   "/chatbot/:id/edit": "Edit Chatbot",
   "/compare/upload": "Compare Results — Upload",
   "/compare/dashboard": "Compare Results — Dashboard",
   //contact
   "/contact": "Contact",
   //conversation
   "/conversation": "Conversation",
   //Messages
   "/messages": "Messages",
   //settings
  };

  // Check exact match first
  if (routeTitles[pathname]) return routeTitles[pathname];

  // Handle dynamic compare routes
  if (pathname.match(/\/chatbot\/\d+\/compare\/upload/)) return "Chatbot / Compare Results / Upload";
  if (pathname.match(/\/chatbot\/\d+\/compare\/dashboard/)) return "Chatbot / Compare Results / Dashboard";
  if (pathname.match(/\/chatbot\/\d+\/edit/)) return "Edit Chatbot";
  if (pathname.match(/\/chatbot\/\d+/)) return "Chatbot Details";

  return "Page";
 };

 return (
  <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b">
   <div className="flex flex-1 items-center gap-2 px-3">
    <SidebarTrigger />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <Breadcrumb>
     <BreadcrumbList>
      <BreadcrumbItem>
       <BreadcrumbPage className="line-clamp-1">{getBreadcrumbTitle(location.pathname)}</BreadcrumbPage>
      </BreadcrumbItem>
     </BreadcrumbList>
    </Breadcrumb>
   </div>
  </header>
 );
}
