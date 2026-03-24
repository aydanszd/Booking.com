"use client";
import { Star, MessageSquareQuote, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";

export default function Reviews({ building }: { building: any }) {
    return (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 mb-20 relative overflow-hidden">
            <h2 className="text-2xl font-black text-gray-900 mb-12 uppercase tracking-tighter">Guest Reviews</h2>
            
            <div className="flex flex-col lg:flex-row gap-16 mb-16">
                <div className="flex-1">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="bg-blue-600 text-white text-5xl font-black p-10 rounded-3xl shadow-2xl shadow-blue-200">
                            {building.rating}
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 italic">Excellent</p>
                            <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                                <MessageSquareQuote size={18} className="text-blue-600" /> Based on 1,597 verified reviews
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { label: "Cleanliness", score: 9.8, color: "bg-green-500" },
                            { label: "Location", score: 9.5, color: "bg-blue-500" },
                            { label: "Service", score: 9.4, color: "bg-amber-500" },
                            { label: "Wifi", score: 9.2, color: "bg-indigo-500" },
                        ].map((item) => (
                            <div key={item.label} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-sm font-black text-gray-900">{item.score}</span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full ${item.color} shadow-lg shadow-current`} style={{ width: `${item.score * 10}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-96 flex flex-col gap-6">
                    <p className="text-lg font-black text-gray-800 mb-2">Check what guests say:</p>
                    <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 relative shadow-sm group hover:shadow-lg transition-all cursor-pointer">
                        <MessageSquareQuote size={40} className="text-amber-200 absolute -top-4 -left-4 opacity-50 group-hover:scale-125 transition-transform" />
                        <p className="text-sm font-semibold text-amber-900 leading-relaxed italic relative z-10 mb-6">
                            "Absolutely loved it. The staff went above and beyond for our anniversary. The breakfast was fresh and had many halal options."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-black">AM</div>
                            <div>
                                <p className="text-xs font-black text-amber-900 uppercase">Ahmed Muhammad</p>
                                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">United Arab Emirates</p>
                            </div>
                        </div>
                    </div>
                    
                    <button className="flex items-center justify-center gap-2 text-sm font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-all py-4 border-2 border-dashed border-gray-100 rounded-2xl hover:border-blue-200">
                        Read all reviews <ChevronDown size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}