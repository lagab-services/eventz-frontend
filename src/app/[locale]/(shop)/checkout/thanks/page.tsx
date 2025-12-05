import OrderConfirmationCard from "../_components/OrderConfirmationCard";
import {notFound} from "next/navigation";

const ThanksPage = async ({searchParams}: { searchParams: { session_id?: string } }) => {
    const {session_id} = await searchParams;
    if(!session_id) notFound();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
           <OrderConfirmationCard sessionId={session_id}/>
        </div>
    );
};

export default ThanksPage;