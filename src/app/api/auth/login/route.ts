
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: Request, res :any) {
    const { email, password } = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const err = await response.json();
        return NextResponse.json(
            { error: err.message || "Invalid credentials" },
            { status: response.status }
        );
    }

    const data = await response.json();


    return NextResponse.json(
        data
    );
}
