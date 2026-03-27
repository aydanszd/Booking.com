"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import HotelImage from "@/sections/hoterdetail/hotelimage";
import Availability from "@/sections/hoterdetail/roomavailability";
import Rules from "@/sections/hoterdetail/hotelrule";
import Reviews from "@/sections/hoterdetail/guestreviews";
import api from "@/api/building";
import { Loader2 } from "lucide-react";

export default function HotelDetail() {
    const params = useParams();
    const id = params.id as string;
    const [building, setBuilding] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchBuilding = () => {
        if (!id) return;
        api.getBuilding(id)
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
    if (!building) return <div className="p-10 text-center">Hotel not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4">
            <HotelImage building={building} />
            <Availability building={building} />
            <Rules building={building} />
            <Reviews building={building} onReviewAdded={fetchBuilding} />
        </div>
    );
}