"use client";
import { useState, useEffect } from "react";
import { Plane, ChevronRight, Luggage, Loader2 } from "lucide-react";
import { FlightType } from "@/types/flight";
import { flightApi } from "@/api/flight";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CABIN_LABELS: Record<string, string> = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First Class",
};

function fmt(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });
}

function fmtDuration(min: number) {
    return `${Math.floor(min / 60)}s ${min % 60}dəq`;
}

function AirlineLogo({ logoUrl, airline }: { logoUrl?: string; airline: string }) {
    const [err, setErr] = useState(false);
    if (logoUrl && !err) {
        return (
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center shrink-0">
                <img src={logoUrl} alt={airline} className="w-full h-full object-contain p-1" onError={() => setErr(true)} />
            </div>
        );
    }
    return (
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Plane size={16} className="text-blue-500" />
        </div>
    );
}

function FlightCard({ flight }: { flight: FlightType }) {
    const router = useRouter();
    const avail = flight.totalSeats - flight.bookedSeats;
    const stopCount = flight.stops?.length ?? 0;

    const handleSelect = () => {
        if (avail === 0) return;
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { toast.error("Rezervasiya üçün daxil olun"); router.push("/signin"); return; }
        const params = new URLSearchParams({
            id: flight._id!,
            airline: flight.airline || "",
            flightNumber: flight.flightNumber || "",
            origin: flight.origin?.code || "",
            originCity: flight.origin?.city || "",
            destination: flight.destination?.code || "",
            destinationCity: flight.destination?.city || "",
            departureTime: flight.departureTime || "",
            arrivalTime: flight.arrivalTime || "",
            cabin: flight.cabin || "",
            price: String(flight.price),
            adults: "1",
            children: "0",
            totalPrice: String(flight.price),
            logoUrl: flight.logoUrl || "",
        });
        router.push(`/checkout/flight?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Airline */}
            <div className="flex items-center gap-3 sm:w-44 shrink-0">
                <AirlineLogo logoUrl={flight.logoUrl} airline={flight.airline} />
                <div className="min-w-0">
                    <p className="font-bold text-[13px] text-gray-800 truncate">{flight.airline}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{flight.flightNumber || ""}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        flight.cabin === "economy" ? "bg-gray-100 text-gray-600"
                        : flight.cabin === "business" ? "bg-violet-50 text-violet-600"
                        : flight.cabin === "first" ? "bg-amber-50 text-amber-600"
                        : "bg-sky-50 text-sky-600"
                    }`}>
                        {CABIN_LABELS[flight.cabin]}
                    </span>
                </div>
            </div>

            {/* Route */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="text-center">
                    <p className="font-bold text-lg text-gray-900">{fmt(flight.departureTime)}</p>
                    <p className="text-xs font-semibold text-gray-500">{flight.origin.code}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[80px]">{flight.origin.city}</p>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1 min-w-[80px]">
                    <p className="text-[10px] text-gray-400">{flight.duration ? fmtDuration(flight.duration) : ""}</p>
                    <div className="flex items-center w-full gap-1">
                        <div className="flex-1 h-px bg-gray-200" />
                        <Plane size={12} className="text-gray-400 shrink-0" />
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <p className={`text-[10px] font-medium ${stopCount === 0 ? "text-emerald-600" : "text-orange-500"}`}>
                        {stopCount === 0 ? "Birbaşa" : stopCount === 1 ? "1 Dayanacaq" : "2+ Dayanacaq"}
                    </p>
                </div>

                <div className="text-center">
                    <p className="font-bold text-lg text-gray-900">{fmt(flight.arrivalTime)}</p>
                    <p className="text-xs font-semibold text-gray-500">{flight.destination.code}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[80px]">{flight.destination.city}</p>
                </div>
            </div>

            {/* Price + book */}
            <div className="sm:text-right flex sm:flex-col flex-row items-center sm:items-end gap-3 sm:gap-1 sm:w-36 shrink-0">
                <div>
                    <p className="text-xl font-bold text-gray-900">${flight.price}</p>
                    <p className="text-[11px] text-gray-400">nəfər başına</p>
                    {flight.baggagePerPax && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-0.5 justify-end mt-0.5">
                            <Luggage size={10} /> {flight.baggagePerPax}
                        </p>
                    )}
                    <p className={`text-[10px] font-medium mt-0.5 ${avail === 0 ? "text-red-500" : avail <= 5 ? "text-orange-500" : "text-emerald-600"}`}>
                        {avail === 0 ? "Dolu" : avail <= 5 ? `Yalnız ${avail} yer qaldı` : `${avail} yer mövcuddur`}
                    </p>
                </div>
                <button
                    disabled={avail === 0}
                    onClick={handleSelect}
                    className={`mt-1 text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1 whitespace-nowrap ${
                        avail > 0
                            ? "bg-[#006ce4] hover:bg-[#0057b8] text-white"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {avail > 0 ? <>Seç <ChevronRight size={13} /></> : "Mövcud deyil"}
                </button>
            </div>
        </div>
    );
}

export default function FlightResults() {
    const [allFlights, setAllFlights] = useState<FlightType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await flightApi.getAll({ page: 1, limit: 100 });
                setAllFlights(data.flights);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#006ce4]" />
            </div>
        );
    }

    if (allFlights.length === 0) return null;

    return (
        <section className="max-w-6xl mx-auto px-4 py-8">
            <p className="text-sm text-gray-600 mb-5">
                <span className="font-bold text-gray-900">{allFlights.length}</span> uçuş tapıldı
            </p>
            <div className="space-y-3">
                {allFlights.map(f => <FlightCard key={f._id} flight={f} />)}
            </div>
        </section>
    );
}
