"use client";
import { Calendar, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface SearchItem {
    id: number;
    city: string;
    image: string;
    dateRange: string;
    people: number;
}

const recentSearches: SearchItem[] = [
    {
        id: 1,
        city: "Baku",
        image: "https://cf.bstatic.com/xdata/images/city/256x256/688198.jpg?k=4c74414a6ed76b016e62cf8b6000ef785280f98c55fb835d2206d8efdc8ef724&o=",
        dateRange: "Sat 28 Feb–Sun 1 Mar",
        people: 2,
    },
];

export default function RecentSearches() {
    const t = useTranslations("stays");

    return (
        <section className="max-w-7xl  mt-25 ml-[380px]">
            <h2 className="text-[26px] font-bold text-gray-900 mb-3">{t("recentSearches")}</h2>

            <div className="flex flex-wrap gap-3">
                {recentSearches.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center bg-white shadow-lg rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200 overflow-hidden w-86"
                    >
                        <img
                            src={item.image}
                            alt={item.city}
                            className="w-24 h-20 object-cover shrink-0"
                        />
                        <div className="flex flex-col gap-1 px-3 py-2">
                            <p className="text-sm font-bold text-gray-900">{item.city}</p>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {item.dateRange}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Users className="w-3 h-3 shrink-0" />
                                {t("people", { count: item.people })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
