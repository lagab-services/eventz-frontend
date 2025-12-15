import React, {ReactNode} from 'react';
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Link from "next/link";

const TicketsLayout = ({children}: { children: ReactNode }) => {
    const tabs = [
        {
            name: 'Upcoming',
            value: 'upcoming',
            url: 'account/tickets/',
        },
        {
            name: 'Past',
            value: 'past',
            url: 'account/tickets/past',
        }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">My tickets</h1>
            <Tabs defaultValue='upcoming' className='gap-4 mb-2'>
                <TabsList className='bg-transparent rounded-none p-0 w-full justify-start'>
                    {tabs.map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className='data-[state=active]:bg-transparent! data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none flex-none'
                        >
                            <Link href={`/${tab.url}`}>{tab.name}</Link>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <div className="p-3">
                {children}
            </div>

        </div>
    );
};

export default TicketsLayout;