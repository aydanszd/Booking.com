"use client";
import { useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Plane, User, CreditCard, Lock, Shield, CheckCircle2,
    ChevronRight, Loader2, Download, ArrowRight, Users,
} from "lucide-react";
import { toast } from "sonner";
import bookingApi from "@/api/booking";

const BASE = "http://localhost:5000";

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
function fmtDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("az-AZ", { day: "numeric", month: "long", year: "numeric" });
}
function fmtCard(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function fmtExpiry(val: string) {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

// ─── Receipt ──────────────────────────────────────────────────────────────────
function Receipt({ data, onClose }: { data: any; onClose: () => void }) {
    const receiptRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (typeof window === "undefined") return;
        try {
            const jsPDF = (await import("jspdf")).default;
            const QRCode = (await import("qrcode")).default;
            const doc = new jsPDF({ unit: "mm", format: "a4" });
            const W = 210;
            const H = 297;
            const P = 16; // page padding

            // ── helpers ─────────────────────────────────────────
            const navy = () => doc.setTextColor(11, 35, 82);
            const blue = () => doc.setTextColor(0, 103, 218);
            const gray = () => doc.setTextColor(120, 135, 155);
            const white = () => doc.setTextColor(255, 255, 255);
            const bold = (sz: number) => { doc.setFont("helvetica", "bold"); doc.setFontSize(sz); };
            const normal = (sz: number) => { doc.setFont("helvetica", "normal"); doc.setFontSize(sz); };

            // ════════════════════════════════════════════════════
            // 1. PAGE BACKGROUND
            // ════════════════════════════════════════════════════
            doc.setFillColor(244, 247, 252);
            doc.rect(0, 0, W, H, "F");

            // ════════════════════════════════════════════════════
            // 2. HEADER  (navy block)
            // ════════════════════════════════════════════════════
            doc.setFillColor(11, 35, 82);
            doc.rect(0, 0, W, 46, "F");
            // blue bottom stripe
            doc.setFillColor(0, 103, 218);
            doc.rect(0, 42, W, 4, "F");

            // logo circle
            const cx = P + 11, cy = 22, cr = 11;
            doc.setFillColor(255, 255, 255);
            doc.circle(cx, cy, cr, "F");
            bold(18); blue();
            doc.text("B", cx, cy + 5.5, { align: "center" });

            // brand name
            bold(18); white();
            doc.text("BOOKING.COM", cx + cr + 5, cy - 1);
            normal(7.5);
            doc.setTextColor(160, 193, 255);
            doc.text("E-TICKET  /  ELECTRONIC BOARDING PASS", cx + cr + 5, cy + 6);

            // booking ref (right side)
            doc.setTextColor(160, 193, 255);
            normal(7);
            doc.text("BOOKING REFERENCE", W - P, 13, { align: "right" });
            bold(13); white();
            doc.text(data.bookingId, W - P, 22, { align: "right" });
            normal(7.5);
            doc.setTextColor(160, 193, 255);
            doc.text(new Date().toLocaleDateString("en-GB"), W - P, 30, { align: "right" });

            // ════════════════════════════════════════════════════
            // 3. ROUTE CARD
            // ════════════════════════════════════════════════════
            let y = 54;
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(P, y, W - P * 2, 72, 5, 5, "F");
            doc.setDrawColor(215, 228, 248);
            doc.setLineWidth(0.35);
            doc.roundedRect(P, y, W - P * 2, 72, 5, 5, "S");

            // airline + flight info strip
            bold(10); navy();
            doc.text(data.airline.toUpperCase(), P + 8, y + 11);
            normal(7.5); gray();
            const infoStr = `${data.flightNumber}   |   ${CABIN_LABELS[data.cabin] || data.cabin}   |   ${fmtDate(data.departureTime)}`;
            doc.text(infoStr, P + 8, y + 18);

            // divider
            doc.setDrawColor(228, 236, 250);
            doc.setLineWidth(0.3);
            doc.line(P + 8, y + 22, W - P - 8, y + 22);

            const midX = W / 2;
            const rowY = y + 40;

            // FROM block
            gray(); normal(7.5);
            doc.text("DEPARTURE", P + 8, rowY - 12);
            bold(30); navy();
            doc.text(data.origin, P + 8, rowY + 3);
            normal(8); gray();
            doc.text(data.originCity, P + 8, rowY + 10);
            bold(12); blue();
            doc.text(fmt(data.departureTime), P + 8, rowY + 20);

            // center arrow (drawn with lines, no unicode)
            doc.setDrawColor(200, 218, 245);
            doc.setLineWidth(0.6);
            doc.line(P + 50, rowY - 2, midX - 12, rowY - 2);
            doc.line(midX + 12, rowY - 2, W - P - 50, rowY - 2);
            // arrowhead pointing right
            doc.setFillColor(0, 103, 218);
            doc.triangle(midX + 6, rowY - 6, midX + 6, rowY + 2, midX + 13, rowY - 2, "F");
            // small circle left of arrow
            doc.setFillColor(200, 218, 245);
            doc.circle(P + 48, rowY - 2, 2, "F");

            // TO block
            gray(); normal(7.5);
            doc.text("ARRIVAL", W - P - 8, rowY - 12, { align: "right" });
            bold(30); navy();
            doc.text(data.destination, W - P - 8, rowY + 3, { align: "right" });
            normal(8); gray();
            doc.text(data.destinationCity, W - P - 8, rowY + 10, { align: "right" });
            bold(12); blue();
            doc.text(fmt(data.arrivalTime), W - P - 8, rowY + 20, { align: "right" });

            // ════════════════════════════════════════════════════
            // 4. DASHED SEPARATOR  (no unicode)
            // ════════════════════════════════════════════════════
            y += 82;
            // left notch circle
            doc.setFillColor(244, 247, 252);
            doc.circle(P, y + 1, 4, "F");
            // right notch circle
            doc.circle(W - P, y + 1, 4, "F");
            // dashed line
            doc.setDrawColor(200, 215, 235);
            doc.setLineWidth(0.5);
            doc.setLineDashPattern([3, 3], 0);
            doc.line(P + 5, y + 1, W - P - 5, y + 1);
            doc.setLineDashPattern([], 0);
            y += 10;

            // ════════════════════════════════════════════════════
            // 5. PASSENGERS TABLE
            // ════════════════════════════════════════════════════
            // section label
            bold(8); navy();
            doc.text("PASSENGERS", P, y + 6);
            // count badge
            doc.setFillColor(234, 242, 255);
            doc.roundedRect(P + 30, y + 1, 18, 7, 2, 2, "F");
            bold(7); blue();
            doc.text(`${data.passengers.length} pax`, P + 39, y + 6, { align: "center" });

            y += 12;
            // header
            doc.setFillColor(11, 35, 82);
            doc.roundedRect(P, y, W - P * 2, 8, 2, 2, "F");
            bold(7.5); white();
            doc.text("No", P + 5, y + 5.5);
            doc.text("FULL NAME", P + 16, y + 5.5);
            doc.text("CATEGORY", P + 94, y + 5.5);
            doc.text("ID / PASSPORT", W - P - 4, y + 5.5, { align: "right" });
            y += 8;

            data.passengers.forEach((p: any, i: number) => {
                doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 255 : 255);
                doc.rect(P, y, W - P * 2, 10, "F");
                // index
                bold(8); navy();
                doc.text(`${i + 1}`, P + 5, y + 7);
                // name
                normal(9);
                doc.setTextColor(28, 38, 54);
                doc.text(p.fullName || "-", P + 16, y + 7);
                // category pill
                const isChild = p.type === "child";
                doc.setFillColor(isChild ? 255 : 234, isChild ? 242 : 242, isChild ? 234 : 255);
                doc.roundedRect(P + 94, y + 2, isChild ? 12 : 14, 6, 2, 2, "F");
                bold(6.5);
                doc.setTextColor(isChild ? 180 : 0, isChild ? 80 : 85, isChild ? 0 : 200);
                doc.text(isChild ? "CHILD" : "ADULT", P + 94 + (isChild ? 6 : 7), y + 6.5, { align: "center" });
                // id
                normal(8); gray();
                doc.text(p.idNumber || "-", W - P - 4, y + 7, { align: "right" });
                // bottom border
                doc.setDrawColor(228, 235, 250);
                doc.setLineWidth(0.2);
                doc.line(P, y + 10, W - P, y + 10);
                y += 10;
            });

            // ════════════════════════════════════════════════════
            // 6. PAYMENT CARD
            // ════════════════════════════════════════════════════
            y += 8;
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(P, y, W - P * 2, 26, 4, 4, "F");
            doc.setDrawColor(215, 228, 248);
            doc.setLineWidth(0.35);
            doc.roundedRect(P, y, W - P * 2, 26, 4, 4, "S");

            normal(8); gray();
            doc.text(`${data.passengers.length} passenger  x  $${Math.round(data.totalPrice / data.passengers.length)}`, P + 8, y + 10);
            bold(9); navy();
            doc.text("TOTAL PAYMENT", P + 8, y + 19);

            // total badge
            doc.setFillColor(11, 35, 82);
            doc.roundedRect(W - P - 38, y + 7, 34, 12, 3, 3, "F");
            bold(13); white();
            doc.text(`$${data.totalPrice}`, W - P - 21, y + 16.5, { align: "center" });

            // ════════════════════════════════════════════════════
            // 7. QR CODE
            // ════════════════════════════════════════════════════
            y += 34;
            try {
                const qrContent = `${data.bookingId}|${data.flightNumber}|${data.origin}-${data.destination}|${fmtDate(data.departureTime)}`;
                const qrUrl = await QRCode.toDataURL(qrContent, { width: 256, margin: 1, color: { dark: "#0b2352", light: "#ffffff" } });
                const qrSize = 30;
                const qrX = W / 2 - qrSize / 2;
                // card around qr
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(qrX - 6, y - 3, qrSize + 12, qrSize + 14, 4, 4, "F");
                doc.setDrawColor(215, 228, 248);
                doc.setLineWidth(0.3);
                doc.roundedRect(qrX - 6, y - 3, qrSize + 12, qrSize + 14, 4, 4, "S");
                doc.addImage(qrUrl, "PNG", qrX, y, qrSize, qrSize);
                normal(6.5); gray();
                doc.text("Scan to verify booking", W / 2, y + qrSize + 7, { align: "center" });
            } catch (_) { /* skip if qr fails */ }

            // ════════════════════════════════════════════════════
            // 8. FOOTER
            // ════════════════════════════════════════════════════
            doc.setFillColor(11, 35, 82);
            doc.rect(0, H - 14, W, 14, "F");
            normal(7); doc.setTextColor(155, 185, 230);
            doc.text("This ticket is an official booking document. Please carry a valid ID at all times.", W / 2, H - 8, { align: "center" });
            doc.text("Booking.com  |  Support 7/24  |  www.booking.com", W / 2, H - 3, { align: "center" });

            doc.save(`ticket-${data.bookingId}.pdf`);
        } catch (err) {
            console.error("PDF error:", err);
            toast.error("PDF yaradılarkən xəta baş verdi");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
                {/* Header */}
                <div className="bg-blue-600 rounded-t-3xl px-8 py-7 text-white text-center">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 size={28} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black">Rezervasiya Təsdiqləndi!</h2>
                    <p className="text-blue-100 text-sm mt-1 font-medium">Biletiniz hazırdır</p>
                    <p className="text-blue-200 text-xs mt-1">№ {data.bookingId}</p>
                </div>

                <div className="p-8 space-y-5" ref={receiptRef}>
                    {/* Flight summary */}
                    <div className="bg-blue-50 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Plane size={16} className="text-blue-600" />
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{data.airline} · {data.flightNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-3xl font-black text-gray-900">{fmt(data.departureTime)}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1">{data.origin} · {data.originCity}</p>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1">
                                    <div className="w-10 h-px bg-gray-300" />
                                    <Plane size={14} className="text-blue-500" />
                                    <div className="w-10 h-px bg-gray-300" />
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold">{fmtDate(data.departureTime)}</span>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-gray-900">{fmt(data.arrivalTime)}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1">{data.destination} · {data.destinationCity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Passengers */}
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Users size={13} /> Sərnişinlər ({data.passengers.length} nəfər)
                        </h3>
                        <div className="space-y-2">
                            {data.passengers.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                                    <div>
                                        <p className="text-sm font-black text-gray-800">{p.fullName}</p>
                                        <p className="text-xs text-gray-400 font-medium">{p.type === "child" ? "Uşaq" : "Böyük"}</p>
                                    </div>
                                    <p className="text-xs font-black text-gray-500">Ş/V: {p.idNumber}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-blue-600 rounded-2xl px-6 py-4 flex items-center justify-between">
                        <span className="text-blue-100 text-sm font-bold">Ümumi ödəniş</span>
                        <span className="text-white text-2xl font-black">${data.totalPrice}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex flex-col gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl transition-all"
                    >
                        <Download size={18} /> PDF Yüklə
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 font-black py-3.5 rounded-2xl transition-all"
                    >
                        Rezervasiyalarıma Get <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Passenger Form ───────────────────────────────────────────────────────────
function PassengerFields({ index, type, data, onChange }: {
    index: number;
    type: "adult" | "child";
    data: { fullName: string; idNumber: string };
    onChange: (field: "fullName" | "idNumber", val: string) => void;
}) {
    return (
        <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">{index + 1}</span>
                </div>
                <span className="text-sm font-black text-gray-700">
                    {type === "adult" ? `Böyük ${index + 1}` : `Uşaq ${index + 1}`}
                </span>
                <span className="text-[10px] text-gray-400 font-medium ml-1">
                    {type === "adult" ? "(12+ yaş)" : "(2–11 yaş)"}
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Ad Soyad</label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={e => onChange("fullName", e.target.value)}
                        placeholder="Məs: Əli Həsənov"
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors bg-white"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Şəxsiyyət / Pasport №</label>
                    <input
                        type="text"
                        value={data.idNumber}
                        onChange={e => onChange("idNumber", e.target.value)}
                        placeholder="AZE12345678"
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors bg-white"
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Inner Page ───────────────────────────────────────────────────────────────
function FlightCheckoutInner() {
    const router = useRouter();
    const sp = useSearchParams();

    const flightId    = sp.get("id") || "";
    const airline     = sp.get("airline") || "";
    const flightNum   = sp.get("flightNumber") || "";
    const origin      = sp.get("origin") || "";
    const originCity  = sp.get("originCity") || "";
    const dest        = sp.get("destination") || "";
    const destCity    = sp.get("destinationCity") || "";
    const depTime     = sp.get("departureTime") || "";
    const arrTime     = sp.get("arrivalTime") || "";
    const cabin       = sp.get("cabin") || "";
    const price       = Number(sp.get("price") || "0");
    const logoUrl     = sp.get("logoUrl") || "";

    const [adults, setAdults]     = useState(Number(sp.get("adults") || "1"));
    const [children, setChildren] = useState(Number(sp.get("children") || "0"));
    const totalPassengers = adults + children;
    const totalPrice  = price * totalPassengers;

    const logoSrc = logoUrl
        ? (logoUrl.startsWith("http") ? logoUrl : `${BASE}${logoUrl}`)
        : "";

    // Passenger data — resize when counts change
    const [passengerData, setPassengerData] = useState<{ fullName: string; idNumber: string }[]>(
        Array.from({ length: totalPassengers }, () => ({ fullName: "", idNumber: "" }))
    );

    const adjustPassengers = (newAdults: number, newChildren: number) => {
        const total = newAdults + newChildren;
        setPassengerData(prev => {
            if (total > prev.length) return [...prev, ...Array.from({ length: total - prev.length }, () => ({ fullName: "", idNumber: "" }))];
            return prev.slice(0, total);
        });
    };

    // Payment
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry]         = useState("");
    const [cvv, setCvv]               = useState("");

    const [loading, setLoading]   = useState(false);
    const [receipt, setReceipt]   = useState<any>(null);

    const updatePassenger = (i: number, field: "fullName" | "idNumber", val: string) => {
        setPassengerData(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        for (let i = 0; i < passengerData.length; i++) {
            if (!passengerData[i].fullName.trim()) { toast.error(`${i + 1}. sərnişinin adını daxil edin`); return; }
            if (!passengerData[i].idNumber.trim()) { toast.error(`${i + 1}. sərnişinin Ş/V nömrəsini daxil edin`); return; }
        }
        if (cardNumber.replace(/\s/g, "").length !== 16) { toast.error("Kart nömrəsini tam daxil edin"); return; }
        if (expiry.length < 5) { toast.error("Son istifadə tarixini daxil edin"); return; }
        if (cvv.length < 3) { toast.error("CVV kodunu daxil edin"); return; }

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { toast.error("Rezervasiya üçün daxil olun"); router.push("/signin"); return; }

        try {
            setLoading(true);
            const res = await bookingApi.createBooking({
                type: "flight",
                flight: flightId,
                passengers: totalPassengers,
                totalPrice,
                guests: { adults, children },
            });

            const bookingId = (res as any).data?._id?.slice(-8).toUpperCase() || Math.random().toString(36).slice(2, 10).toUpperCase();

            setReceipt({
                bookingId,
                airline, flightNumber: flightNum,
                origin, originCity,
                destination: dest, destinationCity: destCity,
                departureTime: depTime, arrivalTime: arrTime,
                cabin,
                totalPrice,
                passengers: passengerData.map((p, i) => ({
                    ...p,
                    type: i < adults ? "adult" : "child",
                })),
            });
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || "Rezervasiya uğursuz oldu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            {receipt && (
                <Receipt
                    data={receipt}
                    onClose={() => router.push("/my-bookings")}
                />
            )}

            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-semibold uppercase tracking-widest">
                    <span className="text-blue-600">Uçuşlar</span>
                    <ChevronRight size={12} />
                    <span className="text-blue-600">Seçim</span>
                    <ChevronRight size={12} />
                    <span className="text-gray-700">Ödəniş</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

                    {/* ── Left: Form ── */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Passenger count selector */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <Users size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-gray-900">Sərnişin sayı</h2>
                                    <p className="text-xs text-gray-400 font-medium">Cəmi: {totalPassengers} nəfər · ${totalPrice}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Böyük", sub: "12+ yaş", value: adults, min: 1, set: (v: number) => { setAdults(v); adjustPassengers(v, children); } },
                                    { label: "Uşaq", sub: "2–11 yaş", value: children, min: 0, set: (v: number) => { setChildren(v); adjustPassengers(adults, v); } },
                                ].map(({ label, sub, value, min, set }) => (
                                    <div key={label} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                        <div>
                                            <p className="text-sm font-black text-gray-800">{label}</p>
                                            <p className="text-[10px] text-gray-400">{sub}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => set(Math.max(min, value - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-lg transition-colors">−</button>
                                            <span className="w-5 text-center text-sm font-black text-gray-900">{value}</span>
                                            <button type="button" onClick={() => set(value + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-lg transition-colors">+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Passenger fields */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-gray-900">Sərnişin məlumatları</h2>
                                    <p className="text-xs text-gray-400 font-medium">{adults} böyük{children > 0 ? `, ${children} uşaq` : ""}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {Array.from({ length: adults }, (_, i) => (
                                    <PassengerFields
                                        key={`a${i}`}
                                        index={i}
                                        type="adult"
                                        data={passengerData[i]}
                                        onChange={(f, v) => updatePassenger(i, f, v)}
                                    />
                                ))}
                                {Array.from({ length: children }, (_, i) => (
                                    <PassengerFields
                                        key={`c${i}`}
                                        index={i}
                                        type="child"
                                        data={passengerData[adults + i]}
                                        onChange={(f, v) => updatePassenger(adults + i, f, v)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <CreditCard size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-gray-900">Ödəniş məlumatları</h2>
                                    <p className="text-xs text-gray-400 font-medium">Tam məbləğ — ${totalPrice}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Kart nömrəsi</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={e => setCardNumber(fmtCard(e.target.value))}
                                            placeholder="0000 0000 0000 0000"
                                            inputMode="numeric"
                                            className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors tracking-widest"
                                        />
                                        <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Son tarix</label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={e => setExpiry(fmtExpiry(e.target.value))}
                                            placeholder="MM/YY"
                                            inputMode="numeric"
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors tracking-widest"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">CVV</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={cvv}
                                                onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                placeholder="•••"
                                                inputMode="numeric"
                                                className="w-full px-4 py-3 pr-10 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                                            />
                                            <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-2xl text-base transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <><Loader2 size={20} className="animate-spin" /> Emal olunur...</>
                                : <><Lock size={16} /> ${totalPrice} Ödə və Bilet Al</>
                            }
                        </button>

                        <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Shield size={12} /> SSL Şifrəli</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Təhlükəsiz</span>
                            <span className="flex items-center gap-1"><Lock size={12} /> Qorunur</span>
                        </div>
                    </form>

                    {/* ── Right: Summary ── */}
                    <div className="sticky top-6 space-y-4">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                            {/* Airline header */}
                            <div className="bg-blue-600 px-6 py-5 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    {logoSrc ? (
                                        <img src={logoSrc} alt={airline} className="w-10 h-10 rounded-xl object-cover bg-white" />
                                    ) : (
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                            <Plane size={18} className="text-white" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-black text-lg">{airline}</p>
                                        <p className="text-blue-200 text-xs">{flightNum} · {CABIN_LABELS[cabin] || cabin}</p>
                                    </div>
                                </div>
                                {/* Route */}
                                <div className="flex items-center justify-between">
                                    <div className="text-center">
                                        <p className="text-3xl font-black">{fmt(depTime)}</p>
                                        <p className="text-blue-200 text-xs mt-1">{origin} · {originCity}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1">
                                            <div className="w-8 h-px bg-blue-300" />
                                            <Plane size={14} className="text-blue-200" />
                                            <div className="w-8 h-px bg-blue-300" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-black">{fmt(arrTime)}</p>
                                        <p className="text-blue-200 text-xs mt-1">{dest} · {destCity}</p>
                                    </div>
                                </div>
                                <p className="text-center text-blue-200 text-xs mt-3">{fmtDate(depTime)}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Passenger summary */}
                                <div className="space-y-2">
                                    {adults > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-medium">{adults} Böyük × ${price}</span>
                                            <span className="font-bold text-gray-800">${price * adults}</span>
                                        </div>
                                    )}
                                    {children > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-medium">{children} Uşaq × ${price}</span>
                                            <span className="font-bold text-gray-800">${price * children}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="border-t-2 border-dashed border-gray-100 pt-4">
                                    <div className="bg-blue-600 rounded-2xl p-4 text-white text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Ümumi ödəniş</p>
                                        <p className="text-3xl font-black">${totalPrice}</p>
                                        <p className="text-blue-200 text-xs mt-1">{totalPassengers} sərnişin · Tam məbləğ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FlightCheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        }>
            <FlightCheckoutInner />
        </Suspense>
    );
}
