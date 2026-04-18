"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bed, BedDouble, Plane, Car, Ticket, Heart, ChevronDown } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";

const NAV_ITEMS = [
    { icon: Bed,       label: "Stays",       href: "/" },
    { icon: BedDouble, label: "Buildings",   href: "/filter" },
    { icon: Plane,     label: "Flights",     href: "/flights" },
    { icon: Car,       label: "Car rental",  href: "/carrender" },
    { icon: Ticket,    label: "Attractions", href: "/attractions" },
];

export default function BookingNavbar() {
    const pathname = usePathname();
    const { count: wishlistCount } = useWishlist();
    const { currencies, selected, setCurrency } = useCurrency();
    const [showCurrency, setShowCurrency] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const currencyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
        const handler = (e: MouseEvent) => {
            if (currencyRef.current && !currencyRef.current.contains(e.target as Node))
                setShowCurrency(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const activeTab = useMemo(() => {
        const p = pathname.replace(/^\/(en|tr|ru)(\/|$)/, "/").replace(/\/$/, "") || "/";
        const match = NAV_ITEMS.slice().reverse().find(({ href }) => href !== "/" && p.startsWith(href));
        if (match) return match.label;
        return p === "/" ? "Stays" : "";
    }, [pathname]);

    return (
        <nav className="bg-[#003b95] w-full shadow-md">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

                {/* Top row */}
                <div className="flex items-center justify-between h-14">
                    <Link href="/" className="flex items-center select-none">
                        <img
                            src="https://miro.medium.com/1*vKT1xQFxhP2hJuRB8_sn1g.png"
                            alt="Booking.com"
                            className="h-10 sm:h-14 object-contain cursor-pointer"
                        />
                    </Link>

                    <div className="flex items-center gap-1 sm:gap-2 text-white text-sm font-medium">
                        {/* Currency */}
                        <div ref={currencyRef} className="relative hidden sm:block">
                            <button
                                onClick={() => setShowCurrency(v => !v)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-white/10 transition-colors text-sm"
                            >
                                {selected.symbol} {selected.code}
                                <ChevronDown size={12} />
                            </button>
                            {showCurrency && (
                                <div className="absolute top-full right-0 mt-1 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 min-w-36 max-h-64 overflow-y-auto">
                                    {currencies.map(c => (
                                        <button
                                            key={c.code}
                                            onClick={() => { setCurrency(c.code); setShowCurrency(false); }}
                                            className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${c.code === selected.code ? "bg-[#003b94] text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                        >
                                            <span className="w-5 text-center font-bold">{c.symbol}</span>
                                            <span>{c.code}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Language */}
                        <LanguageSwitcher />

                        {/* Wishlist */}
                        <Link href="/wishlist" className="relative hover:bg-white/10 px-2 py-2 rounded transition-colors flex items-center justify-center">
                            <Heart size={18} className="text-white" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                                    {wishlistCount > 9 ? "9+" : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* My Bookings (logged in only) */}
                        {isLoggedIn && (
                            <Link href="/my-bookings" className="hidden sm:block hover:bg-white/10 px-3 py-1.5 rounded transition-colors text-amber-300 font-semibold text-sm whitespace-nowrap">
                                My Bookings
                            </Link>
                        )}

                        {/* Auth */}
                        {isLoggedIn ? (
                            <button
                                onClick={() => { localStorage.removeItem("token"); setIsLoggedIn(false); window.location.reload(); }}
                                className="bg-white text-red-600 border border-red-200 rounded px-2 sm:px-3 py-1.5 font-semibold hover:bg-red-50 transition-colors text-xs sm:text-sm"
                            >
                                Sign out
                            </button>
                        ) : (
                            <>
                                <Link href="/register" className="text-[#006ae3] bg-white border border-[#006ae3] rounded px-2 sm:px-3 py-1.5 transition-colors text-xs sm:text-sm leading-none">
                                    Register
                                </Link>
                                <Link href="/signin" className="bg-white text-[#003580] border border-white rounded px-2 sm:px-3 py-1.5 font-semibold hover:bg-blue-50 transition-colors text-xs sm:text-sm leading-none">
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Nav tabs */}
                <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-3">
                    {NAV_ITEMS.map(({ icon: Icon, label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 rounded-[30px] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                                activeTab === label
                                    ? "border border-white bg-white/10 text-white"
                                    : "text-white hover:bg-white/10"
                            }`}
                        >
                            <Icon size={14} />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
