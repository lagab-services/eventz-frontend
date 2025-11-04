"use client";

import * as React from "react";
import {
    IconChartBar,
    IconDashboard,
    IconFolder,
    IconInnerShadowTop,
    IconListDetails,
    IconUsers,
} from "@tabler/icons-react";

import NavMain  from "@/components/NavMain";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: IconDashboard,
        },
        {
            title: "Lifecycle",
            url: "#",
            icon: IconListDetails,
        },
        {
            title: "Analytics",
            url: "#",
            icon: IconChartBar,
        },
        {
            title: "Projects",
            url: "#",
            icon: IconFolder,
        },
        {
            title: "Team",
            url: "#",
            icon: IconUsers,
        },
    ],
}

export const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => (
    <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                        <a href="#">
                            <IconInnerShadowTop className="!size-5" />
                            <span className="text-base font-semibold">EventZ</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
            <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
)
