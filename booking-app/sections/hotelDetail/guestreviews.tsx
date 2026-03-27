"use client";
import { useState, useEffect } from "react";
import { Star, MessageSquareQuote, Send, CornerDownRight, Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslations } from "next-intl";

const BASE = "http://localhost:5000";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)}
                    className="transition-transform hover:scale-110"
                >
                    <Star
                        size={20}
                        className={n <= (hovered || value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                </button>
            ))}
        </div>
    );
}

function fmtDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
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

    const getRatingLabel = (rating: number) => {
        if (rating >= 9) return t("excellent");
        if (rating >= 7) return t("veryGood");
        if (rating >= 5) return t("good");
        return t("noReviews");
    };

    return (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 mb-20">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">{t("guestReviews")}</h2>

            {/* Overall rating */}
            <div className="flex items-center gap-6 mb-10">
                <div className="bg-blue-600 text-white text-4xl font-black w-24 h-24 rounded-3xl shadow-2xl shadow-blue-200 flex items-center justify-center">
                    {building.rating || "–"}
                </div>
                <div>
                    <p className="text-2xl font-black text-gray-900">
                        {building.rating ? getRatingLabel(building.rating) : t("noReviews")}
                    </p>
                    <p className="text-sm font-bold text-gray-400 mt-1 flex items-center gap-2">
                        <MessageSquareQuote size={16} className="text-blue-600" />
                        {t("basedOn", { count: reviews.length })}
                    </p>
                </div>
            </div>

            {/* Review list */}
            {reviews.length > 0 && (
                <div className="space-y-5 mb-10">
                    {reviews.map((r: any) => (
                        <div key={r._id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
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

                            {/* Admin reply */}
                            {r.adminReply && (
                                <div className="mt-4 ml-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CornerDownRight size={14} className="text-blue-600" />
                                        <span className="text-xs font-black text-blue-700 uppercase tracking-wide">{t("adminReply")}</span>
                                        {r.adminReplyAt && (
                                            <span className="text-xs text-blue-400">{fmtDate(r.adminReplyAt)}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-blue-800 leading-relaxed">{r.adminReply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Submit review form */}
            <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-5">{t("shareReview")}</h3>
                {!isLoggedIn ? (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl p-5">
                        <p className="text-sm font-semibold text-blue-700">{t("signInToReview")}</p>
                        <button
                            onClick={() => router.push("/signin")}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                        >
                            <LogIn size={15} /> {t("signIn")}
                        </button>
                    </div>
                ) : success ? (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                        <p className="text-green-700 font-bold">{t("reviewSubmitted")}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t("rating")}</label>
                            <StarRating value={score} onChange={setScore} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t("comment")}</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                placeholder={t("commentPlaceholder")}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-400 resize-none"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {t("submit")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
