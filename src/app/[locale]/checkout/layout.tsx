"use client";
import React from 'react';
import {LockKeyhole} from "lucide-react";
import {stepOrder, useCheckoutStore} from "@/lib/store/checkout";
import {NavbarLogo} from "@/components/ui/resizable-navbar";

interface CheckoutLayoutProps {
    children: React.ReactNode
}

const Layout = ({children}: CheckoutLayoutProps) => {
    const { currentStep, isLoading} = useCheckoutStore();
    const totalSteps = stepOrder.length;
    const currentIndex = stepOrder.indexOf(currentStep);
    const progress = ((currentIndex + 1) / totalSteps) * 100;
    return (
        <div className="min-h-screen flex flex-col bg-app2">
            <header
                className="bg-background py-3 flex flex-col md:flex-row items-center justify-between w-full sticky top-0 z-30 border-b">
                <div className="py-1 md:pl-4 mb-1 md:mb-0">
                    <NavbarLogo/>
                </div>
                <div className="flex items-center space-x-2 pl-3 md:pl-0 pr-3">
                    <div
                        className="flex items-center px-3 py-2 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200 rounded">
                        <LockKeyhole className="w-4 h-4"/>
                        <p className="ml-0.75 text-sm text-center md:text-left ">Paiement sécurisé par Stripe
                            <button className="underline hover:text-green-900"> (En savoir
                                plus) </button></p>
                    </div>
                </div>
                {!isLoading &&
                    <div className="absolute left-0 bottom-0 bg-primary h-0.5 transition-[width] duration-500 ease-in-out"
                         style={{ width: `${progress}%` }}
                    ></div>
                }

            </header>
            {children}
        </div>
    );
};

export default Layout;