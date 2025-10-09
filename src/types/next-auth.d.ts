import {DefaultSession} from "next-auth"
import {DefaultJWT} from "next-auth/src/jwt/types";
import {AdapterUser} from "next-auth/adapters";

declare module "next-auth" {

    interface User {
        fullName: string
        token: { token: string }
            & AdapterUser
    }
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id?: string;
            accessToken?: string;
        } & DefaultSession["user"]
    }

    interface JWT extends DefaultJWT {
        accessToken?: string
    }
}