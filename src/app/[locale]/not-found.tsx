import React from 'react';
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import {getTranslations} from "next-intl/server";
import BackButton from "@/components/nav/BackButton";

const NotFound = async () => {
    const t = await getTranslations('notFound');
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <h1 className="text-center text-3xl font-bold tracking-tight text-neutral-800 md:text-8xl dark:text-neutral-100"
                >404</h1>
                <h2 className="text-center text-md md:text-2xl font-bold tracking-tight text-neutral-800  dark:text-neutral-100 uppercase"
                >{t('title')} </h2>
                <p className="text-center text-sm">{t('subtitle')}</p>
                <p className="mx-auto mt-4 text-sm max-w-lg text-center text-neutral-600 dark:text-neutral-400">{t('description')}</p>

                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:flex-row">
                        <BackButton/>
                        <Link href={"/"}><Button>{t('backHome')}</Button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;