"use client"
import { useState } from "react"

const TABS = [
    "Cities in Azerbaijan",
    "Airports in Azerbaijan",
    "Regions in Azerbaijan",
    "Cities worldwide",
    "Airports worldwide",
];

const DESTINATIONS: Record<string, { name: string; image: string; locations: number; price: string }[]> = {
    "Cities in Azerbaijan": [
        { name: "Baku", image: "https://q-xx.bstatic.com/xdata/images/city/square64/688197.webp?k=1255478cbae95a6cda9177fa6363c09050bf416aebad49b598aeaeb2c6e9dab7&o=", locations: 12, price: "US$63.65" },
    ],
    "Airports in Azerbaijan": [],
    "Regions in Azerbaijan": [],
    "Cities worldwide": [],
    "Airports worldwide": [],
};

export default function PopularDestinationsSection() {
    const [activeTab, setActiveTab] = useState("Cities in Azerbaijan");

    return (
        <div className="ml-[380px]">
        <section className="max-w-6xl px-6 py-10 ">
            <h2 className="text-2xl font-bold text-gray-900">Popular car hire destinations</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">Explore more options to hire a car for cheap</p>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                            activeTab === tab
                                ? "border-[#006ce4] text-[#006ce4] bg-white"
                                : "border-gray-300 text-gray-700 bg-white hover:border-gray-400"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Destination list */}
            <div className="flex flex-col gap-3">
                {DESTINATIONS[activeTab]?.length > 0 ? (
                    DESTINATIONS[activeTab].map((dest) => (
                        <div
                            key={dest.name}
                            className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                        >
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://cf.bstatic.com/xdata/images/city/150x150/688498.jpg";
                                }}
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-900">{dest.name}</p>
                                <p className="text-sm text-gray-500">{dest.locations} car hire locations</p>
                                <p className="text-sm text-gray-500">
                                    Average price of <span className="font-bold text-gray-900">{dest.price}</span> per day
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">No destinations available.</p>
                )}
            </div>
        </section>
        </div>
    );
}