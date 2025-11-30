import React from 'react';
import {Event} from "@/types/events";
import {useFormatter, useTranslations} from "next-intl";
import {Calendar, House, MapPin, Ticket} from "lucide-react";
import {Button} from "@/components/ui/button";
import {formatAddress} from "@/lib/formater";
import EventDateText from "@/components/features/event/EventDateText";
import {Link} from "@/i18n/navigation";

interface EventHeaderProps {
    event: Event;
    onTicketsClick: () => void;
}
const EventHeader = ({event, onTicketsClick}: EventHeaderProps) => {
    const t = useTranslations('event');
    const f = useFormatter();
    return (
        <div className="md:h-[500px] flex items-center justify-center overflow-hidden pt-8 md:pt-0">
            <div
                className="absolute w-screen -inset-x-2 top-0 -z-10 h-80 overflow-hidden rounded-t-2xl mask-b-from-60% sm:h-88 md:h-112 lg:-inset-x-4 lg:h-128 blur-3xl">
                <img alt="" src={event.imageUrl}
                     className="absolute inset-0 h-full w-full mask-l-from-60% object-cover object-center opacity-40"/>
                <div
                    className="absolute inset-0 rounded-t-2xl outline-1 -outline-offset-1 outline-gray-950/10 dark:outline-white/10 "></div>
            </div>

            <section
                className="px-4 md:px-0 container md:max-w-6xl flex flex-col gap-5  md:mt-0 md:flex-row-reverse md:items-center md:gap-10 relative z-9">
                <div
                    className="relative w-full overflow-hidden max-h-[calc(100svh-30px)] sm:max-h-[calc(100svh-135px)] aspect-video shadow-shadow md:shadow-3xl flex-1 rounded shadow-md mt-2">
                    <img alt={event.name}
                         decoding="async" data-nimg="fill" className="object-cover object-top rounded-sm h-full"
                         src={event.imageUrl}/>
                </div>
                <div className="md:max-w-[42%] md:flex-1">
                    <div>
                        <h1 data-slot="heading"
                             className="font-title font-black uppercase text-xl md:text-[1.75rem]">{event.name}</h1>
                        <p className="text-sm md:text-xl mb-1 font-light">{event.surtitle}</p>
                        <p className="text-sm mb-4 opacity-90">{event.subtitle}</p>
                        <div className="text-muted-foreground mt-1">{t('eventBy')} <a data-slot="tracked-link"
                                                                           className="text-foreground font-bold"
                                                                           href={`/venues/${event.organizerId}`}>{event.organizerName}</a>
                        </div>
                    </div>
                    <div className="text-muted-foreground mt-2 mb-8 max-w-96">
                        <div className="flex items-center gap-4">
                            <Calendar size={20} />
                            <div className="flex-1 py-2"><EventDateText startDate={event.startDate} endDate={event.endDate} /></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <House size={20} />
                            <div className="flex-1 py-2 text-foreground" >{event.address.name}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin size={20} />
                            <div className="flex-1 text-foreground">{formatAddress(event.address)}</div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <Button className="w-full md:w-1/2" onClick={onTicketsClick}><Ticket /> {t('tickets')}</Button>
                        <Button className="w-full md:w-1/2" variant="secondary" asChild><Link href={`/api/e/live/${event.id}.ics`}><Calendar/> {t('addToCalendar')}</Link></Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EventHeader;