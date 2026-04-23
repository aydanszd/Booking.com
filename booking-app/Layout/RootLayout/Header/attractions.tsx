"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Bed, BedDouble, Plane, Car, Ticket,
    MapPin, Calendar, Search,
    X, ChevronLeft, ChevronRight, ChevronDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/customThing/LanguageSwitcher";

const SUGGESTIONS = [
    "Baku, Azerbaijan",
    "Baku Bay",
    "Baku Old City",
    "Bakuriani, Georgia",
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

function CalendarMonth({
    year, month, checkIn, checkOut, hoveredDate,
    onDayClick, onDayHover, onMonthChange, onYearChange,
}: CalendarMonthProps) {
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
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
        <div className="w-65">
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
                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-100 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 w-36 mt-1 max-h-56 overflow-y-auto">
                            {MONTHS.map((m, i) => {
                                const isPast = year === currentYear && i < TODAY.getMonth();
                                return (
                                    <div
                                        key={m}
                                        onClick={() => { if (!isPast) { onMonthChange(i); setShowMonthPicker(false); } }}
                                        className={`px-4 py-1.5 text-sm transition-colors ${isPast
                                            ? "text-gray-300 cursor-not-allowed"
                                            : i === month
                                                ? "bg-[#003b94] text-white font-semibold cursor-pointer"
                                                : "text-gray-700 hover:bg-gray-50 cursor-pointer"
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
                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-100 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 w-24 mt-1 max-h-56 overflow-y-auto">
                            {years.map((y) => (
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
                {DAYS.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {cells.map((date: Date | null, i) => {
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

const NAV_ITEMS = [
    { icon: Bed, labelKey: "stays" as const, href: "/" },
    { icon: BedDouble, labelKey: "buildings" as const, href: "/filter" },
    { icon: Plane, labelKey: "flights" as const, href: "/flights" },
    { icon: Car, labelKey: "carRental" as const, href: "/carrender" },
    { icon: Ticket, labelKey: "attractions" as const, href: "/attractions" },
];

export default function AttractionsHeader() {
    const tNav = useTranslations("nav");
    const tHeader = useTranslations("header");
    const pathname = usePathname();
    const activeNav = useMemo(() => {
        const p = pathname.replace(/^\/(en|tr|ru)(\/|$)/, "/").replace(/\/$/, "") || "/";
        const match = NAV_ITEMS.slice().reverse().find(({ href }) => href !== "/" && p.startsWith(href));
        return match ? match.labelKey : "stays";
    }, [pathname]);
    const [destination, setDestination] = useState("");
    const [showLocation, setShowLocation] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [leftYear, setLeftYear] = useState(TODAY.getFullYear());
    const [leftMonth, setLeftMonth] = useState(TODAY.getMonth());
    const [rightYear, setRightYear] = useState(initRight.getFullYear());
    const [rightMonth, setRightMonth] = useState(initRight.getMonth());
    const locationRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocation(false);
            if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDate(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const isAtStart = leftYear === TODAY.getFullYear() && leftMonth === TODAY.getMonth();

    const prevMonth = () => {
        const d = new Date(leftYear, leftMonth - 1, 1);
        setLeftYear(d.getFullYear());
        setLeftMonth(d.getMonth());
    };

    const nextMonth = () => {
        const newLeft = new Date(leftYear, leftMonth + 1, 1);
        setLeftYear(newLeft.getFullYear());
        setLeftMonth(newLeft.getMonth());
        if (newLeft >= new Date(rightYear, rightMonth, 1)) {
            const newRight = new Date(newLeft.getFullYear(), newLeft.getMonth() + 1, 1);
            setRightYear(newRight.getFullYear());
            setRightMonth(newRight.getMonth());
        }
    };

    const handleDayClick = (date: Date) => {
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

    const handleSearch = () => {
        const url = `/filter${destination ? `?city=${encodeURIComponent(destination)}` : ''}`;
        window.location.href = url;
    };

    const dateLabel =
        checkIn && checkOut ? `${formatDate(checkIn)} — ${formatDate(checkOut)}` :
            checkIn ? `${formatDate(checkIn)} — ?` :
                tHeader("selectDate");

    return (
        <div className="font-sans relative z-10">
            <div className="bg-[#003b94] px-3 sm:px-6 pt-3">
                <div className="max-w-6xl mx-auto">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-3 sm:mb-5">
                        <Link href="/">
                            <img
                                src="https://miro.medium.com/1*vKT1xQFxhP2hJuRB8_sn1g.png"
                                alt="Booking.com"
                                className="h-10 sm:h-16 object-contain cursor-pointer"
                            />
                        </Link>
                        <div className="flex items-center gap-1 sm:gap-3 text-white text-sm font-medium">
                            <LanguageSwitcher />
                            <Link href="/admin/dashboard" className="hidden sm:block hover:bg-white/10 px-3 py-3 rounded transition-colors text-[16px]">{tHeader("listProperty")}</Link>
                            <Link href="/register" className="text-[#006ae3] bg-white border border-[#006ae3] rounded px-2 sm:px-3 py-1.5 cursor-pointer transition-colors block leading-none text-xs sm:text-sm">{tHeader("register")}</Link>
                            <Link href="/signin" className="bg-white text-[#006ae3] border border-[#006ae3] rounded px-2 sm:px-3 py-2 cursor-pointer font-semibold hover:bg-gray-100 transition-colors block leading-none text-xs sm:text-sm">{tHeader("signIn")}</Link>
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="flex gap-1 -mt-2 sm:-mt-4.5 overflow-x-auto scrollbar-hide pb-1">
                        {NAV_ITEMS.map(({ icon: Icon, labelKey, href }) => (
                            <Link
                                key={labelKey}
                                href={href}
                                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-3 rounded-[30px] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${activeNav === labelKey
                                    ? "border border-white bg-white/10 text-white"
                                    : "text-white hover:bg-white/10"
                                }`}
                            >
                                <Icon size={14} />
                                {tNav(labelKey)}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[#003b94] px-3 sm:px-6 pb-6 sm:pb-10">
                <div className="max-w-6xl mx-auto sm:translate-y-15">
                    <h1 className="text-white text-2xl sm:text-5xl font-bold mb-1 sm:mb-2">
                        {tHeader("attractionsTitle")}
                    </h1>
                    <p className="text-white/90 text-sm sm:text-2xl mb-4 sm:mb-7">
                        {tHeader("attractionsSubtitle")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-1 bg-[#febb02] p-1 rounded-lg">
                        {/* Location */}
                        <div ref={locationRef} className="relative w-full sm:flex-1">
                            <div
                                onClick={() => { setShowLocation(v => !v); setShowDate(false); }}
                                className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                            >
                                <Search size={22} className="text-gray-500 shrink-0" />
                                <input
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder={tHeader("searchPlaceholder")}
                                    className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {destination && (
                                    <X size={15} className="text-gray-400 cursor-pointer hover:text-gray-600 shrink-0"
                                        onClick={(e) => { e.stopPropagation(); setDestination(""); }} />
                                )}
                            </div>
                            {showLocation && (
                                <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-white rounded-xl shadow-2xl min-w-60 overflow-hidden">
                                    {SUGGESTIONS
                                        .filter(s => s.toLowerCase().includes(destination.toLowerCase()))
                                        .map(s => (
                                            <div key={s} onClick={() => { setDestination(s); setShowLocation(false); }}
                                                className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                                                <MapPin size={14} className="text-gray-400" />{s}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Date */}
                        <div ref={dateRef} className="relative w-full sm:flex-1">
                            <div
                                onClick={() => { setShowDate(v => !v); setShowLocation(false); }}
                                className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                            >
                                <Calendar size={22} className="text-gray-500 shrink-0" />
                                <span className="text-sm text-gray-800 whitespace-nowrap truncate">{dateLabel}</span>
                            </div>
                            {showDate && (
                                <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-white rounded-xl shadow-2xl w-[calc(100vw-1.5rem)] sm:min-w-150 sm:w-auto overflow-hidden">
                                    <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 pt-4 sm:pt-5 pb-3">
                                        <button onClick={prevMonth} disabled={isAtStart}
                                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0">
                                            <ChevronLeft size={18} className="text-gray-600" />
                                        </button>
                                        <div className="flex gap-4 sm:gap-8 flex-1 justify-center overflow-hidden" onMouseLeave={() => setHoveredDate(null)}>
                                            <CalendarMonth
                                                year={leftYear} month={leftMonth}
                                                checkIn={checkIn} checkOut={checkOut} hoveredDate={hoveredDate}
                                                onDayClick={handleDayClick} onDayHover={setHoveredDate}
                                                onMonthChange={setLeftMonth} onYearChange={setLeftYear}
                                            />
                                            <div className="hidden sm:block">
                                                <CalendarMonth
                                                    year={rightYear} month={rightMonth}
                                                    checkIn={checkIn} checkOut={checkOut} hoveredDate={hoveredDate}
                                                    onDayClick={handleDayClick} onDayHover={setHoveredDate}
                                                    onMonthChange={setRightMonth} onYearChange={setRightYear}
                                                />
                                            </div>
                                        </div>
                                        <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0">
                                            <ChevronRight size={18} className="text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-100">
                                        <button onClick={() => { setCheckIn(null); setCheckOut(null); }}
                                            className="text-sm text-[#0071c2] underline hover:no-underline">
                                            {tHeader("clearDates")}
                                        </button>
                                        <button onClick={() => setShowDate(false)}
                                            className="bg-[#0071c2] hover:bg-[#005ea6] text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors">
                                            {tHeader("apply")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

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
