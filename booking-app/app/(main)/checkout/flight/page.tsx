import { BASE } from '@/utils/imageUrl'
"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";
import bookingApi from "@/api/booking";
import { useTranslations } from "next-intl";
import PassengerFields from "@/components/flightCheckout/PassengerFields";
import Receipt from "@/components/flightCheckout/Receipt";
import PassengerCountSelector from "@/components/flightCheckout/PassengerCountSelector";
import PaymentForm from "@/components/flightCheckout/PaymentForm";
import FlightSummaryCard from "@/components/flightCheckout/FlightSummaryCard";
import CheckoutBreadcrumb from "@/components/flightCheckout/CheckoutBreadcrumb";

function FlightCheckoutInner() {
    const t = useTranslations("checkout");
    const router = useRouter();
    const sp = useSearchParams();

    const flightId   = sp.get("id") || "";
    const airline    = sp.get("airline") || "";
    const flightNum  = sp.get("flightNumber") || "";
    const origin     = sp.get("origin") || "";
    const originCity = sp.get("originCity") || "";
    const dest       = sp.get("destination") || "";
    const destCity   = sp.get("destinationCity") || "";
    const depTime    = sp.get("departureTime") || "";
    const arrTime    = sp.get("arrivalTime") || "";
    const cabin      = sp.get("cabin") || "";
    const price      = Number(sp.get("price") || "0");
    const logoUrl    = sp.get("logoUrl") || "";

    const [adults, setAdults]     = useState(Number(sp.get("adults") || "1"));
    const [children, setChildren] = useState(Number(sp.get("children") || "0"));
    const totalPassengers = adults + children;
    const totalPrice = price * totalPassengers;

    const logoSrc = logoUrl
        ? (logoUrl.startsWith("http") ? logoUrl : `${BASE}${logoUrl}`)
        : "";

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

    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry]         = useState("");
    const [cvv, setCvv]               = useState("");
    const [loading, setLoading]       = useState(false);
    const [receipt, setReceipt]       = useState<any>(null);

    const updatePassenger = (i: number, field: "fullName" | "idNumber", val: string) => {
        setPassengerData(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        for (let i = 0; i < passengerData.length; i++) {
            if (!passengerData[i].fullName.trim()) { toast.error(t("passengerNameRequired", { num: i + 1 })); return; }
            if (!passengerData[i].idNumber.trim()) { toast.error(t("passengerIdRequired", { num: i + 1 })); return; }
        }
        if (cardNumber.replace(/\s/g, "").length !== 16) { toast.error(t("cardRequired")); return; }
        if (expiry.length < 5) { toast.error(t("expiryRequired")); return; }
        if (cvv.length < 3) { toast.error(t("cvvRequired")); return; }

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { toast.error(t("signInRequired")); router.push("/signin"); return; }

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
            toast.error(err.response?.data?.message || err.message || t("bookingFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            {receipt && <Receipt data={receipt} onClose={() => router.push("/my-bookings")} />}

            <div className="max-w-5xl mx-auto">
                <CheckoutBreadcrumb />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <PassengerCountSelector
                            adults={adults}
                            children={children}
                            totalPrice={totalPrice}
                            onAdultsChange={v => { setAdults(v); adjustPassengers(v, children); }}
                            onChildrenChange={v => { setChildren(v); adjustPassengers(adults, v); }}
                        />

                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-gray-900">{t("passengerInfo")}</h2>
                                    <p className="text-xs text-gray-400 font-medium">{children > 0 ? t("adultsChildrenCount", { adults, children }) : t("adultsCount", { count: adults })}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {Array.from({ length: adults }, (_, i) => (
                                    <PassengerFields key={`a${i}`} index={i} type="adult" data={passengerData[i]} onChange={(f, v) => updatePassenger(i, f, v)} />
                                ))}
                                {Array.from({ length: children }, (_, i) => (
                                    <PassengerFields key={`c${i}`} index={i} type="child" data={passengerData[adults + i]} onChange={(f, v) => updatePassenger(adults + i, f, v)} />
                                ))}
                            </div>
                        </div>

                        <PaymentForm
                            cardNumber={cardNumber}
                            expiry={expiry}
                            cvv={cvv}
                            totalPrice={totalPrice}
                            loading={loading}
                            onCardNumberChange={setCardNumber}
                            onExpiryChange={setExpiry}
                            onCvvChange={setCvv}
                        />
                    </form>

                    <FlightSummaryCard
                        airline={airline}
                        flightNum={flightNum}
                        cabin={cabin}
                        logoSrc={logoSrc}
                        origin={origin}
                        originCity={originCity}
                        dest={dest}
                        destCity={destCity}
                        depTime={depTime}
                        arrTime={arrTime}
                        adults={adults}
                        children={children}
                        price={price}
                        totalPrice={totalPrice}
                    />
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
