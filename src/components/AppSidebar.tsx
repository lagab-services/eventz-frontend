"use client";

import * as React from "react";
import {
    IconCalendar,
    IconChartBar, IconCreditCard,
    IconDashboard,
    IconInnerShadowTop,
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
import NavOrg from "@/components/features/org/NavOrg";

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
            title: "Events",
            url: "/events",
            icon: IconCalendar,
        },
        {
            title: "Analytics",
            url: "#",
            icon: IconChartBar,
        },
        {
            title: "Payments",
            url: "#",
            icon: IconCreditCard,
        },
        {
            title: "Notifications",
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
            <NavOrg />
            <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
)
