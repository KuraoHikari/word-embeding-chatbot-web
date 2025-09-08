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
   "/dashboard": "Project Management & Task Tracking",
   "/users": "User Management",
   "/settings": "Settings",
   "/profile": "Profile",
  };

  return routeTitles[pathname] || "Page";
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
