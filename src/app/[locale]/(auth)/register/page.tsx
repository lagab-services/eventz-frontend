import RegisterForm from "@/app/[locale]/(auth)/_components/forms/RegisterForm";
import {getTranslations} from "next-intl/server";

const RegisterPage = async () => {
    const t = await getTranslations("auth");

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("register_title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t("register_description")}
                </p>
            </div>
            <RegisterForm/>
        </div>
    );
};

export default RegisterPage;