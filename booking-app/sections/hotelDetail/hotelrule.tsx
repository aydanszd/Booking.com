"use client";
import { Clock, Info, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Rules({ building }: { building: any }) {
    const t = useTranslations("hotel");
    return (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
            <h2 className="text-2xl font-black text-gray-900 mb-10 uppercase tracking-tighter">{t("houseRulesTitle")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="flex gap-6 items-start group">
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{t("checkIn")}</p>
                        <p className="text-lg font-black text-gray-800">{t("checkInTime")}</p>
                        <p className="text-xs text-gray-500 font-bold mt-2 flex items-center gap-2">
                            <Info size={14} className="text-blue-500" /> {t("letThemKnow")}
                        </p>
                    </div>
                </div>

                <div className="flex gap-6 items-start group">
                    <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 transition-all group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{t("checkOut")}</p>
                        <p className="text-lg font-black text-gray-800">{t("checkOutTime")}</p>
                    </div>
                </div>

                <div className="flex gap-6 items-start group">
                    <div className="p-4 bg-green-50 rounded-2xl text-green-600 transition-all group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white">
                        <CheckCircle2 size={24} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{t("cancellationTitle")}</p>
                        <p className="text-sm font-semibold text-gray-700 leading-relaxed max-w-sm">
                            {t("cancellationDesc")}
                        </p>
                    </div>
                </div>

                <div className="flex gap-6 items-start group">
                    <div className="p-4 bg-red-50 rounded-2xl text-red-600 transition-all group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{t("childrenTitle")}</p>
                        <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                            {t("childrenDescGuests", { maxGuests: building.maxGuests || 10 })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-gray-50 rounded-2xl p-6 border-l-4 border-blue-600">
                <p className="text-xs font-bold text-gray-500 flex items-center gap-2">
                    <Info size={16} className="text-blue-600" /> {t("legalInfo")}
                </p>
                <p className="text-sm font-bold text-gray-700 mt-2">
                    {t("legalDesc")}
                </p>
            </div>
        </div>
    );
}
