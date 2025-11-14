'use client';

import {useParams} from 'next/navigation';
import {Locale} from 'next-intl';
import {ReactNode, useTransition} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import {Globe} from "lucide-react";

interface LocaleSwitcherSelectProps {
    children?: ReactNode;
    defaultValue: string;
    label: string;
    options?: { value: string; label: string }[];
}

const LocaleSwitcherSelect = ({
                                  children,
                                  defaultValue,
                                  label,
                                  options
                              }: LocaleSwitcherSelectProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const params = useParams();

    function onValueChange(nextLocale: string) {
        startTransition(() => {
            router.replace(
                // @ts-expect-error: paramètres actuels toujours valides
                {pathname, params},
                {locale: nextLocale as Locale}
            );
        });
    }

    return (
        <div
            className={cn(
                'relative dark:text-gray-400 w-full',
                isPending && 'opacity-50 transition-opacity cursor-not-allowed'
            )}
        >
            <p className="sr-only">{label}</p>

            <Select
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                disabled={isPending}
            >
                <SelectTrigger className="w-full bg-transparent">
                    <Globe/><SelectValue placeholder={label}/>
                </SelectTrigger>

                <SelectContent>
                    {options
                        ? options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))
                        : children}
                </SelectContent>
            </Select>
        </div>
    );
};

export default LocaleSwitcherSelect;