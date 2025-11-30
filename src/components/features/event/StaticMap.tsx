import {cn} from "@/lib/utils";

interface StaticMapProps {
    className?: string;
    address: string;
    latitude: number;
    longitude: number;
}
const StaticMap = ({ address, latitude, longitude , className }: StaticMapProps) => {

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;

    if (!apiKey || !cloudName) {
        console.error("❌ Missing env vars: NEXT_PUBLIC_GOOGLE_MAPS_KEY or NEXT_PUBLIC_CLOUDINARY_NAME");
    }

    const googleStaticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=660x360&markers=${latitude},${longitude}&key=${apiKey}`;


    // Cache via Cloudinary fetch
    const cloudinaryCachedUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/${encodeURIComponent(
        googleStaticMapUrl
    )}`;

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
    )}`;

    return (
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className={cn('inline-block my-3 shadow',className)}>
            <img
                src={cloudinaryCachedUrl}
                alt={`Map of ${address}`}
                className="rounded-md"
            />
        </a>
    );
};

export default StaticMap;