"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs as ShadcnTabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = {
    title: string;
    value: string;
    content?: string | React.ReactNode;
};

export const CustomTabs = ({
                               tabs: propTabs,
                               containerClassName,
                               activeTabClassName,
                               tabClassName,
                               contentClassName,
                               defaultValue,
                               value,
                               onValueChange,
                           }: {
    tabs: Tab[];
    containerClassName?: string;
    activeTabClassName?: string;
    tabClassName?: string;
    contentClassName?: string;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
}) => {

    const isControlled = value !== undefined && onValueChange !== undefined;
    const currentActiveValue = isControlled ? value : defaultValue || propTabs[0].value;

    return (
        <ShadcnTabs
            value={currentActiveValue}
            onValueChange={(newValue) => {
                if (onValueChange) {
                    onValueChange(newValue);
                }
            }}
            className="w-full"
        >
            <TabsList
                className={cn(
                    "flex flex-row items-center justify-start relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full bg-transparent h-auto p-0 gap-2",
                    containerClassName
                )}
            >
                {propTabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                            "flex-0 relative px-4 py-2 rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                            tabClassName
                        )}
                        style={{
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {currentActiveValue === tab.value && (
                            <motion.div
                                layoutId="clickedbutton"
                                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                className={cn(
                                    "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full",
                                    activeTabClassName
                                )}
                            />
                        )}

                        <span className="relative block text-black dark:text-white z-10">
                            {tab.title}
                        </span>
                    </TabsTrigger>
                ))}
            </TabsList>

            {propTabs.map((tab) => (
                <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className={cn("relative", contentClassName)}
                >
                    {tab.content}
                </TabsContent>
            ))}
        </ShadcnTabs>
    );
};
