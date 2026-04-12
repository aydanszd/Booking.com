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
        <div id="availability" className="mb-6 scroll-mt-20">
            {/* Section header */}
            <div className="border border-gray-200 rounded-t-lg bg-[#f2f6fa] px-5 py-3 border-b-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-base font-bold text-gray-900">{t("availability")}</h2>
                    <span className="flex items-center gap-1 text-xs text-[#006ce4] font-medium cursor-pointer hover:underline">
                        <Tag size={12} /> {t("priceMatchGuarantee")}
                    </span>
                </div>
            </div>

            {/* Date + Guests row */}
            <div className="border border-t-0 border-gray-200 rounded-b-lg bg-white p-4 mb-0">
                <div className="flex flex-col lg:flex-row lg:items-stretch gap-3 mb-5">
                    <div className="border border-gray-300 rounded-md p-3 w-full lg:w-72 shrink-0 flex items-center">
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
                    <div className="flex items-center gap-2 border border-[#febb02] rounded-md px-4 py-3 bg-white">
                        <Users size={16} className="text-gray-500 shrink-0" />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold leading-none">{t("guests")}</p>
                            <p className="text-sm font-semibold text-gray-800">{t("guestsDefault")}</p>
                        </div>
                    </div>
                </div>

                {/* Room table */}
                <div className="border border-gray-200 rounded-md overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-[#003580] text-white text-xs uppercase tracking-wide">
                                <th className="px-4 py-3 font-bold">{t("roomType")}</th>
                                <th className="px-4 py-3 font-bold text-center">{t("numGuests")}</th>
                                <th className="px-4 py-3 font-bold">{t("pricePerNight")}</th>
                                <th className="px-4 py-3 font-bold">{t("choices")}</th>
                                <th className="px-4 py-3 font-bold">{t("selectRooms")}</th>
                                <th className="px-4 py-3 font-bold">{t("reserve")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[{ name: building.title + " " + t("standard"), guests: building.maxGuests || 2, price: building.pricePerNight }]
                                .map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                                        <td className="px-4 py-4">
                                            <p className="text-[#006ce4] font-bold hover:underline cursor-pointer mb-1.5">{row.name}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                                                    <Maximize2 size={9} /> 25m²
                                                </span>
                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                                                    <Wind size={9} /> AC
                                                </span>
                                                {building.amenities?.slice(0, 2).map((a: string) => (
                                                    <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{a}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-0.5 flex-wrap">
                                                {Array.from({ length: Math.min(row.guests, 4) }).map((_, i) => (
                                                    <Users key={i} size={13} className="text-gray-500" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-lg font-bold text-gray-900">${row.price}</p>
                                            <p className="text-xs text-gray-400">{t("pricePerNight").toLowerCase()}</p>
                                            {checkIn && checkOut && (
                                                <p className="text-xs font-bold text-[#008009] mt-0.5">
                                                    ${building.pricePerNight * qty * Math.max(1,
                                                        Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
                                                    )} total
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[#008009] text-xs font-semibold">
                                                    <CheckCircle2 size={13} /> {t("freeCancellation")}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                    <CreditCard size={13} /> {t("noPrepayment")}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <select
                                                value={qty}
                                                onChange={e => setQty(Number(e.target.value))}
                                                className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#006ce4]"
                                            >
                                                {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={handleBooking}
                                                className="w-full bg-[#006ce4] hover:bg-[#0055b3] text-white font-bold py-2.5 rounded-md text-sm transition-colors"
                                            >
                                                {t("illReserve")}
                                            </button>
                                            <p className="text-[9px] text-gray-400 mt-1 text-center flex items-center justify-center gap-1">
                                                <AlertCircle size={9} /> {t("confirmImmediate")}
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
