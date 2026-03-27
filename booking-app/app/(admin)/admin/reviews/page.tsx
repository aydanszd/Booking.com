"use client";
import { useEffect, useState } from "react";
import { Star, CornerDownRight, Send, Loader2, Hotel, Car, MessageSquare } from "lucide-react";
import axios from "axios";

const BASE = "http://localhost:5000";

interface ReviewItem {
    _id: string;
    resourceId: string;
    resourceTitle: string;
    resourceType: "hotel" | "car";
    userName: string;
    score: number;
    comment: string;
    adminReply: string | null;
    adminReplyAt: string | null;
    createdAt: string;
}

function fmtDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("az-AZ", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});
    const [replying, setReplying] = useState<Record<string, boolean>>({});
    const [filter, setFilter] = useState<"all" | "hotel" | "car" | "replied" | "unreplied">("all");

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE}/api/admin/reviews`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleReply = async (review: ReviewItem) => {
        const text = replyText[review._id]?.trim();
        if (!text) return;
        setReplying(p => ({ ...p, [review._id]: true }));
        try {
            const token = localStorage.getItem("token");
            const endpoint = review.resourceType === "hotel"
                ? `${BASE}/api/buildings/${review.resourceId}/review/${review._id}/reply`
                : `${BASE}/api/cars/${review.resourceId}/review/${review._id}/reply`;
            await axios.post(endpoint, { reply: text }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReplyText(p => ({ ...p, [review._id]: "" }));
            setReplyOpen(p => ({ ...p, [review._id]: false }));
            fetchReviews();
        } catch (err) {
            console.error(err);
        } finally {
            setReplying(p => ({ ...p, [review._id]: false }));
        }
    };

    const filtered = reviews.filter(r => {
        if (filter === "hotel") return r.resourceType === "hotel";
        if (filter === "car") return r.resourceType === "car";
        if (filter === "replied") return !!r.adminReply;
        if (filter === "unreplied") return !r.adminReply;
        return true;
    });

    const stats = {
        total: reviews.length,
        replied: reviews.filter(r => r.adminReply).length,
        unreplied: reviews.filter(r => !r.adminReply).length,
        avgScore: reviews.length ? (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1) : "–",
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Ümumi rəylər", value: stats.total, color: "text-blue-600" },
                    { label: "Cavablanıb", value: stats.replied, color: "text-green-600" },
                    { label: "Cavablanmayıb", value: stats.unreplied, color: "text-orange-500" },
                    { label: "Orta qiymət", value: stats.avgScore, color: "text-purple-600" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">{s.label}</p>
                        <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {(["all", "hotel", "car", "replied", "unreplied"] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filter === f ? "bg-[#006ce4] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                        {f === "all" ? "Hamısı" : f === "hotel" ? "Otellər" : f === "car" ? "Avtomobillər" : f === "replied" ? "Cavablanıb" : "Cavablanmayıb"}
                    </button>
                ))}
            </div>

            {/* Reviews list */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-[#006ce4]" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold">Rəy tapılmadı</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(review => (
                        <div key={review._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#006ce4] flex items-center justify-center text-white text-sm font-black shrink-0">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{review.userName}</p>
                                        <p className="text-xs text-gray-400">{fmtDate(review.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${review.resourceType === "hotel" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                                        {review.resourceType === "hotel" ? <Hotel size={12} /> : <Car size={12} />}
                                        {review.resourceTitle}
                                    </div>
                                    <div className="flex items-center gap-1 bg-[#006ce4] text-white text-xs font-black px-2.5 py-1 rounded-xl">
                                        <Star size={11} fill="white" /> {review.score}
                                    </div>
                                </div>
                            </div>

                            {/* Comment */}
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                            {/* Existing admin reply */}
                            {review.adminReply && (
                                <div className="ml-4 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CornerDownRight size={14} className="text-[#006ce4]" />
                                        <span className="text-xs font-black text-[#006ce4] uppercase">Admin cavabı</span>
                                        {review.adminReplyAt && <span className="text-xs text-blue-400">{fmtDate(review.adminReplyAt)}</span>}
                                    </div>
                                    <p className="text-sm text-blue-800">{review.adminReply}</p>
                                </div>
                            )}

                            {/* Reply toggle */}
                            <div className="flex items-center gap-3">
                                {!replyOpen[review._id] ? (
                                    <button
                                        onClick={() => setReplyOpen(p => ({ ...p, [review._id]: true }))}
                                        className="flex items-center gap-1.5 text-xs font-bold text-[#006ce4] hover:underline"
                                    >
                                        <CornerDownRight size={13} />
                                        {review.adminReply ? "Cavabı redaktə et" : "Cavab ver"}
                                    </button>
                                ) : (
                                    <div className="flex-1 space-y-2">
                                        <textarea
                                            value={replyText[review._id] || review.adminReply || ""}
                                            onChange={e => setReplyText(p => ({ ...p, [review._id]: e.target.value }))}
                                            rows={3}
                                            placeholder="Admin cavabınızı yazın..."
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#006ce4] resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReply(review)}
                                                disabled={replying[review._id]}
                                                className="flex items-center gap-1.5 bg-[#006ce4] hover:bg-[#0057b8] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                                            >
                                                {replying[review._id] ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                                Göndər
                                            </button>
                                            <button
                                                onClick={() => setReplyOpen(p => ({ ...p, [review._id]: false }))}
                                                className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-2"
                                            >
                                                Ləğv et
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!review.adminReply && (
                                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">Cavablanmayıb</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
