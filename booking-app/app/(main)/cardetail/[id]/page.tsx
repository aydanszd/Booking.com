"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { carApi } from "@/api/carapi";
import { CarType } from "@/types/car";
import { Loader2, Users, Disc, Fuel, Star, Car, CheckCircle2, Send, CornerDownRight, LogIn } from "lucide-react";
import bookingApi from "@/api/booking";
import { toast } from "sonner";
import DateRangePicker from "@/components/DateRangePicker";
import axios from "axios";
import { useTranslations } from "next-intl";

const BASE = "http://localhost:5000";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button key={n} type="button"
                    onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)} className="transition-transform hover:scale-110">
                    <Star size={20} className={n <= (hovered || value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                </button>
            ))}
        </div>
    );
}

function fmtDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function CarDetailPage() {
    const t = useTranslations("cars");
    const params = useParams();
    const id = params.id as string;
    const searchParams = useSearchParams();
    const router = useRouter();

    const [car, setCar] = useState<CarType | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [pickUp, setPickUp] = useState(searchParams.get("pickUp") || "");
    const [dropOff, setDropOff] = useState(searchParams.get("dropOff") || "");

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reviewScore, setReviewScore] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [reviewError, setReviewError] = useState("");

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (reviewScore === 0) { setReviewError(t("selectStars")); return; }
        if (!reviewComment.trim()) { setReviewError(t("writeReview")); return; }
        setReviewError("");
        const token = localStorage.getItem("token");
        if (!token) { setReviewError(t("signInToReview")); return; }
        try {
            setReviewSubmitting(true);
            const res = await axios.post(
                `${BASE}/api/cars/${id}/review`,
                { score: reviewScore, comment: reviewComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCar(res.data);
            setReviewSuccess(true);
            setReviewScore(0);
            setReviewComment("");
        } catch (err: any) {
            setReviewError(err.response?.data?.message || t("errorOccurred"));
        } finally {
            setReviewSubmitting(false);
        }
    };

    const bookedRanges = useMemo(() =>
        ((car as any)?.bookedDates || []).map((b: any) => ({
            start: new Date(b.pickUp),
            end: new Date(b.dropOff),
        })),
    [car]);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                setLoading(true);
                const found = await carApi.getById(id);
                setCar(found);
            } catch (err: any) {
                toast.error(err.message);
                router.push("/carresults");
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleBooking = async () => {
        if (!pickUp || !dropOff) {
            toast.error("Please select dates");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to book");
            router.push("/signin");
            return;
        }

        try {
            setBookingLoading(true);
            const start = new Date(pickUp);
            const end = new Date(dropOff);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            
            if (days <= 0) {
                toast.error("Drop-off date must be after pick-up date");
                return;
            }

            const data = {
                type: 'car',
                car: car?._id,
                pickUp,
                dropOff,
                totalPrice: (car?.pricePerDay || 0) * days,
                guests: { adults: 1, children: 0 }
            };
            
            await bookingApi.createBooking(data);
            toast.success("Booking successful!");
            router.push("/my-bookings");
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || "Booking failed");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading || !car) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-500 font-medium">{t("loading")}</p>
        </div>
    );

    const days = (pickUp && dropOff)
        ? Math.max(1, Math.ceil((new Date(dropOff).getTime() - new Date(pickUp).getTime()) / 86400000))
        : 1;

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900 leading-tight">{car.title}</h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1 text-[#006ce4] text-sm font-bold bg-blue-50 px-2 py-1 rounded">
                                            <Star size={12} fill="currentColor" /> {car.rating}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-400">• {car.brand} {car.model}</span>
                                    </div>
                                </div>
                                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 hidden sm:block">
                                    <Car size={32} />
                                </div>
                            </div>

                            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 mb-8 border border-gray-100">
                                <img src={car.images?.[0] || "/placeholder.jpg"} className="w-full h-96 object-cover" alt={car.title} />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{t("seats2")}</p>
                                        <p className="text-sm font-black text-gray-900">{car.seats} {t("adults")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                                        <Disc size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{t("gearbox")}</p>
                                        <p className="text-sm font-black text-gray-900 uppercase">{car.transmission}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                                        <Fuel size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{t("fuel")}</p>
                                        <p className="text-sm font-black text-gray-900">{t("petrol")} / {t("fuelPolicy")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{t("ac")}</p>
                                        <p className="text-sm font-black text-gray-900">{t("included")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                     Car features
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(car.features || ["Air Conditioning", "Bluetooth", "USB Port", "Cruise Control"]).map((f: string) => (
                                        <div key={f} className="flex items-center gap-3 text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-white transition-all">
                                            <CheckCircle2 size={16} className="text-[#008009] shrink-0" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-5">
                            <h3 className="text-xl font-bold text-gray-900">Booking Summary</h3>

                            <DateRangePicker
                                bookedRanges={bookedRanges}
                                startDate={pickUp}
                                endDate={dropOff}
                                onStartChange={setPickUp}
                                onEndChange={setDropOff}
                                startLabel="Pick-up"
                                endLabel="Drop-off"
                            />

                            <div className="py-6 border-y border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-500 uppercase">Rental price</span>
                                    <span className="text-sm font-black text-gray-900">${car.pricePerDay} / day</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-gray-500 uppercase">Duration</span>
                                    <span className="text-sm font-black text-gray-900">{days} day(s)</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total cost</p>
                                        <p className="text-4xl font-black text-gray-900">${car.pricePerDay * days}</p>
                                    </div>
                                    <div className="text-xs text-[#008009] font-bold bg-green-50 px-2 py-1 rounded">
                                        Best Price
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={bookingLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-lg transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {bookingLoading ? <Loader2 className="animate-spin" size={24} /> : "Book This Car"}
                            </button>
                            
                            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-tighter">
                                No hidden fees • 24/7 Support
                            </p>
                        </div>
                    </div>

                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Reviews</h2>
                        {car.rating > 0 && (
                            <div className="flex items-center gap-1.5 bg-blue-600 text-white font-black px-3 py-1.5 rounded-xl text-sm">
                                <Star size={14} fill="white" /> {car.rating}
                            </div>
                        )}
                    </div>

                    {/* Review list */}
                    {((car as any).reviews?.length > 0) ? (
                        <div className="space-y-4 mb-8">
                            {((car as any).reviews as any[]).map((r: any) => (
                                <div key={r._id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                                                {(r.userName || "G").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{r.userName || "Guest"}</p>
                                                <p className="text-xs text-gray-400">{fmtDate(r.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-xl">
                                            <Star size={11} fill="white" /> {r.score}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                                    {r.adminReply && (
                                        <div className="mt-4 ml-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CornerDownRight size={14} className="text-blue-600" />
                                                <span className="text-xs font-black text-blue-700 uppercase">Admin cavabı</span>
                                                {r.adminReplyAt && <span className="text-xs text-blue-400">{fmtDate(r.adminReplyAt)}</span>}
                                            </div>
                                            <p className="text-sm text-blue-800">{r.adminReply}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 mb-8">Hələ rəy yoxdur. İlk rəyi siz yazın!</p>
                    )}

                    {/* Submit form */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-5">Rəyinizi bildirin</h3>
                        {!isLoggedIn ? (
                            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl p-5">
                                <p className="text-sm font-semibold text-blue-700">Rəy yazmaq üçün daxil olun</p>
                                <button onClick={() => router.push("/signin")}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                                    <LogIn size={15} /> Daxil ol
                                </button>
                            </div>
                        ) : reviewSuccess ? (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
                                <p className="text-green-700 font-bold">Rəyiniz göndərildi! Təşəkkür edirik.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Qiymət (1–10)</label>
                                    <StarRating value={reviewScore} onChange={setReviewScore} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Şərh</label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        rows={4}
                                        placeholder="Avtomobil haqqında fikirinizi bölüşün..."
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-400 resize-none"
                                    />
                                </div>
                                {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
                                <button
                                    type="submit"
                                    disabled={reviewSubmitting}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                                >
                                    {reviewSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Göndər
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

