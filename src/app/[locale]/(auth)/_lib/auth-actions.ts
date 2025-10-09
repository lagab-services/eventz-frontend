import {toast} from "sonner";

import {
    RegisterFormValues,
    ResetPasswordFormValues
} from "@/app/[locale]/(auth)/_lib/validations";

export interface ForgotPasswordData {
    email: string;
}

export interface AuthMessages {
    success: {
        title: string;
        description: string;
    };
    error: string;
}

export const forgotPasswordAction = async (
    data: ForgotPasswordData,
    messages: AuthMessages
): Promise<boolean> => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: data.email}),
        });

        if (response.ok) {
            toast.success(messages.success.title, {
                description: messages.success.description
            });
            return true;
        } else {
            toast.error(messages.error);
            return false;
        }
    } catch (error) {
        toast.error(messages.error);
        return false;
    }
};


export const resetPassword = async (values: ResetPasswordFormValues,
                                    messages: AuthMessages) => {
    try {
        // Assuming an async reset password function
        console.log(values)
        toast.success(messages.success.title, {
            description: messages.success.description
        });
    } catch (error) {
        console.error('Error resetting password', error)
        toast.error(messages.error);
    }
};

export const registerUser = async (values: RegisterFormValues,
                                   messages: AuthMessages) => {
    try {
        // Assuming an async reset password function
        console.log(values)
        toast.success(messages.success.title, {
            description: messages.success.description
        });
    } catch (error) {
        console.error('Error register user', error)
        toast.error(messages.error);
    }
};