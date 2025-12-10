import {NextResponse} from "next/server";
import crypto from "node:crypto";
import {AttendeeService} from "@/services/AttendeeService";

const SECRET = process.env.TICKET_SECRET!;


function validateSignature(ticketId: string, expires: number, sig: string) {
    const base = `${ticketId}:${expires}`;
    const expected = crypto.createHmac("sha256", SECRET).update(base).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);

    const ticketId = searchParams.get("ticket");
    const expires = searchParams.get("expires");
    const sig = searchParams.get("sig");

    if (!ticketId || !expires || !sig) {
        return NextResponse.json({error: "params-missing"}, {status: 400});
    }

    const expiresInt = Number.parseInt(expires, 10);
    if (Date.now() / 1000 > expiresInt) {
        return NextResponse.json({error: "expired"}, {status: 403});
    }

    if (!validateSignature(ticketId, expiresInt, sig)) {
        return NextResponse.json({error: "invalid-signature"}, {status: 403});
    }
    
    const attendeeService = new AttendeeService();
    try {
        console.log("enter");

        const pdfResponse = await attendeeService.downloadTicketFromTicketId(Number.parseInt(ticketId));

        console.log(pdfResponse);
        const pdfBuffer = await pdfResponse.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="ticket-${ticketId}.pdf"`
            }
        });
    } catch {
        return NextResponse.json({error: "pdf-fetch-error"}, {status: 500});
    }
}
