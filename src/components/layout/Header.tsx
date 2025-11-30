import {Button} from "@/components/ui/button";
import {Navbar, NavbarLogo, NavBody} from "@/components/ui/resizable-navbar";

import {ModeToggle} from "@/components/layout/ModeToggle";
import UserPopover from "@/components/nav/UserPopover";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {Link} from "@/i18n/navigation";

const Header = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <Navbar>
            {/* Desktop Navigation */}
            <NavBody>
                <NavbarLogo/>
                {/*<NavItems items={navItems}/>*/}
                <div className="flex items-center gap-4">
                    {session ?
                        <UserPopover user={{
                            name: session.user?.name,
                            email: session.user?.email
                        }}/>
                        :
                        <>
                            <Link href="/sign-in"><Button variant="secondary">Login</Button></Link>
                            <Link href="/register"><Button>Register</Button></Link>
                        </>}
                    <ModeToggle/>
                </div>
            </NavBody>
        </Navbar>
    );
};

export default Header;