"use client";

import { Calendar, Clapperboard, Home } from "lucide-react";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Videos",
        url: "/admin/videos",
        icon: Clapperboard,
    },
    {
        title: "Billing",
        url: "/admin/billing",
        icon: Calendar,
    }
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg border-b pl-4 pt-6 pb-6">Funny Video</SidebarGroupLabel>
                    <SidebarGroupContent className="pl-2 pt-6 pb-6">
                        <SidebarMenu>

                            {items.map((item) => {
                                const isActive = pathname === item.url ||
                                    (item.url !== "/admin" && pathname?.startsWith(item.url))

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className={cn(
                                            isActive && "bg-purple-600"
                                        )}>
                                            <a href={item.url} className={cn(
                                                "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors ",
                                                isActive
                                                    ? "text-white hover:bg-purple-500 hover:text-white"
                                                    : " hover:bg-gary-500 hover:text-black"
                                            )}>
                                                <item.icon className={cn(
                                                    isActive ? "!size-6 text-white" : "!size-6 hover:text-white"
                                                )} />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
