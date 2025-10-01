import * as React from "react";
import {
  AudioWaveform,
  Blocks,
  BotMessageSquare,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  PlusSquareIcon,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";

import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/store/authStore";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Chatbots",
      url: "/chatbot",
      icon: BotMessageSquare,
    },
    {
      title: "Create Chatbot",
      url: "/chatbot/create",
      icon: PlusSquareIcon,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
};

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    //logic to redirect to login or show a message
    //navigate to "/login";

    return null; // or a loading indicator, or a redirect to login
  }

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavUser user={user} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
