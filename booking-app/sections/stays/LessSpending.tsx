"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

const TAB_KEYS = ["tabDomestic", "tabInternational", "tabCountries", "tabPlaces"] as const;

const domesticCities = ["Baku hotels", "Masazir hotels", "Ganja hotels", "Gabala hotels"];

const footerLinks1 = [
    "Countries", "Regions", "Cities", "Districts", "Airports", "Hotels",
    "Places of interest", "Holiday Homes", "Apartments", "Resorts", "Villas",
    "Hostels", "B&Bs", "Guest Houses", "Unique places to stay", "All destinations",
];

const footerLinks2 = [
    "All flight destinations", "All car hire locations", "All holiday destinations",
    "Guides", "Discover", "Discover monthly stays",
];

export default function BookingSections() {
    const t = useTranslations("stays");
    const [activeTab, setActiveTab] = useState<typeof TAB_KEYS[number]>("tabDomestic");

    return (
        <div className="bg-white font-sans">
            {/* Travel more, spend less */}
            <div className="max-w-6xl mx-auto px-4 py-6 -mt-5">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{t("travelMore")}</h2>

                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-900 text-base mb-1">{t("signInSave")}</p>
                        <p className="text-sm text-gray-600 mb-4">{t("signInSaveDesc")}</p>
                        <div className="flex items-center gap-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded">
                                {t("signIn")}
                            </button>
                            <button className="text-blue-600 hover:underline text-sm font-medium">
                                {t("register")}
                            </button>
                        </div>
                    </div>
                    <div className="shrink-0 ml-4">
                        <img
                            src="https://t-cf.bstatic.com/design-assets/assets/v3.176.0/illustrations-traveller/GeniusGenericGiftBox.png"
                            alt="Genius"
                            className="w-28 h-28 object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Popular with travellers */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("popularWith")}</h2>

                <div className="flex gap-2 mb-6 flex-wrap">
                    {TAB_KEYS.map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                                activeTab === key
                                    ? "border-blue-600 text-blue-600 font-medium"
                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                        >
                            {t(key)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-4 gap-x-4 gap-y-2 mb-5">
                    {domesticCities.map((city) => (
                        <a key={city} href="#" className="text-sm text-gray-800 hover:underline">{city}</a>
                    ))}
                </div>

                <div className="flex flex-wrap mb-1">
                    {footerLinks1.map((link, i) => (
                        <span key={link} className="text-xs text-gray-600">
                            <a href="#" className="hover:underline">{link}</a>
                            {i < footerLinks1.length - 1 && <span className="mx-1 text-gray-400">·</span>}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap mb-10">
                    {footerLinks2.map((link, i) => (
                        <span key={link} className="text-xs text-gray-600">
                            <a href="#" className="hover:underline">{link}</a>
                            {i < footerLinks2.length - 1 && <span className="mx-1 text-gray-400">·</span>}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
