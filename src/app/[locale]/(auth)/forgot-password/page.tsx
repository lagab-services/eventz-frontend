import ForgotPasswordForm from "@/app/[locale]/(auth)/_components/forms/ForgotPasswordForm";
import {Link} from "@/i18n/navigation";
import {getTranslations} from "next-intl/server";

const ForgoPasswordPage = async () => {
    const t = await getTranslations("auth");
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("forgot_password")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t("forgot_password_description")}
                </p>
            </div>
            <ForgotPasswordForm/>
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

export default ForgoPasswordPage;