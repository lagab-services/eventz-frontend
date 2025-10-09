import LoginForm from "@/app/[locale]/(auth)/_components/forms/LoginForm";
import Link from "next/link";
import {getTranslations} from "next-intl/server";

const LoginPage = async () => {
    const t = await getTranslations("auth");
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t("login_title")}</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    {t("login_description")}
                </p>
            </div>
            <LoginForm/>
            <p className="px-8 text-center text-sm text-muted-foreground">
                {t("no_account")} &nbsp;
                <Link
                    href="/register"
                    className="hover:text-brand underline underline-offset-4"
                >
                    {t("sign_up")}
                </Link>.
            </p>
        </div>
    );
};

export default LoginPage;