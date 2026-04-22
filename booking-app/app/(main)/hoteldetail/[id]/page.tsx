"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import HotelImage from "@/sections/hotelDetail/hotelimage";
import Availability from "@/sections/hotelDetail/roomavailability";
import Rules from "@/sections/hotelDetail/hotelrule";
import Reviews from "@/sections/hotelDetail/guestreviews";
import { buildingApi } from "@/api/building";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HotelDetail() {
    const t = useTranslations("hotel");
    const params = useParams();
    const id = params.id as string;
    const [building, setBuilding] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchBuilding = () => {
        if (!id) return;
        buildingApi.getBuilding(id)
            .then(res => setBuilding(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBuilding(); }, [id]);

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );
    if (!building) return <div className="p-10 text-center">{t("notFound")}</div>;

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 min-h-screen">
            <div className="bg-white px-3 sm:px-6 py-2 mb-4 mt-15">
                <HotelImage building={building} />
            </div>
            <Availability building={building} />
            <Rules building={building} />
            <Reviews building={building} onReviewAdded={fetchBuilding} />
        </div>
    );
}