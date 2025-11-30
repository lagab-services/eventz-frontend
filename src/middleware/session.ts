import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {generateUuid} from "@/lib/uuid";

const COOKIE_NAME = "sessionId";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

export function sessionMiddleware(req: NextRequest) {
    const cookieSessionId = req.cookies.get(COOKIE_NAME)?.value;
    const response = NextResponse.next();

    if (cookieSessionId) {
        response.cookies.set({
            name: COOKIE_NAME,
            value: cookieSessionId,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            sameSite: "lax",
        });
        return response;
    }


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

    return response;
}
