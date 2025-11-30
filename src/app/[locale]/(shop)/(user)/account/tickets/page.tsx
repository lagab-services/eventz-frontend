
import TicketCard from "@/components/features/event/TicketCard";
import {Ticket} from "@/types/tickets";

const TicketsPage = () => {
    const ticket: Ticket = {
        eventName: "Soirée Networking Lille - Édition Spéciale",
        surtitle: "Lagab Creative",
        subtitle: "Afterwork Pro",
        startDate: "2025-10-17T23:59:00",
        endDate: "2025-10-18T06:00:00",
        venueName: "Salle Trévise",
        venueAddress: "84 Rue de Trévise",
        venueCity: "Lille",
        venueCountry: "France",
        buyerName: "Ladislas Gabriel",
        ticketType: "VIP",
        ticketNumber: "A74293",
        qrCode: "base64string",
        barcodeNumber: "01928371623",
        organizerName: "Lagab Creative Services",
        organizerPhone: "+33 6 01 02 03 04",
        organizerEmail: "contact@lagab.com",
        organizerWebsite: "https://lagab.com",
        orderNumber: "CMD-89273",
        orderDate: "2025-09-21T14:22:00",
        ticketId: "TICK-29387",
        price: 15,
    };
    return (
        <div className="flex flex-col gap-4">
            <TicketCard ticket={ticket}/>
            <TicketCard ticket={ticket}/>
            <TicketCard ticket={ticket}/>
        </div>
    );
};

export default TicketsPage;