import {useLocale, useTranslations} from "next-intl";
import LocaleSwitcherSelect from "@/components/layout/LocaleSwitcherSelect";
import {SelectItem} from "@/components/ui/select";
import {routing} from '@/i18n/routing';


const LocaleSwitcher = () => {
    const t = useTranslations('localeSwitcher');
    const locale = useLocale();

    return (
        <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
            {routing.locales.map((cur) => (
                <SelectItem key={cur} value={cur}> {t('locale', {locale: cur})}</SelectItem>
            ))}
        </LocaleSwitcherSelect>
    );
};

export default LocaleSwitcher;