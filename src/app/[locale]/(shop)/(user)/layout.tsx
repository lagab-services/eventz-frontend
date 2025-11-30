import React, {ReactNode} from 'react';
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarHeader, SidebarMenu, SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import {Link} from "@/i18n/navigation";
import {ArrowLeft, LogOut} from "lucide-react";
import {NavLink} from "@/types/nav";
import Header from "@/components/layout/Header";

const data: NavLink[] = [
    {
        title: 'Account',
        url: '/account',
    },
    {
        title: 'Tickets',
        url: '/account/tickets',
    },
    {
        title: 'Notifications',
        url: '/account/notifications',
    },
];


const UserLayout = ({children}: { children: ReactNode }) => {
    return (
        <div className="bg-sidebar">
            <nav className="container mx-auto max-w-7xl">
                <Header/>
            </nav>
            <div className="container max-w-7xl mx-auto md:pt-10">
                <SidebarProvider style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }>
                    <Sidebar variant="inset" className="relative">
                        <SidebarHeader><Link href="#"
                                             className="flex gap-1 font-semibold ml-2 text-sm hover:underline mt-3 md:mt-1"><ArrowLeft/><span>Back</span></Link></SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroup>
                                    <SidebarMenu>
                                        {data.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <Link href={item.url} title={item.title}>
                                                    <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
                                                        {item.icon && <item.icon/>}
                                                        <span>{item.title}</span>
                                                    </SidebarMenuButton>
                                                </Link>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroup>
                                <SidebarGroup>
                                    <SidebarMenuItem className="flex items-center gap-2">
                                        <SidebarMenuButton
                                            tooltip="Quick Create"
                                            className="text-destructive hover:text-destructive cursor-pointer"
                                        >
                                            <LogOut/>
                                            <span>Log out</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarGroup>

                            </SidebarGroup>
                            <SidebarGroup/>
                        </SidebarContent>
                        <SidebarFooter/>
                    </Sidebar>
                    <main className="p-4 flex-1 max-w-3xl">
                        <div className="flex justify-end">
                            <SidebarTrigger className="md:hidden mb-2"/>
                        </div>

                        {children}
                    </main>
                </SidebarProvider>

            </div>
        </div>
    );
};

export default UserLayout;