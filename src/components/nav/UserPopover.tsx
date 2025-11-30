"use client";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {BadgeCheck, CircleUserRound, LayoutDashboard, LogOut, Ticket} from "lucide-react";
import Link from "next/link";
import {authClient} from "@/lib/auth/auth-client";

interface UserPopoverProps {
    user: {
        name: string
        email: string
        avatar?: string
    }
}

const UserPopover = ({user}: UserPopoverProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <CircleUserRound size={20} className="rounded-full cursor-pointer"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                        {user.avatar &&
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name}/>
                                <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        }
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <Link href="/dashboard">
                        <DropdownMenuItem>
                            <LayoutDashboard/>
                            Admin
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/account">
                        <DropdownMenuItem>
                            <BadgeCheck/>
                            Account
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/account/tickets">
                        <DropdownMenuItem>
                            <Ticket/>
                            My tickets
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={async () => {
                    await authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                globalThis.location.href = "/sign-in";
                            },
                        },
                    })

                }}>
                    <LogOut/>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserPopover;