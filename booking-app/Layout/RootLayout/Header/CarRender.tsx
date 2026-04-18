"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    Bed, BedDouble, Plane, Car, Ticket,
    MapPin, Calendar, Search,
    X, ChevronDown, ChevronLeft, ChevronRight, Clock, Heart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";

const SUGGESTIONS = [
    "Baku, Azerbaijan",
    "Baku Bay",
    "Baku Old City",
    "Bakuriani, Georgia",
];

const FLEX_OPTIONS = [
    { label: "Exact dates", value: null },
    { label: "+ 1 day", value: 1 },
    { label: "+ 2 days", value: 2 },
    { label: "+ 3 days", value: 3 },
    { label: "+ 7 days", value: 7 },
];

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
    return (new Date(year, month, 1).getDay() + 6) % 7;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
    return (
        !!a && !!b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isBetween(date: Date, start: Date | null, end: Date | null): boolean {
    return !!start && !!end && date > start && date < end;
}

function formatDate(date: Date | null): string | null {
    if (!date) return null;
    const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${WEEK_DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}

interface CalendarMonthProps {
    year: number;
    month: number;
    checkIn: Date | null;
    checkOut: Date | null;
    hoveredDate: Date | null;
    onDayClick: (date: Date) => void;
    onDayHover: (date: Date | null) => void;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
}

function CalendarMonth({ year, month, checkIn, checkOut, hoveredDate, onDayClick, onDayHover, onMonthChange, onYearChange }: CalendarMonthProps) {
    const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
    const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
                setShowMonthPicker(false);
                setShowYearPicker(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const cells = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ];

    const currentYear = TODAY.getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear + i);
    const rangeEnd = checkOut || hoveredDate;

    return (
        <div className="w-65 -mt-7.5">
            <div ref={headerRef} className="flex items-center justify-center gap-1 mb-3 relative">
                <div className="relative">
                    <button
                        onClick={() => { setShowMonthPicker(v => !v); setShowYearPicker(false); }}
                        className="font-semibold text-gray-800 hover:text-[#003b94] flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-blue-50 transition-colors"
                    >
                        {MONTHS[month]}
                        <ChevronDown size={13} className="text-gray-500" />
                    </button>
                    {showMonthPicker && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-100 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 w-35 mt-1 max-h-55 overflow-y-auto">
                            {MONTHS.map((m, i) => {
                                const isPast = year === currentYear && i < TODAY.getMonth();
                                return (
                                    <div
                                        key={m}
                                        onClick={() => { if (!isPast) { onMonthChange(i); setShowMonthPicker(false); } }}
                                        className={`px-4 py-1.5 text-sm transition-colors ${isPast ? "text-gray-300 cursor-not-allowed" :
                                            i === month ? "bg-[#003b94] text-white font-semibold cursor-pointer" :
                                                "text-gray-700 hover:bg-gray-50 cursor-pointer"
                                            }`}
                                    >
                                        {m}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={() => { setShowYearPicker(v => !v); setShowMonthPicker(false); }}
                        className="font-semibold text-gray-800 hover:text-[#003b94] flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-blue-50 transition-colors"
                    >
                        {year}
                        <ChevronDown size={13} className="text-gray-500" />
                    </button>
                    {showYearPicker && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-100 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 w-22.5 mt-1 max-h-55 overflow-y-auto">
                            {years.map((y: number) => (
                                <div
                                    key={y}
                                    onClick={() => { onYearChange(y); setShowYearPicker(false); }}
                                    className={`px-4 py-1.5 text-sm cursor-pointer transition-colors ${y === year ? "bg-[#003b94] text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                    {y}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d: string) => (
                    <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {cells.map((date: Date | null, i: number) => {
                    if (!date) return <div key={i} />;
                    const isPast = date < TODAY;
                    const isCheckIn = isSameDay(date, checkIn);
                    const isCheckOut = isSameDay(date, checkOut);
                    const inRange = checkIn && rangeEnd && isBetween(
                        date,
                        checkIn < rangeEnd ? checkIn : rangeEnd,
                        checkIn < rangeEnd ? rangeEnd : checkIn,
                    );
                    let cls = "flex items-center justify-center h-9 text-sm transition-all select-none ";
                    if (isCheckIn || isCheckOut) {
                        cls += "rounded-full bg-[#003b94] text-white ";
                    } else if (inRange) {
                        cls += "bg-[#ebf3ff] text-[#003b94] ";
                    } else if (!checkOut && isSameDay(date, hoveredDate) && checkIn) {
                        cls += "rounded-full bg-[#ebf3ff] text-[#003b94] ";
                    } else if (isPast) {
                        cls += "rounded-full text-gray-300 cursor-not-allowed ";
                    } else {
                        cls += "rounded-full text-gray-800 cursor-pointer hover:bg-[#003b94] hover:text-white ";
                    }
                    return (
                        <div
                            key={i}
                            className={cls}
                            onClick={() => !isPast && onDayClick(date)}
                            onMouseEnter={() => !isPast && onDayHover(date)}
                        >
                            {date.getDate()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const initRight = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 1);
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

const NAV_ITEMS = [
    { icon: Bed, labelKey: "stays" as const, href: "/" },
    { icon: BedDouble, labelKey: "buildings" as const, href: "/filter" },
    { icon: Plane, labelKey: "flights" as const, href: "/flights" },
    { icon: Car, labelKey: "carRental" as const, href: "/carrender" },
    { icon: Ticket, labelKey: "attractions" as const, href: "/attractions" },
];

export default function CarRentalHeader() {
    const tNav = useTranslations("nav");
    const tHeader = useTranslations("header");
    const router = useRouter();
    const pathname = usePathname();
    const { count: wishlistCount } = useWishlist();
    const { currencies, selected, setCurrency } = useCurrency();
    const [showCurrency, setShowCurrency] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const currencyRef = useRef<HTMLDivElement>(null);
    const activeNav = useMemo(() => {
        const p = pathname.replace(/^\/(en|tr|ru)(\/|$)/, "/").replace(/\/$/, "") || "/";
        const match = NAV_ITEMS.slice().reverse().find(({ href }) => href !== "/" && p.startsWith(href));
        return match ? match.labelKey : "stays";
    }, [pathname]);
    const [showLocation, setShowLocation] = useState<boolean>(false);
    const [showDate, setShowDate] = useState<boolean>(false);
    const [pickupLocation, setPickupLocation] = useState<string>("");
    const [dropoffLocation, setDropoffLocation] = useState<string>("");
    const [showDropoffSuggestions, setShowDropoffSuggestions] = useState<boolean>(false);
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [pickupTime, setPickupTime] = useState<string>("10:00");
    const [dropoffTime, setDropoffTime] = useState<string>("10:00");
    const [flexDays, setFlexDays] = useState<number | null>(null);
    const [leftYear, setLeftYear] = useState<number>(TODAY.getFullYear());
    const [leftMonth, setLeftMonth] = useState<number>(TODAY.getMonth());
    const [rightYear, setRightYear] = useState<number>(initRight.getFullYear());
    const [rightMonth, setRightMonth] = useState<number>(initRight.getMonth());
    const [differentDropoff] = useState<boolean>(true);
    const locationRef = useRef<HTMLDivElement>(null);
    const dropoffRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
        const handler = (e: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocation(false);
            if (dropoffRef.current && !dropoffRef.current.contains(e.target as Node)) setShowDropoffSuggestions(false);
            if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDate(false);
            if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) setShowCurrency(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const prevMonth = (): void => {
        const d = new Date(leftYear, leftMonth - 1, 1);
        setLeftYear(d.getFullYear());
        setLeftMonth(d.getMonth());
    };

    const nextMonth = (): void => {
        const newLeft = new Date(leftYear, leftMonth + 1, 1);
        setLeftYear(newLeft.getFullYear());
        setLeftMonth(newLeft.getMonth());
        if (newLeft >= new Date(rightYear, rightMonth, 1)) {
            const newRight = new Date(newLeft.getFullYear(), newLeft.getMonth() + 1, 1);
            setRightYear(newRight.getFullYear());
            setRightMonth(newRight.getMonth());
        }
    };

    const isAtStart = leftYear === TODAY.getFullYear() && leftMonth === TODAY.getMonth();

    const handleDayClick = (date: Date): void => {
        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(date);
            setCheckOut(null);
        } else if (date < checkIn) {
            setCheckOut(checkIn);
            setCheckIn(date);
        } else if (isSameDay(date, checkIn)) {
            setCheckIn(null);
        } else {
            setCheckOut(date);
        }
    };

    const toDateStr = (d: Date | null) =>
        d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "";

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (pickupLocation) params.set("city", pickupLocation);
        if (checkIn) params.set("pickUp", toDateStr(checkIn));
        if (checkOut) params.set("dropOff", toDateStr(checkOut));
        router.push(`/carfilter?${params.toString()}`);
    };

    return (
        <div className="font-sans">
            <div className="bg-[#003b94] px-4 sm:px-6 pt-3">
                <div className="max-w-7xl mx-auto">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-5">
                        <Link href="/">
                            <img
                                src="https://miro.medium.com/1*vKT1xQFxhP2hJuRB8_sn1g.png"
                                alt="Booking.com"
                                className="h-12 sm:h-16 object-contain cursor-pointer"
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
                                    <Link href="/register" className="text-[#006ae3] bg-white border border-[#006ae3] rounded px-2 sm:px-3 py-1.5 transition-colors text-xs sm:text-sm leading-none">{tHeader("register")}</Link>
                                    <Link href="/signin" className="bg-white text-[#003580] border border-white rounded px-2 sm:px-3 py-1.5 font-semibold hover:bg-blue-50 transition-colors text-xs sm:text-sm leading-none">{tHeader("signIn")}</Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Nav tabs */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                        {NAV_ITEMS.map(({ icon: Icon, labelKey, href }) => (
                            <Link
                                key={labelKey}
                                href={href}
                                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-[30px] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${activeNav === labelKey
                                    ? "border border-white bg-white/10 text-white"
                                    : "text-white hover:bg-white/10"
                                    }`}
                            >
                                <Icon size={15} />
                                {tNav(labelKey)}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[#003b94] px-4 sm:px-6 pb-10">
                <div className="max-w-6xl mx-auto sm:translate-y-16">
                    <h1 className="text-white text-2xl sm:text-5xl font-bold mb-1 sm:mb-2">{tHeader("carHireTitle")}</h1>
                    <p className="text-white/90 text-base sm:text-2xl mb-4 sm:mb-7">{tHeader("carHireSubtitle")}</p>

                    {/* Search bar */}
                    <div className="flex flex-col sm:flex-wrap sm:flex-row gap-1 bg-[#febb02] p-1 rounded-lg">

                        {/* Pick-up location */}
                        <div ref={locationRef} className="relative flex-1 sm:min-w-50">
                            <div
                                onClick={() => { setShowLocation(v => !v); setShowDropoffSuggestions(false); setShowDate(false); }}
                                className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                            >
                                <Search size={20} className="text-gray-500 shrink-0" />
                                <input
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    placeholder={tHeader("pickupLocation")}
                                    className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {pickupLocation && (
                                    <X size={15} className="text-gray-400 cursor-pointer hover:text-gray-600"
                                        onClick={(e) => { e.stopPropagation(); setPickupLocation(""); }} />
                                )}
                            </div>
                            {showLocation && (
                                <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-white rounded-xl shadow-2xl min-w-60 overflow-hidden">
                                    {SUGGESTIONS.filter(s => s.toLowerCase().includes(pickupLocation.toLowerCase())).map(s => (
                                        <div key={s} onClick={() => { setPickupLocation(s); setShowLocation(false); }}
                                            className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                                            <MapPin size={14} className="text-gray-400" />{s}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Drop-off location */}
                        {differentDropoff && (
                            <div ref={dropoffRef} className="relative flex-1 sm:min-w-50">
                                <div
                                    onClick={() => { setShowDropoffSuggestions(v => !v); setShowLocation(false); setShowDate(false); }}
                                    className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                                >
                                    <Search size={20} className="text-gray-500 shrink-0" />
                                    <input
                                        value={dropoffLocation}
                                        onChange={(e) => setDropoffLocation(e.target.value)}
                                        placeholder={tHeader("dropoffLocation")}
                                        className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    {dropoffLocation && (
                                        <X size={15} className="text-gray-400 cursor-pointer hover:text-gray-600"
                                            onClick={(e) => { e.stopPropagation(); setDropoffLocation(""); }} />
                                    )}
                                </div>
                                {showDropoffSuggestions && (
                                    <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-white rounded-xl shadow-2xl min-w-60 overflow-hidden">
                                        {SUGGESTIONS.filter(s => s.toLowerCase().includes(dropoffLocation.toLowerCase())).map(s => (
                                            <div key={s} onClick={() => { setDropoffLocation(s); setShowDropoffSuggestions(false); }}
                                                className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                                                <MapPin size={14} className="text-gray-400" />{s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pick-up date */}
                        <div ref={dateRef} className="relative flex-1 sm:min-w-40">
                            <div
                                onClick={() => { setShowDate(v => !v); setShowLocation(false); setShowDropoffSuggestions(false); }}
                                className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                            >
                                <Calendar size={20} className="text-gray-500 shrink-0" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs text-gray-400">{tHeader("pickupDate")}</span>
                                    <span className="text-sm text-gray-800 whitespace-nowrap">
                                        {checkIn ? formatDate(checkIn) : tHeader("selectDate")}
                                    </span>
                                </div>
                            </div>

                            {/* Calendar dropdown */}
                            {showDate && (
                                <div className="absolute top-[calc(100%+8px)] left-0 z-200 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 min-w-145">
                                    {/* Flex options */}
                                    <div className="flex gap-2 mb-4 border-b border-gray-100 pb-3">
                                        {FLEX_OPTIONS.map(opt => (
                                            <button
                                                key={opt.label}
                                                onClick={() => setFlexDays(opt.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${flexDays === opt.value ? "bg-[#003b94] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Month navigation */}
                                    <div className="flex items-start gap-6">
                                        <div className="relative">
                                            <button
                                                onClick={prevMonth}
                                                disabled={isAtStart}
                                                className={`absolute left-0 top-0 p-1 rounded-full transition-colors ${isAtStart ? "text-gray-200 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <CalendarMonth
                                                year={leftYear}
                                                month={leftMonth}
                                                checkIn={checkIn}
                                                checkOut={checkOut}
                                                hoveredDate={hoveredDate}
                                                onDayClick={handleDayClick}
                                                onDayHover={setHoveredDate}
                                                onMonthChange={(m) => setLeftMonth(m)}
                                                onYearChange={(y) => setLeftYear(y)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={nextMonth}
                                                className="absolute right-0 top-0 p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                            <CalendarMonth
                                                year={rightYear}
                                                month={rightMonth}
                                                checkIn={checkIn}
                                                checkOut={checkOut}
                                                hoveredDate={hoveredDate}
                                                onDayClick={handleDayClick}
                                                onDayHover={setHoveredDate}
                                                onMonthChange={(m) => setRightMonth(m)}
                                                onYearChange={(y) => setRightYear(y)}
                                            />
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                        <div className="text-sm text-gray-500">
                                            {checkIn && checkOut
                                                ? `${formatDate(checkIn)} → ${formatDate(checkOut)}`
                                                : checkIn
                                                    ? tHeader("selectDropoff")
                                                    : tHeader("selectPickup")}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setCheckIn(null); setCheckOut(null); }}
                                                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                {tHeader("clear")}
                                            </button>
                                            <button
                                                onClick={() => setShowDate(false)}
                                                className="text-xs bg-[#003b94] text-white px-4 py-1.5 rounded-lg hover:bg-[#002d73] transition-colors font-medium"
                                            >
                                                {tHeader("done")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pick-up time */}
                        <div className="relative sm:min-w-28">
                            <div className="flex items-center gap-2 bg-white rounded h-13 px-3.5">
                                <Clock size={18} className="text-gray-500 shrink-0" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs text-gray-400">{tHeader("time")}</span>
                                    <select
                                        value={pickupTime}
                                        onChange={(e) => setPickupTime(e.target.value)}
                                        className="text-sm text-gray-800 bg-transparent outline-none cursor-pointer"
                                    >
                                        {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Drop-off date */}
                        <div className="relative flex-1 sm:min-w-40">
                            <div
                                onClick={() => { setShowDate(true); setShowLocation(false); setShowDropoffSuggestions(false); }}
                                className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                            >
                                <Calendar size={20} className="text-gray-500 shrink-0" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs text-gray-400">{tHeader("dropoffDate")}</span>
                                    <span className="text-sm text-gray-800 whitespace-nowrap">
                                        {checkOut ? formatDate(checkOut) : tHeader("selectDate")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Drop-off time */}
                        <div className="relative sm:min-w-28">
                            <div className="flex items-center gap-2 bg-white rounded h-13 px-3.5">
                                <Clock size={18} className="text-gray-500 shrink-0" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs text-gray-400">{tHeader("time")}</span>
                                    <select
                                        value={dropoffTime}
                                        onChange={(e) => setDropoffTime(e.target.value)}
                                        className="text-sm text-gray-800 bg-transparent outline-none cursor-pointer"
                                    >
                                        {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Search button */}
                        <button onClick={handleSearch} className="bg-[#006ce4] hover:bg-[#005ea6] text-white font-bold text-base px-6 rounded-lg flex items-center justify-center gap-2 min-h-13 transition-colors w-full sm:w-auto sm:shrink-0">
                            <Search size={18} />
                            {tHeader("searchBtn")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}