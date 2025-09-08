import { Outlet } from "react-router-dom";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutHeader } from "./LayoutHeader";

export default function Layout() {
 return (
  <SidebarProvider>
   <SidebarLeft />
   <SidebarInset>
    <LayoutHeader />
    <div className="flex flex-1 flex-col gap-4 p-4">
     {/* This is where your page content will be rendered */}
     <Outlet />
    </div>
   </SidebarInset>
   <SidebarRight />
  </SidebarProvider>
 );
}
