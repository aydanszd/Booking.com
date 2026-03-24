"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Bed, Plane, Car, Ticket, CarTaxiFront,
} from "lucide-react";

const NAV_ITEMS = [
    { icon: Bed, label: "Stays", href: "/" },
    { icon: Plane, label: "Flights", href: "/flights" },
    { icon: Car, label: "Car rental", href: "/carrender" },
    { icon: Ticket, label: "Attractions", href: "/attractions" },
    { icon: CarTaxiFront, label: "Airport taxis", href: "/_airporttaxis" },
];

export default function BookingNavbar() {
    const [activeTab, setActiveTab] = useState("Flights");

    return (
        <nav className="bg-[#003b95] w-full shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top row: logo + auth */}
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center select-none">
                        <img
                            src="https://miro.medium.com/1*vKT1xQFxhP2hJuRB8_sn1g.png"
                            alt="Booking.com"
                            className="h-14 object-contain cursor-pointer"
                        />
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Language */}
                        <button className="flex items-center gap-1.5 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
                            <span className="text-base">🇺🇸</span>
                            <span>$</span>
                        </button>

                        <Link href="/register" className="text-white text-sm font-semibold px-4 py-1.5 rounded border border-white/60 hover:bg-white/10 transition-colors">
                            Register
                        </Link>
                        <Link href="/signin" className="text-[#003580] bg-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-blue-50 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Bottom row: nav tabs */}
                <div className="flex gap-1 -mt-4.5 overflow-x-auto scrollbar-hide pb-3">
                    {NAV_ITEMS.map(({ icon: Icon, label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setActiveTab(label)}
                            className={`flex items-center gap-1.5 px-4 py-3 rounded-[30px] text-sm font-medium transition-colors whitespace-nowrap ${activeTab === label
                                ? "border border-white bg-white/10 text-white"
                                : "text-white hover:bg-white/10"
                            }`}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}