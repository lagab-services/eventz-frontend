import TicketCard from "@/components/features/event/TicketCard";
import {getUserTickets} from "@/actions/ticket.actions";
import {SearchParams} from "@/types";
import {listSearchParams} from "@/lib/listSearchParams";

interface TicketsPageProps {
    searchParams: Promise<SearchParams>;
}

const TicketsPage = async ({searchParams}: TicketsPageProps) => {
    const search_params = await searchParams;
    const searchQuery = listSearchParams.parse(search_params);
    const {data: tickets} = await getUserTickets(searchQuery);
    return (
        <div className="flex flex-col gap-4">
            {tickets && tickets.map((ticket) => (
                <TicketCard key={ticket.ticketId} ticket={ticket}/>
            ))}
        </div>
    );
};

export default TicketsPage;