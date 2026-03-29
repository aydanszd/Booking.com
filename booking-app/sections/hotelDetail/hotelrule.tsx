"use client";
import { Clock, Info, CheckCircle2, Users, Baby } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Rules({ building }: { building: any }) {
    const t = useTranslations("hotel");

    const rules = [
        {
            label: t("checkIn"),
            value: t("checkInTime"),
            icon: <Clock size={16} className="text-gray-500" />,
        },
        {
            label: t("checkOut"),
            value: t("checkOutTime"),
            icon: <Clock size={16} className="text-gray-500" />,
        },
        {
            label: t("cancellationTitle"),
            value: t("cancellationDesc"),
            icon: <CheckCircle2 size={16} className="text-[#008009]" />,
        },
        {
            label: t("childrenTitle"),
            value: t("childrenDescGuests", { maxGuests: building.maxGuests || 10 }),
            icon: <Baby size={16} className="text-gray-500" />,
        },
        {
            label: t("guests"),
            value: `${t("maxGuests") || "Max"}: ${building.maxGuests || 10}`,
            icon: <Users size={16} className="text-gray-500" />,
        },
    ];

    return (
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden mb-6">
            {/* Section header */}
            <div className="bg-[#f2f6fa] px-5 py-3 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900">{t("houseRulesTitle")}</h2>
            </div>

            {/* Rules list */}
            <div className="divide-y divide-gray-100">
                {rules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-4 px-5 py-3.5">
                        <div className="shrink-0 mt-0.5">{rule.icon}</div>
                        <div className="flex-1 flex gap-4 flex-wrap">
                            <span className="text-sm text-gray-500 font-semibold w-36 shrink-0">{rule.label}</span>
                            <span className="text-sm text-gray-800">{rule.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legal note */}
            <div className="px-5 py-3 bg-[#fef9ec] border-t border-gray-200 flex items-start gap-2">
                <Info size={14} className="text-[#febb02] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">{t("legalDesc")}</p>
            </div>
        </div>
    );
}
