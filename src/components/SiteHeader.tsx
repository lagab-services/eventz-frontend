import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {CommandMenu} from "@/app/[locale]/(dashboard)/(admin)/_components/CommandMenu";
import {ModeToggle} from "@/components/layout/ModeToggle";

const SiteHeader = () => {
    return (
        <header className="flex  shrink-0 items-center gap-2 transition-[width,height] ease-linear pt-2 w-full">
            <div className="flex w-full items-center gap-1 px-4 md:pl-1 lg:gap-2 ">
                <SidebarTrigger className="-ml-1 md:hidden" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4 md:hidden"
                />
                <CommandMenu/>
                <div className="ml-auto flex items-center gap-2">
                    <ModeToggle/>
                </div>
            </div>
        </header>
    );
};

export default SiteHeader;