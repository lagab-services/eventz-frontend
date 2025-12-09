import { betterAuth } from "better-auth";
import {externalAuthPlugin} from "@/lib/auth/external-auth-plugin";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // On gère ça via l'API externe
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 24 * 60 * 60, // 24 hours cache duration
            strategy: "jwt", // can be "jwt" or "compact"
            refreshCache: true, // Enable stateless refresh
        },
    },
    account: {
        storeStateStrategy: "cookie",
        storeAccountCookie: true, // Store account data after OAuth flow in a cookie (useful for database-less flows)
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    user:{
        additionalFields: {
            accessToken: {
                type: "string",
                input: false
            },
            organizations: {
                type: "json",
                input: false,
            },
            role: {
                type: "string",
                input: false,
            },
        }
    },
    plugins: [
        externalAuthPlugin(),
    ],
});