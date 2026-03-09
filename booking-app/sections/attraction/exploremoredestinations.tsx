"use client";
import { useState } from "react";

const TABS = ["Europe", "North America", "Asia", "Africa", "Oceania", "Middle East", "Caribbean", "South America", "Central America"];

const DESTINATIONS: Record<string, { city: string; things: string; image: string }[]> = {
    Europe: [
        { city: "London", things: "3967 things to do", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
        { city: "Istanbul", things: "2701 things to do", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80" },
        { city: "Paris", things: "3976 things to do", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
        { city: "Hamburg", things: "359 things to do", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
        { city: "Amsterdam", things: "2102 things to do", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80" },
        { city: "Lisbon", things: "3848 things to do", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80" },
        { city: "Rome", things: "6817 things to do", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80" },
        { city: "Athens", things: "3474 things to do", image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80" },
        { city: "Berlin", things: "852 things to do", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80" },
        { city: "Barcelona", things: "2626 things to do", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80" },
        { city: "Venice", things: "1796 things to do", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600&q=80" },
        { city: "Málaga", things: "821 things to do", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80" },
        { city: "Vienna", things: "1026 things to do", image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80" },
        { city: "Porto", things: "1177 things to do", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80" },
        { city: "Stockholm", things: "484 things to do", image: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=600&q=80" },
        { city: "Monte Carlo", things: "120 things to do", image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=80" },
        { city: "Madrid", things: "1650 things to do", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80" },
        { city: "Armacao de Pera", things: "1230 things to do", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
        { city: "Seville", things: "852 things to do", image: "https://images.unsplash.com/photo-1559564890-2f4e02b02f24?w=600&q=80" },
        { city: "Kraków", things: "1054 things to do", image: "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?w=600&q=80" },
    ],
    "North America": [
        { city: "New York", things: "2191 things to do", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80" },
        { city: "Las Vegas", things: "1085 things to do", image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=600&q=80" },
        { city: "Los Angeles", things: "1420 things to do", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=600&q=80" },
        { city: "Chicago", things: "980 things to do", image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&q=80" },
        { city: "Miami", things: "760 things to do", image: "https://images.unsplash.com/photo-1503891450247-ee5f8ec46dc3?w=600&q=80" },
        { city: "San Francisco", things: "890 things to do", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80" },
        { city: "Toronto", things: "650 things to do", image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=600&q=80" },
        { city: "Vancouver", things: "520 things to do", image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=600&q=80" },
    ],
    Asia: [
        { city: "Dubai", things: "8065 things to do", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
        { city: "Tokyo", things: "5200 things to do", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80" },
        { city: "Bangkok", things: "3100 things to do", image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=80" },
        { city: "Singapore", things: "2800 things to do", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80" },
        { city: "Bali", things: "1950 things to do", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
        { city: "Seoul", things: "2400 things to do", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&q=80" },
        { city: "Hong Kong", things: "1700 things to do", image: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?w=600&q=80" },
        { city: "Kyoto", things: "1300 things to do", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80" },
    ],
    Africa: [
        { city: "Cape Town", things: "1200 things to do", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80" },
        { city: "Marrakech", things: "980 things to do", image: "https://images.unsplash.com/photo-1597211684565-dca64d72bdfe?w=600&q=80" },
        { city: "Cairo", things: "850 things to do", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&q=80" },
        { city: "Nairobi", things: "420 things to do", image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=600&q=80" },
    ],
    Oceania: [
        { city: "Sydney", things: "1800 things to do", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80" },
        { city: "Melbourne", things: "1200 things to do", image: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600&q=80" },
        { city: "Auckland", things: "650 things to do", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80" },
        { city: "Brisbane", things: "520 things to do", image: "https://images.unsplash.com/photo-1566734904496-9309bb1798ae?w=600&q=80" },
    ],
    "Middle East": [
        { city: "Abu Dhabi", things: "1100 things to do", image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600&q=80" },
        { city: "Doha", things: "780 things to do", image: "https://images.unsplash.com/photo-1609250888792-f641b4dd9fb8?w=600&q=80" },
        { city: "Muscat", things: "450 things to do", image: "https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=600&q=80" },
        { city: "Beirut", things: "380 things to do", image: "https://images.unsplash.com/photo-1596627116790-af6f46dddbfd?w=600&q=80" },
    ],
    Caribbean: [
        { city: "Cancún", things: "920 things to do", image: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80" },
        { city: "Nassau", things: "340 things to do", image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80" },
        { city: "Bridgetown", things: "280 things to do", image: "https://images.unsplash.com/photo-1594142038668-7540552e44b3?w=600&q=80" },
        { city: "Kingston", things: "210 things to do", image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=80" },
    ],
    "South America": [
        { city: "Rio de Janeiro", things: "1500 things to do", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80" },
        { city: "Buenos Aires", things: "980 things to do", image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80" },
        { city: "Lima", things: "720 things to do", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80" },
        { city: "Bogotá", things: "560 things to do", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=80" },
    ],
    "Central America": [
        { city: "Mexico City", things: "1300 things to do", image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&q=80" },
        { city: "San José", things: "420 things to do", image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80" },
        { city: "Panama City", things: "380 things to do", image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600&q=80" },
        { city: "Guatemala City", things: "290 things to do", image: "https://images.unsplash.com/photo-1568385247005-0d371d214a2d?w=600&q=80" },
    ],
};

export default function ExploreMoreDestinations() {
    const [activeTab, setActiveTab] = useState("Europe");
    const cards = DESTINATIONS[activeTab] || [];

    return (
        <section className="max-w-7xl mx-auto px-6 py-10" style={{ fontFamily: "'BlinkMacSystemFont', 'Segoe UI', sans-serif" }}>
            <div className="border-t border-gray-200 mb-8" />
            <h2 className="text-xl font-bold text-gray-900 mb-1">Explore more destinations</h2>
            <p className="text-sm text-gray-500 mb-5">Find things to do in cities around the world</p>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-gray-200 mb-6 overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                            activeTab === tab
                                ? "text-[#0071c2] border-[#0071c2]"
                                : "text-gray-600 border-transparent hover:text-gray-900"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3">
                {cards.map((dest, i) => (
                    <div
                        key={i}
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        style={{ height: 240 }}
                    >
                        <img
                            src={dest.image}
                            alt={dest.city}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                            <p className="text-white font-bold text-sm leading-tight">{dest.city}</p>
                            <p className="text-white/75 text-xs mt-0.5">{dest.things}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}