'use client';

import {useRouter} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {useTranslations} from "next-intl";

const BackButton = () => {
    const router = useRouter();
    const t = useTranslations('common');

    const handleBack = () => {
        router.back();
    };

    return (
        <Button onClick={handleBack} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4"/>
            {t('back')}
        </Button>
    );
};

export default BackButton;