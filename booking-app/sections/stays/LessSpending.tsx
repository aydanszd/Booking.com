"use client";

import { useState } from "react";

const tabs = ["Domestic cities", "International cities", "Countries", "Places to stay"];

const domesticCities = [
    "Baku hotels",
    "Masazir hotels",
    "Ganja hotels",
    "Gabala hotels",
];

const footerLinks1 = [
    "Countries", "Regions", "Cities", "Districts", "Airports", "Hotels",
    "Places of interest", "Holiday Homes", "Apartments", "Resorts", "Villas",
    "Hostels", "B&Bs", "Guest Houses", "Unique places to stay", "All destinations",
];

const footerLinks2 = [
    "All flight destinations", "All car hire locations", "All holiday destinations",
    "Guides", "Discover", "Discover monthly stays",
];

const footerColumns = [
    {
        title: "Support",
        links: ["Manage your trips", "Contact Customer Service", "Safety resource centre"],
    },
    {
        title: "Discover",
        links: [
            "Genius loyalty programme", "Seasonal and holiday deals", "Travel articles",
            "Booking.com for Business", "Traveller Review Awards", "Car hire",
            "Flight finder", "Restaurant reservations",
        ],
    },
    {
        title: "Terms and settings",
        links: [
            "Privacy Notice", "Terms of Service", "Accessibility Statement",
            "Partner dispute", "Modern Slavery Statement", "Human Rights Statement",
        ],
    },
    {
        title: "Partners",
        links: ["Extranet login", "Partner help", "List your property", "Become an affiliate"],
    },
    {
        title: "About",
        links: [
            "About Booking.com", "How we work", "Sustainability", "Press centre",
            "Careers", "Investor relations", "Corporate contact", "Content guidelines and",
        ],
    },
];

export default function BookingSections() {
    const [activeTab, setActiveTab] = useState("Domestic cities");

    return (
        <div className="bg-white font-sans">
            {/* Travel more, spend less */}
            <div className="max-w-6xl mx-auto px-4 py-6 -mt-5">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Travel more, spend less</h2>

                {/* Genius Card */}
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-900 text-base mb-1">Sign in, save money</p>
                        <p className="text-sm text-gray-600 mb-4">
                            Save 10% or more at participating properties - just look for the blue Genius label
                        </p>
                        <div className="flex items-center gap-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded">
                                Sign in
                            </button>
                            <button className="text-blue-600 hover:underline text-sm font-medium">
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Genius Badge Image */}
                    <div className="shrink-0 ml-4">
                        <img
                            src="https://t-cf.bstatic.com/design-assets/assets/v3.176.0/illustrations-traveller/GeniusGenericGiftBox.png"
                            alt="Genius"
                            className="w-28 h-28 object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Popular with travellers from Azerbaijan */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Popular with travellers from Azerbaijan
                </h2>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${activeTab === tab
                                    ? "border-blue-600 text-blue-600 font-medium"
                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* City links */}
                <div className="grid grid-cols-4 gap-x-4 gap-y-2 mb-5">
                    {domesticCities.map((city) => (
                        <a key={city} href="#" className="text-sm text-gray-800 hover:underline">
                            {city}
                        </a>
                    ))}
                </div>

                {/* Small footer links row 1 */}
                <div className="flex flex-wrap mb-1">
                    {footerLinks1.map((link, i) => (
                        <span key={link} className="text-xs text-gray-600">
                            <a href="#" className="hover:underline">{link}</a>
                            {i < footerLinks1.length - 1 && (
                                <span className="mx-1 text-gray-400">·</span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Small footer links row 2 */}
                <div className="flex flex-wrap mb-10">
                    {footerLinks2.map((link, i) => (
                        <span key={link} className="text-xs text-gray-600">
                            <a href="#" className="hover:underline">{link}</a>
                            {i < footerLinks2.length - 1 && (
                                <span className="mx-1 text-gray-400">·</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>


        </div>
    );
}