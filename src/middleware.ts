import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest, NextResponse} from "next/server";
import {generateUuid} from "@/lib/uuid";

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
    // 1️⃣ sessionId logic
    const COOKIE_NAME = "sessionId";
    const COOKIE_MAX_AGE = 60 * 60 * 24;
    const cookieSessionId = req.cookies.get(COOKIE_NAME)?.value;

    //i18n middleware
    const response = intlMiddleware(req) || NextResponse.next();

    if (!cookieSessionId) {
        const sessionId = generateUuid();
        response.cookies.set({
            name: COOKIE_NAME,
            value: sessionId,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            sameSite: "lax",
        });
    } else {

        response.cookies.set({
            name: COOKIE_NAME,
            value: cookieSessionId,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            sameSite: "lax",
        });

    }
    return response;
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};