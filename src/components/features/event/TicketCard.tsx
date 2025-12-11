"use client";

import {useState} from "react";

import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowDownToLine, Mail, QrCode} from "lucide-react";

import {Ticket} from "@/types/tickets";
import {QRCode} from "@/components/ui/qr-code";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import {formatDateCustom} from "@/lib/dateFormatter";

interface EventTicketCardProps {
    ticket: Ticket;
}

const TicketCard = ({ticket}: EventTicketCardProps) => {

    const [openDrawer, setOpenDrawer] = useState(false);

    const imageUrl = "https://gallery.weezevent.com/574181/sites/newFile_8EbjwaN.jpeg";
    const dateText = `${formatDateCustom(ticket.startDate, 'dd/MM/yyyy')} - ${formatDateCustom(ticket.endDate, 'dd/MM/yyyy')}`;
    const eventAddress = `${ticket.venueName}, ${ticket.venueAddress} ${ticket.venueCity}, ${ticket.venueCountry}`;

    return (
        <>
            <Card className="bg-background">
                <CardContent className="flex flex-col">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <img
                            width={300}
                            height={169}
                            alt={ticket.eventName}
                            src={imageUrl}
                            className="rounded-md"
                        />

                        <div className="flex flex-1 flex-col gap-0.5">
                            <Link className="font-bold" href={`/${ticket.eventUrl}`}>
                                {ticket.eventName}
                            </Link>

                            <p className="text-accent-foreground text-sm font-bold">{dateText}</p>
                            <p className="text-sm">{eventAddress}</p>

                            <div className="mt-1 flex flex-wrap items-center gap-2">

                                <Button onClick={() => setOpenDrawer(true)}>
                                    <QrCode/> My QR
                                </Button>

                                <Badge className="bg-green-200 text-green-900 p-2 px-3">Scanné</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 w-full">
                        <Link href={`/${ticket.eventUrl}`}>
                            <Button className="w-full">
                                <ArrowDownToLine/> Download ticket
                            </Button>
                        </Link>

                        <Button variant="secondary">
                            <Mail/> Contact Organizer
                        </Button>
                    </div>
                </CardFooter>
            </Card>


            {/* ----------- Drawer QR Code ----------- */}
            <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Votre QR Code</DrawerTitle>
                        <DrawerDescription>Montrez ce QR lors de l entrée à l évènement.</DrawerDescription>
                    </DrawerHeader>

                    <div className="flex justify-center pt-6">
                        <QRCode data={ticket.qrCode} robustness="H" className="my-4"/>
                    </div>
                    <div className="flex flex-col justify-center items-center pb-8">
                        <h4 className="font-bold">{ticket.ticketType}</h4>
                        <p className="text-muted-foreground">{ticket.buyerName}</p>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default TicketCard;