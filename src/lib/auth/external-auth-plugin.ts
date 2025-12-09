import {APIError} from "better-call";
import * as z from "zod";

import {BetterAuthOptions, BetterAuthPlugin, InferUser} from "better-auth";
import {setSessionCookie} from "better-auth/cookies";
import {createAuthEndpoint} from "better-auth/api";

const BACKEND_URL = process.env.BACKEND_URL;

const externalSignInBodySchema = z.object({
    email: z.string(),
    password: z.string(),
    rememberMe: z.boolean().default(false),
});
const externalSignUpBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
});

export const externalAuthPlugin = <O extends BetterAuthOptions>() => {

    return {
        id: "external-sign-in",
        endpoints: {
            // ============================================
            // SIGN IN
            // ============================================
            signInExternal: createAuthEndpoint(
                "/sign-in/external",
                {
                    id: "external-sign-in-plugin",
                    method: "POST",
                    operationId: "externalAuthPlugin",
                    body: externalSignInBodySchema,
                },
                async (ctx): Promise<{
                    redirect: false;
                    token: string;
                    user: InferUser<O>;
                }> => {

                    const {email, password} = ctx.body;

                    // 1️⃣ Call Backend API
                    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({email, password}),
                    });

                    if (!res.ok) {
                        throw new APIError("UNAUTHORIZED", {
                            message: "INVALID_EMAIL_OR_PASSWORD",
                        });
                    }

                    const external = await res.json();

                    if (!external.user || !external.access_token) {
                        throw new APIError("UNAUTHORIZED", {
                            message: "INVALID_REMOTE_RESPONSE",
                        });
                    }

                    const user = {
                        id: external.user.id.toString(),
                        email: external.user.email,
                        name: `${external.user.firstName} ${external.user.lastName}`,
                        emailVerified: external.user.isEmailVerified,
                        createdAt: external.user.createdAt,
                        updatedAt: new Date(),
                        accessToken: external.access_token,
                        organizations: external.organizations,
                        role: "admin"
                    };

                    // 2️⃣ GENERATE JWT SESSION (stateless)
                    const session = await ctx.context.internalAdapter.createSession(
                        external.user.id,
                        ctx.body.rememberMe === false, // isTransient
                    );

                    if (!session) {
                        ctx.context.logger.error("Failed to create session");
                        throw new APIError("UNAUTHORIZED", {
                            message: "FAILED_TO_CREATE_SESSION",
                        });
                    }

                    // 3️⃣ SET COOKIE (if rememberMe=true)
                    await setSessionCookie(
                        ctx,
                        {
                            session,
                            user: user,
                        },
                        ctx.body.rememberMe === false,
                    );

                    return ctx.json({
                        redirect: false,
                        token: session.token,
                        user: user as InferUser<O>,
                    });
                },
            ),
            // ============================================
            // SIGN UP / REGISTER
            // ============================================
            signUpExternal: createAuthEndpoint(
                "/sign-up/external",
                {
                    method: "POST",
                    body: externalSignUpBodySchema,
                },
                async (ctx): Promise<{
                    redirect: false;
                    token: string;
                    user: InferUser<O>;
                }> => {
                    const { email, password, firstName, lastName } = ctx.body;

                    try {
                        // Call Backend API
                        const res = await fetch(`${BACKEND_URL}/register`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email,
                                password,
                                firstName,
                                lastName,
                            }),
                        });

                        if (!res.ok) {
                            const error = await res.json().catch(() => ({}));

                            if (res.status === 409) {
                                throw new APIError("BAD_REQUEST", {
                                    message: "An account with this email already exists",
                                });
                            }

                            throw new APIError("BAD_REQUEST", {
                                message: error.message || "Registration failed",
                            });
                        }

                        const external = await res.json();

                        if (!external.user || !external.access_token) {
                            throw new APIError("INTERNAL_SERVER_ERROR", {
                                message: "Invalid response from authentication server",
                            });
                        }

                        const user = {
                            id: external.user.id.toString(),
                            email: external.user.email,
                            name: `${external.user.firstName} ${external.user.lastName}`,
                            emailVerified: external.user.isEmailVerified,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "admin"
                        };

                        // Create session
                        const session = await ctx.context.internalAdapter.createSession(
                            external.user.id.toString(),
                            false // Not transient for new registrations
                        );

                        if (!session) {
                            ctx.context.logger.error("Failed to create session");
                            throw new APIError("INTERNAL_SERVER_ERROR", {
                                message: "Failed to create session",
                            });
                        }

                        // Set cookie
                        await setSessionCookie(
                            ctx,
                            {
                                session: {
                                    ...session,
                                    accessToken: external.access_token,
                                    refreshToken: external.refresh_token,
                                },
                                user,
                            },
                            false
                        );

                        return ctx.json({
                            redirect: false,
                            token: session.token,
                            user: user as InferUser<O>,
                        });
                    } catch (error) {
                        if (error instanceof APIError) throw error;

                        ctx.context.logger.error("Sign up error:", error);
                        throw new APIError("INTERNAL_SERVER_ERROR", {
                            message: "Registration server error",
                        });
                    }
                }
            ),
        },
    }  satisfies BetterAuthPlugin;
};
