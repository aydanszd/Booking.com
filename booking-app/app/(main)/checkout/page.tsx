"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    CreditCard, User, Shield, ChevronRight, Loader2,
    Car, Building2, Plane, CalendarDays, Lock, CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import bookingApi from "@/api/booking";

const BASE = "http://localhost:5000";

function fmtDate(s: string) {
    if (!s) return "—";
    const d = new Date(s);
    return d.toLocaleDateString("az-AZ", { day: "numeric", month: "long", year: "numeric" });
}

function fmtCard(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function fmtExpiry(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
}

function CheckoutInner() {
    const router = useRouter();
    const sp = useSearchParams();

    const type = sp.get("type") || "car";
    const itemId = sp.get("id") || "";
    const title = sp.get("title") || "Rezervasiya";
    const image = sp.get("image") || "";
    const pickUp = sp.get("pickUp") || "";
    const dropOff = sp.get("dropOff") || "";
    const checkIn = sp.get("checkIn") || "";
    const checkOut = sp.get("checkOut") || "";
    const totalPrice = Number(sp.get("totalPrice") || "0");
    const pricePerDay = Number(sp.get("pricePerDay") || "0");
    const days = Number(sp.get("days") || "1");
    const deposit = Math.ceil(totalPrice * 0.3);

    const startDate = pickUp || checkIn;
    const endDate = dropOff || checkOut;
    const startLabel = type === "car" ? "Alış tarixi" : "Giriş tarixi";
    const endLabel = type === "car" ? "İade tarixi" : "Çıxış tarixi";

    // Form state
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);

    const imgSrc = image
        ? image.startsWith("http") ? image : `${BASE}/uploads/${image}`
        : "";

    const TypeIcon = type === "car" ? Car : type === "flight" ? Plane : Building2;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!fullName.trim()) { toast.error("Ad soyad daxil edin"); return; }
        if (!age || Number(age) < 18 || Number(age) > 100) { toast.error("Yaşınızı düzgün daxil edin (18+)"); return; }
        if (!idNumber.trim()) { toast.error("Şəxsiyyət vəsiqəsi nömrəsini daxil edin"); return; }
        const rawCard = cardNumber.replace(/\s/g, "");
        if (rawCard.length !== 16) { toast.error("Kart nömrəsini tam daxil edin (16 rəqəm)"); return; }
        if (expiry.length < 5) { toast.error("Son istifadə tarixini daxil edin (MM/YY)"); return; }
        if (cvv.length < 3) { toast.error("CVV kodunu daxil edin"); return; }

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { toast.error("Rezervasiya üçün daxil olun"); router.push("/signin"); return; }

        try {
            setLoading(true);
            const data: any = {
                type,
                totalPrice,
                guests: { adults: 1, children: 0 },
            };
            if (type === "car") { data.car = itemId; data.pickUp = pickUp; data.dropOff = dropOff; }
            else if (type === "building") { data.building = itemId; data.checkIn = checkIn; data.checkOut = checkOut; }
            else if (type === "flight") { data.flight = itemId; data.passengers = 1; }

            await bookingApi.createBooking(data);
            toast.success("Rezervasiya uğurla tamamlandı! 🎉");
            router.push("/my-bookings");
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || "Rezervasiya uğursuz oldu");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-semibold uppercase tracking-widest">
                    <span className="text-blue-600">Seçim</span>
                    <ChevronRight size={12} />
                    <span className="text-blue-600">Detallar</span>
                    <ChevronRight size={12} />
                    <span className="text-gray-700">Ödəniş</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

                    {/* ── Left: Form ── */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Personal info */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-gray-900">Şəxsi məlumatlar</h2>
                                    <p className="text-xs text-gray-400 font-medium">Rezervasiya sahibinin məlumatları</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Ad Soyad
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="Məs: Əli Həsənov"
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Yaş
                                    </label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={e => setAge(e.target.value)}
                                        placeholder="25"
                                        min={18}
                                        max={100}
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Şəxsiyyət vəsiqəsi / Pasport №
                                    </label>
                                    <input
                                        type="text"
                                        value={idNumber}
                                        onChange={e => setIdNumber(e.target.value)}
                                        placeholder="AZE12345678"
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment info */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <CreditCard size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-gray-900">Ödəniş məlumatları</h2>
                                    <p className="text-xs text-gray-400 font-medium">Kart məlumatlarınız şifrələnərək qorunur</p>
                                </div>
                            </div>

                            {/* Deposit banner */}
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-3">
                                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-black text-amber-800">İndi yalnız 30% ödəyin</p>
                                    <p className="text-xs text-amber-600 font-medium mt-0.5">
                                        Qalan <strong>${totalPrice - deposit}</strong> ({Math.round((1 - deposit / totalPrice) * 100)}%) avtomobili {type === "car" ? "aldığınız" : "giriş"} zaman ödənilir.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Kart nömrəsi
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={e => setCardNumber(fmtCard(e.target.value))}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors tracking-widest"
                                            inputMode="numeric"
                                        />
                                        <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            Son istifadə tarixi
                                        </label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={e => setExpiry(fmtExpiry(e.target.value))}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors tracking-widest"
                                            inputMode="numeric"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            CVV
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={cvv}
                                                onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                placeholder="•••"
                                                className="w-full px-4 py-3 pr-10 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                                                inputMode="numeric"
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
                                ? <><Loader2 size={20} className="animate-spin" /> Rezervasiya edilir...</>
                                : <><Lock size={16} /> ${deposit} ödə və rezervasiya et</>
                            }
                        </button>

                        <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Shield size={12} /> SSL Şifrəli</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Təhlükəsiz ödəniş</span>
                            <span className="flex items-center gap-1"><Lock size={12} /> Məlumatlarınız qorunur</span>
                        </div>
                    </form>

                    {/* ── Right: Summary ── */}
                    <div className="space-y-4 sticky top-6">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                            {/* Image */}
                            <div className="h-44 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
                                {imgSrc ? (
                                    <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <TypeIcon size={48} className="text-blue-200" />
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3">
                                    <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-gray-700 shadow">
                                        <TypeIcon size={12} />
                                        {type === "car" ? "Avtomobil" : type === "flight" ? "Uçuş" : "Otel"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <h3 className="text-lg font-black text-gray-900 leading-tight">{title}</h3>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-2xl p-3">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                                            <CalendarDays size={10} /> {startLabel}
                                        </div>
                                        <p className="text-sm font-black text-gray-800">{fmtDate(startDate)}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-3">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">
                                            <CalendarDays size={10} /> {endLabel}
                                        </div>
                                        <p className="text-sm font-black text-gray-800">{fmtDate(endDate)}</p>
                                    </div>
                                </div>

                                {/* Price breakdown */}
                                <div className="space-y-2 text-sm pt-2 border-t border-gray-100">
                                    {pricePerDay > 0 && (
                                        <div className="flex justify-between text-gray-500 font-medium">
                                            <span>${pricePerDay} × {days} {type === "building" ? "gecə" : "gün"}</span>
                                            <span>${totalPrice}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Əsas sığorta</span>
                                        <span className="text-green-600 font-bold">Daxil</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="border-t-2 border-dashed border-gray-100 pt-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Ümumi məbləğ</span>
                                        <span className="text-2xl font-black text-gray-900">${totalPrice}</span>
                                    </div>

                                    {/* Deposit highlight */}
                                    <div className="bg-blue-600 rounded-2xl p-4 text-white">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">İndi ödəniləcək (30%)</p>
                                        <p className="text-3xl font-black leading-none">${deposit}</p>
                                        <p className="text-xs text-blue-200 mt-1.5 font-medium">
                                            Qalan ${totalPrice - deposit} — {type === "car" ? "alış" : "giriş"} zamanı
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                            <p className="text-xs font-black text-gray-700 mb-1">Yardım lazımdır?</p>
                            <p className="text-xs text-gray-400 font-medium">7/24 dəstək xidmətimiz hazırdır.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        }>
            <CheckoutInner />
        </Suspense>
    );
}
