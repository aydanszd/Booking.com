"use client";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Users, Maximize2, Wind, Tag, CreditCard,
    CheckCircle2, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import DateRangePicker from "@/components/DateRangePicker";
import { useTranslations } from "next-intl";

export default function RoomAvailability({ building }: { building: any }) {
    const t = useTranslations("hotel");
    const searchParams = useSearchParams();
    const router = useRouter();
    const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
    const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
    const [qty, setQty] = useState(1);

    const bookedRanges = useMemo(() =>
        (building?.bookedDates || []).map((b: any) => ({
            start: new Date(b.checkIn),
            end: new Date(b.checkOut),
        })),
    [building]);

    const handleBooking = () => {
        if (!checkIn || !checkOut) {
            toast.error(t("selectDates"));
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error(t("signInToBook"));
            router.push("/signin");
            return;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (nights <= 0) {
            toast.error(t("checkInBeforeOut"));
            return;
        }

        const totalPrice = building.pricePerNight * qty * nights;
        const image = building.images?.[0] || "";
        const params = new URLSearchParams({
            type: "building",
            id: building._id,
            title: building.title || "",
            image,
            checkIn,
            checkOut,
            pricePerDay: String(building.pricePerNight),
            totalPrice: String(totalPrice),
            days: String(nights),
        });
        router.push(`/checkout?${params.toString()}`);
    };

    return (
        <div id="availability" className="py-8 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-gray-900">{t("availability")}</h2>
                    <div className="flex items-center gap-1.5 text-[#006ce4] text-sm font-medium cursor-pointer hover:underline">
                        <Tag size={14} /> {t("priceMatchGuarantee")}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm w-full lg:w-80 shrink-0">
                        <DateRangePicker
                            bookedRanges={bookedRanges}
                            startDate={checkIn}
                            endDate={checkOut}
                            onStartChange={setCheckIn}
                            onEndChange={setCheckOut}
                            startLabel={t("checkIn")}
                            endLabel={t("checkOut")}
                        />
                    </div>
                    <div className="flex-1 flex items-center gap-2 border-2 border-[#febb02] rounded-xl px-4 py-3 bg-white h-fit">
                        <Users size={18} className="text-gray-400 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">{t("guests")}</span>
                            <span className="text-sm font-semibold">{t("guestsDefault")}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a3c6e] text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-4 font-bold">{t("roomType")}</th>
                                <th className="px-5 py-4 font-bold text-center">{t("numGuests")}</th>
                                <th className="px-5 py-4 font-bold">{t("pricePerNight")}</th>
                                <th className="px-5 py-4 font-bold">{t("choices")}</th>
                                <th className="px-5 py-4 font-bold">{t("selectRooms")}</th>
                                <th className="px-5 py-4 font-bold">{t("reserve")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[
                                { name: building.title + " " + t("standard"), guests: building.maxGuests || 2, price: building.pricePerNight }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-6">
                                        <p className="text-[#006ce4] font-bold text-base hover:underline cursor-pointer">{row.name}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Maximize2 size={10}/> 25m²</span>
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Wind size={10}/> AC</span>
                                            {building.amenities?.slice(0, 3).map((a: string) => (
                                                <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-6">
                                        <div className="flex justify-center gap-0.5">
                                            {Array.from({ length: row.guests }).map((_, i) => <Users key={i} size={14} className="text-gray-600" />)}
                                        </div>
                                    </td>
                                    <td className="px-5 py-6">
                                        <p className="text-xl font-bold text-gray-900">${row.price}</p>
                                        <p className="text-[10px] text-gray-400">{t("pricePerNight").toLowerCase()}</p>
                                        {checkIn && checkOut && (
                                            <p className="text-xs font-bold text-green-600 mt-1">
                                                Total: ${building.pricePerNight * qty * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*60*60*24)))}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-5 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5 text-[#008009] text-xs font-semibold">
                                                <CheckCircle2 size={14} /> {t("freeCancellation")}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                                                <CreditCard size={14} /> {t("noPrepayment")}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-6">
                                        <select
                                            value={qty}
                                            onChange={e => setQty(Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#006ce4]"
                                        >
                                            {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-5 py-6">
                                        <button
                                            onClick={handleBooking}
                                            className="w-full bg-[#006ce4] hover:bg-[#0055b3] text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            {t("illReserve")}
                                        </button>
                                        <p className="text-[9px] text-gray-400 mt-1.5 text-center flex items-center justify-center gap-1">
                                            <AlertCircle size={10} /> {t("confirmImmediate")}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
