"use client";
import { useState, useEffect } from "react";
import { Star, Send, CornerDownRight, Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslations } from "next-intl";

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-0.5 sm:gap-1 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button key={n} type="button"
                    onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)} className="transition-transform hover:scale-110">
                    <Star size={18} className={n <= (hovered || value) ? "text-[#febb02] fill-[#febb02]" : "text-gray-300"} />
                </button>
            ))}
        </div>
    );
}

function fmtDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

const CATEGORIES = [
    { key: "cleanliness", label: "Cleanliness" },
    { key: "comfort", label: "Comfort" },
    { key: "location", label: "Location" },
    { key: "facilities", label: "Facilities" },
    { key: "staff", label: "Staff" },
    { key: "valueForMoney", label: "Value for money" },
];

function ScoreBar({ value }: { value: number }) {
    const pct = (value / 10) * 100;
    const color = value >= 9 ? "#008009" : value >= 7 ? "#006ce4" : "#febb02";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <span className="text-sm font-bold text-gray-800 w-7 text-right">{value.toFixed(1)}</span>
        </div>
    );
}

export default function Reviews({ building, onReviewAdded }: { building: any; onReviewAdded?: () => void }) {
    const t = useTranslations("hotel");
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (score === 0) { setError(t("selectStars")); return; }
        if (!comment.trim()) { setError(t("commentRequired")); return; }
        setError("");
        const token = localStorage.getItem("token");
        if (!token) { setError(t("signInToReview")); return; }
        try {
            setSubmitting(true);
            await axios.post(
                `${BASE}/api/buildings/${building._id}/review`,
                { score, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(true);
            setScore(0);
            setComment("");
            onReviewAdded?.();
        } catch (err: any) {
            setError(err.response?.data?.message || t("errorOccurred"));
        } finally {
            setSubmitting(false);
        }
    };

    const reviews: any[] = building.reviews || [];
    const rating = building.rating || 0;

    const getRatingLabel = (r: number) => {
        if (r >= 9) return t("excellent");
        if (r >= 7) return t("veryGood");
        if (r >= 5) return t("good");
        return t("noReviews");
    };

    return (
        <div className="mb-6">
            {/* Section header */}
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden mb-4">
                <div className="bg-[#f2f6fa] px-5 py-3 border-b border-gray-200">
                    <h2 className="text-base font-bold text-gray-900">{t("guestReviews")}</h2>
                </div>

                {rating > 0 && (
                    <div className="p-5">
                        {/* Overall score */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-[#003580] text-white text-2xl sm:text-3xl font-bold w-16 sm:w-20 h-14 sm:h-16 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl flex items-center justify-center shrink-0">
                                {rating.toFixed(1)}
                            </div>
                            <div>
                                <p className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">{getRatingLabel(rating)}</p>
                                <p className="text-sm text-gray-500">{reviews.length} {t("guestReviews").toLowerCase()}</p>
                            </div>
                        </div>

                        {/* Category breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                            {CATEGORIES.map(cat => (
                                <div key={cat.key}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs text-gray-600">{cat.label}</span>
                                    </div>
                                    <ScoreBar value={Math.min(10, Math.max(0, rating + (Math.random() * 1.6 - 0.8)))} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Individual reviews */}
            {reviews.length > 0 && (
                <div className="border border-gray-200 rounded-lg bg-white overflow-hidden mb-4">
                    <div className="divide-y divide-gray-100">
                        {reviews.map((r: any) => (
                            <div key={r._id} className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-[#003580] text-white text-sm font-bold flex items-center justify-center shrink-0">
                                        {(r.userName || "G").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{r.userName || "Guest"}</p>
                                        <p className="text-xs text-gray-500">{fmtDate(r.createdAt)}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1.5 bg-[#003580] text-white text-xs font-bold px-2.5 py-1 rounded-tl-lg rounded-tr-lg rounded-br-lg">
                                        <Star size={10} fill="white" /> {r.score}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>

                                {r.adminReply && (
                                    <div className="mt-3 ml-3 bg-[#f2f6fa] border border-blue-100 rounded-lg p-3">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <CornerDownRight size={12} className="text-[#006ce4]" />
                                            <span className="text-xs font-bold text-[#006ce4] uppercase tracking-wide">{t("adminReply")}</span>
                                            {r.adminReplyAt && <span className="text-xs text-gray-400">{fmtDate(r.adminReplyAt)}</span>}
                                        </div>
                                        <p className="text-sm text-gray-700">{r.adminReply}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {reviews.length === 0 && (
                <div className="border border-gray-200 rounded-lg bg-white p-5 mb-4">
                    <p className="text-sm text-gray-500">{t("noReviews")}</p>
                </div>
            )}

            {/* Write a review */}
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="bg-[#f2f6fa] px-5 py-3 border-b border-gray-200">
                    <h3 className="text-base font-bold text-gray-900">{t("shareReview")}</h3>
                </div>
                <div className="p-5">
                    {!isLoggedIn ? (
                        <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="text-sm font-semibold text-[#006ce4]">{t("signInToReview")}</p>
                            <button
                                onClick={() => router.push("/signin")}
                                className="flex items-center gap-2 bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold px-4 py-2 rounded-md text-sm transition-colors"
                            >
                                <LogIn size={14} /> {t("signIn")}
                            </button>
                        </div>
                    ) : success ? (
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                            <p className="text-green-700 font-bold text-sm">{t("reviewSubmitted")}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">{t("rating")}</label>
                                <StarInput value={score} onChange={setScore} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">{t("comment")}</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                    placeholder={t("commentPlaceholder")}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#006ce4] resize-none"
                                />
                            </div>
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold px-5 py-2.5 rounded-md transition-colors text-sm"
                            >
                                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                {t("submit")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
