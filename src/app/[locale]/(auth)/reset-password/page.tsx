import ResetPasswordForm from "@/app/[locale]/(auth)/_components/forms/ResetPasswordForm";
import {getTranslations} from "next-intl/server";

const ResetPasswordPage = async () => {
    const t = await getTranslations("auth");
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("reset_password")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t("reset_password_description")}
                </p>
            </div>
            <ResetPasswordForm />
        </>
    );
};

export default ResetPasswordPage;