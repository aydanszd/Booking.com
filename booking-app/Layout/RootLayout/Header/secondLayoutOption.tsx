"use client";

import { useState } from "react";
import {
    Bed, Plane, Car, Ticket, CarTaxiFront,
} from "lucide-react";

const NAV_ITEMS = [
    { icon: Bed, label: "Stays" },
    { icon: Plane, label: "Flights" },
    { icon: Car, label: "Car rental" },
    { icon: Ticket, label: "Attractions" },
    { icon: CarTaxiFront, label: "Airport taxis" },
];

export default function BookingNavbar() {
    const [activeTab, setActiveTab] = useState("Flights");

    return (
        <nav className="bg-[#003b95] w-full shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top row: logo + auth */}
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <a href="#" className="flex items-center select-none">
                        <img
                            src="https://miro.medium.com/1*vKT1xQFxhP2hJuRB8_sn1g.png"
                            alt="Booking.com"
                            className="h-14 object-contain cursor-pointer"
                        />
                    </a>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Language */}
                        <button className="flex items-center gap-1.5 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
                            <span className="text-base">🇺🇸</span>
                            <span>$</span>
                        </button>

                        <button className="text-white text-sm font-semibold px-4 py-1.5 rounded border border-white/60 hover:bg-white/10 transition-colors">
                            Register
                        </button>
                        <button className="text-[#003580] bg-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-blue-50 transition-colors">
                            Sign in
                        </button>
                    </div>
                </div>

                {/* Bottom row: nav tabs */}
                <div className="flex gap-1 -mt-4.5 overflow-x-auto scrollbar-hide pb-3">
                    {NAV_ITEMS.map(({ icon: Icon, label }) => (
                        <button
                            key={label}
                            onClick={() => setActiveTab(label)}
                            className={`flex items-center gap-1.5 px-4 py-3 rounded-[30px] text-sm font-medium transition-colors whitespace-nowrap ${activeTab === label
                                ? "border border-white bg-white/10 text-white"
                                : "text-white hover:bg-white/10"
                            }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}