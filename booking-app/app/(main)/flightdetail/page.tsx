"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { flightApi } from "@/api/flight";
import { FlightType } from "@/types/flight";
import {
    Plane, Loader2, ChevronRight, Luggage,
    ArrowLeft, Users, Calendar, MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const CABIN_LABELS: Record<string, string> = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First Class",
};

function fmt(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

function AirlineLogo({ logoUrl, airline }: { logoUrl?: string; airline: string }) {
    const [err, setErr] = useState(false);
    if (logoUrl && !err) {
        return (
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center shrink-0">
                <img src={logoUrl} alt={airline} className="w-full h-full object-contain p-1" onError={() => setErr(true)} />
            </div>
        );
    }
    return (
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Plane size={18} className="text-blue-500" />
        </div>
    );
}

function FlightCard({ flight, adults, children }: { flight: FlightType; adults: number; children: number }) {
    const t = useTranslations("flights");
    const router = useRouter();
    const avail = flight.totalSeats - flight.bookedSeats;
    const stopCount = flight.stops?.length ?? 0;
    const totalPassengers = adults + children;
    const totalPrice = flight.price * totalPassengers;

    const fmtDuration = (min: number) => t("durationFmt", { h: Math.floor(min / 60), m: min % 60 });

    const handleSelect = () => {
        if (avail < totalPassengers) return;
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { toast.error(t("signInToBook")); router.push("/signin"); return; }
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
            adults: String(adults),
            children: String(children),
            totalPrice: String(totalPrice),
            logoUrl: flight.logoUrl || "",
        });
        router.push(`/checkout/flight?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center group">
            {/* Airline */}
            <div className="flex items-center gap-3 sm:w-48 shrink-0">
                <AirlineLogo logoUrl={flight.logoUrl} airline={flight.airline} />
                <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate">{flight.airline}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{flight.flightNumber || ""}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        flight.cabin === "economy" ? "bg-gray-100 text-gray-600"
                        : flight.cabin === "business" ? "bg-violet-50 text-violet-600"
                        : flight.cabin === "first" ? "bg-amber-50 text-amber-600"
                        : "bg-sky-50 text-sky-600"
                    }`}>
                        {CABIN_LABELS[flight.cabin] || flight.cabin}
                    </span>
                </div>
            </div>

            {/* Route */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="text-center min-w-17.5">
                    <p className="font-black text-xl text-gray-900">{fmt(flight.departureTime)}</p>
                    <p className="text-xs font-bold text-gray-500">{flight.origin?.code}</p>
                    <p className="text-[10px] text-gray-400 truncate">{flight.origin?.city}</p>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1 min-w-22.5">
                    <p className="text-[10px] text-gray-400">{flight.duration ? fmtDuration(flight.duration) : ""}</p>
                    <div className="flex items-center w-full gap-1">
                        <div className="flex-1 h-px bg-gray-200" />
                        <Plane size={13} className="text-[#006ce4] shrink-0" />
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <p className={`text-[10px] font-semibold ${stopCount === 0 ? "text-emerald-600" : "text-orange-500"}`}>
                        {stopCount === 0 ? t("direct") : stopCount === 1 ? t("oneStop") : t("twoPlus")}
                    </p>
                </div>

                <div className="text-center min-w-17.5">
                    <p className="font-black text-xl text-gray-900">{fmt(flight.arrivalTime)}</p>
                    <p className="text-xs font-bold text-gray-500">{flight.destination?.code}</p>
                    <p className="text-[10px] text-gray-400 truncate">{flight.destination?.city}</p>
                </div>
            </div>

            {/* Price + book */}
            <div className="sm:text-right flex sm:flex-col flex-row items-center sm:items-end gap-3 sm:gap-1 sm:w-40 shrink-0">
                <div>
                    <p className="text-2xl font-black text-gray-900">${flight.price}</p>
                    <p className="text-[11px] text-gray-400">{t("perPerson")}</p>
                    {totalPassengers > 1 && (
                        <p className="text-xs font-bold text-[#006ce4] mt-0.5">
                            {t("total", { amount: totalPrice })}
                        </p>
                    )}
                    {flight.baggagePerPax && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-0.5 justify-end mt-0.5">
                            <Luggage size={10} /> {flight.baggagePerPax}
                        </p>
                    )}
                    <p className={`text-[10px] font-semibold mt-0.5 ${
                        avail === 0 ? "text-red-500"
                        : avail < totalPassengers ? "text-red-500"
                        : avail <= 5 ? "text-orange-500"
                        : "text-emerald-600"
                    }`}>
                        {avail === 0 ? t("full")
                        : avail < totalPassengers ? t("notEnoughSeats", { count: avail })
                        : avail <= 5 ? t("seatsLeft", { count: avail })
                        : t("seatsAvailable", { count: avail })}
                    </p>
                </div>
                <button
                    disabled={avail < totalPassengers}
                    onClick={handleSelect}
                    className={`mt-1 text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        avail >= totalPassengers
                            ? "bg-[#006ce4] hover:bg-[#0057b8] text-white shadow-md shadow-blue-100 group-hover:shadow-lg"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {avail >= totalPassengers ? <>{t("select")} <ChevronRight size={13} /></> : t("notAvailable")}
                </button>
            </div>
        </div>
    );
}

function FlightDetailInner() {
    const t = useTranslations("flights");
    const sp = useSearchParams();
    const router = useRouter();

    const from = sp.get("from") || "";
    const to = sp.get("to") || "";
    const adults = Number(sp.get("adults") || "1");
    const children = Number(sp.get("children") || "0");
    const date = sp.get("date") || "";

    const [flights, setFlights] = useState<FlightType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await flightApi.getAll({
                    page: 1,
                    limit: 100,
                    origin: from || undefined,
                    destination: to || undefined,
                });
                setFlights(data.flights);
            } catch {
                toast.error(t("searchingError"));
            } finally {
                setLoading(false);
            }
        })();
    }, [from, to]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#003b95] text-white py-6 px-4">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} /> {t("back")}
                    </button>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-blue-300" />
                            <span className="font-bold text-lg">
                                {from || t("allOption")} → {to || t("allOption")}
                            </span>
                        </div>
                        {date && (
                            <div className="flex items-center gap-1.5 text-blue-200 text-sm">
                                <Calendar size={14} />
                                <span>{fmtDate(date)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-blue-200 text-sm">
                            <Users size={14} />
                            <span>{children > 0 ? t("adultsChildrenLabel", { adults, children }) : `${adults} ${t("adultsLabel")}`}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 size={36} className="animate-spin text-[#006ce4]" />
                        <p className="text-gray-500 font-medium text-sm">{t("loadingFlights")}</p>
                    </div>
                ) : flights.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plane size={28} className="text-blue-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 mb-2">{t("noFlights")}</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            {from && to
                                ? t("noRouteFlights", { from, to })
                                : t("noMatchingFlights")}
                        </p>
                        <button
                            onClick={() => router.push("/flights")}
                            className="bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
                        >
                            {t("searchAgain")}
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-4">
                            <span className="font-bold text-gray-900">{t("flightsCount", { count: flights.length })}</span>
                        </p>
                        <div className="space-y-3">
                            {flights.map(f => (
                                <FlightCard key={f._id} flight={f} adults={adults} children={children} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function FlightDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={36} className="animate-spin text-[#006ce4]" />
            </div>
        }>
            <FlightDetailInner />
        </Suspense>
    );
}
