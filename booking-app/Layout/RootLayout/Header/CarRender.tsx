"use client";
import { useState, useRef, useEffect } from "react";
import {
    Bed, Plane, Car, Ticket, CarTaxiFront,
    MapPin, Calendar, Users, Search,
    X, ChevronDown, Plus, Minus, ChevronLeft, ChevronRight, BedDouble, Clock,
} from "lucide-react";

const NAV_ITEMS = [
    { icon: Bed, label: "Stays" },
    { icon: Plane, label: "Flights" },
    { icon: Car, label: "Car rental" },
    { icon: Ticket, label: "Attractions" },
    { icon: CarTaxiFront, label: "Airport taxis" },
];

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
        a && b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    ) as boolean;
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
        <div className="w-65 mt-[-30px]">
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

export default function CarRentalHeader() {
    const [activeNav, setActiveNav] = useState<string>("Car rental");
    const [showLocation, setShowLocation] = useState<boolean>(false);
    const [showDate, setShowDate] = useState<boolean>(false);
    const [calendarTab, setCalendarTab] = useState<string>("calendar");
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
    const [differentDropoff, setDifferentDropoff] = useState<boolean>(true);
    const locationRef = useRef<HTMLDivElement>(null);
    const dropoffRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocation(false);
            if (dropoffRef.current && !dropoffRef.current.contains(e.target as Node)) setShowDropoffSuggestions(false);
            if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDate(false);
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

    return (
        <div className="font-sans">
            <div className="bg-[#003b94] px-6 pt-3">
                <div className="max-w-6xl mx-auto">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-5">
                        <img
                            src="https://miro.medium.com/1*vKT1xQFxhP2hJuRB8_sn1g.png"
                            alt="Booking.com"
                            className="h-16 object-contain cursor-pointer"
                        />
                        <div className="flex items-center gap-3 text-white text-sm font-medium">
                            <button className="hover:bg-white/10 px-3 py-3 rounded transition-colors text-[16px]">USD</button>
                            <button className="hover:bg-white/10 px-3 py-3 rounded transition-colors">
                                <img src="https://flagcdn.com/w40/gb.png" alt="English" className="w-6 h-6 rounded-full object-cover" />
                            </button>
                            <button className="hover:bg-white/10 px-3 py-3 rounded transition-colors flex items-center justify-center">
                                <span className="w-6 h-6 flex items-center justify-center border border-white rounded-full text-xs">?</span>
                            </button>
                            <button className="hover:bg-white/10 px-3 py-1 rounded transition-colors text-[16px]">List your property</button>
                            <button className="text-[#006ae3] bg-white border border-[#006ae3] rounded px-3 py-1.75 cursor-pointer transition-colors">Register</button>
                            <button className="bg-white text-[#006ae3] border border-[#006ae3] rounded px-3 py-2 cursor-pointer font-semibold hover:bg-gray-100 transition-colors">Sign in</button>
                        </div>
                    </div>

                    {/* Nav tabs */}
                    <div className="flex gap-1 -mt-4.5">
                        {NAV_ITEMS.map(({ icon: Icon, label }) => (
                            <button
                                key={label}
                                onClick={() => setActiveNav(label)}
                                className={`flex items-center gap-1.5 px-4 py-3 rounded-[30px] text-sm font-medium transition-colors ${activeNav === label
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
            </div>

            <div className="bg-[#003b94] px-6 pb-10">
                <div className="max-w-6xl mx-auto translate-y-16">
                    <h1 className="text-white text-5xl font-bold mb-2">Car hire for any kind of trip</h1>
                    <p className="text-white/90 text-2xl mb-7">Great cars at great prices, from the biggest car rental companies</p>

                    {/* Search bar */}
                    <div className="flex flex-wrap gap-1 bg-[#febb02] p-1 rounded-lg">

                        {/* Pick-up location */}
                        <div ref={locationRef} className="relative flex-1 min-w-50">
                            <div
                                onClick={() => { setShowLocation(v => !v); setShowDropoffSuggestions(false); setShowDate(false); }}
                                className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                            >
                                <Search size={20} className="text-gray-500 shrink-0" />
                                <input
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    placeholder="Pick-up location"
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
                            <div ref={dropoffRef} className="relative flex-1 min-w-50">
                                <div
                                    onClick={() => { setShowDropoffSuggestions(v => !v); setShowLocation(false); setShowDate(false); }}
                                    className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                                >
                                    <Search size={20} className="text-gray-500 shrink-0" />
                                    <input
                                        value={dropoffLocation}
                                        onChange={(e) => setDropoffLocation(e.target.value)}
                                        placeholder="Drop-off location"
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
                        <div ref={dateRef} className="relative flex-1 min-w-40">
                            <div
                                onClick={() => { setShowDate(v => !v); setShowLocation(false); setShowDropoffSuggestions(false); }}
                                className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                            >
                                <Calendar size={20} className="text-gray-500 shrink-0" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs text-gray-400">Pick-up date</span>
                                    <span className="text-sm text-gray-800 whitespace-nowrap">
                                        {checkIn ? formatDate(checkIn) : "Select date"}
                                    </span>
                                </div>
                            </div>

                            {showDate && (
                                <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-white rounded-xl shadow-2xl min-w-150">
                                    <div className="flex border-b border-gray-100">
                                        {["calendar", "flexible"].map(tab => (
                                            <button key={tab} onClick={() => setCalendarTab(tab)}
                                                className={`flex-1 py-3 text-sm font-medium transition-colors ${calendarTab === tab ? "text-[#0071c2] border-b-2 border-[#0071c2]" : "text-gray-500 hover:text-gray-700"}`}>
                                                {tab === "calendar" ? "Calendar" : "I'm flexible"}
                                            </button>
                                        ))}
                                    </div>
                                    {calendarTab === "calendar" && (
                                        <>
                                            <div className="flex items-center gap-4 px-5 pt-5 pb-3">
                                                <button onClick={prevMonth} disabled={isAtStart}
                                                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <ChevronLeft size={18} className="text-gray-600" />
                                                </button>
                                                <div className="flex gap-8 flex-1 justify-center" onMouseLeave={() => setHoveredDate(null)}>
                                                    <CalendarMonth year={leftYear} month={leftMonth} checkIn={checkIn} checkOut={checkOut}
                                                        hoveredDate={hoveredDate} onDayClick={handleDayClick} onDayHover={setHoveredDate}
                                                        onMonthChange={setLeftMonth} onYearChange={setLeftYear} />
                                                    <CalendarMonth year={rightYear} month={rightMonth} checkIn={checkIn} checkOut={checkOut}
                                                        hoveredDate={hoveredDate} onDayClick={handleDayClick} onDayHover={setHoveredDate}
                                                        onMonthChange={setRightMonth} onYearChange={setRightYear} />
                                                </div>
                                                <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                                    <ChevronRight size={18} className="text-gray-600" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 px-5 pt-3 pb-4 border-t border-gray-100">
                                                {FLEX_OPTIONS.map(opt => (
                                                    <button key={opt.label} onClick={() => setFlexDays(opt.value)}
                                                        className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${flexDays === opt.value ? "border-[#003b94] text-[#003b94] bg-blue-50" : "border-gray-300 text-gray-700 hover:border-gray-400"}`}>
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {calendarTab === "flexible" && (
                                        <div className="px-5 py-8 text-center text-gray-500 text-sm">Flexible dates coming soon</div>
                                    )}
                                    <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-100">
                                        <button onClick={() => { setCheckIn(null); setCheckOut(null); }}
                                            className="text-sm text-[#0071c2] underline hover:no-underline">Clear dates</button>
                                        <button onClick={() => setShowDate(false)}
                                            className="bg-[#0071c2] hover:bg-[#005ea6] text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors">Apply</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pick-up time */}
                        <div className="relative min-w-28">
                            <div className="flex items-center gap-2 bg-white rounded h-13 px-3.5">
                                <Clock size={18} className="text-gray-500 shrink-0" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs text-gray-400">Time</span>
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
                        <div className="relative flex-1 min-w-40">
                            <div
                                onClick={() => { setShowDate(true); setShowLocation(false); setShowDropoffSuggestions(false); }}
                                className="flex items-center gap-2.5 bg-white rounded h-13 px-3.5 cursor-pointer"
                            >
                                <Calendar size={20} className="text-gray-500 shrink-0" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs text-gray-400">Drop-off date</span>
                                    <span className="text-sm text-gray-800 whitespace-nowrap">
                                        {checkOut ? formatDate(checkOut) : "Select date"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Drop-off time */}
                        <div className="relative min-w-28">
                            <div className="flex items-center gap-2 bg-white rounded h-13 px-3.5">
                                <Clock size={18} className="text-gray-500 shrink-0" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs text-gray-400">Time</span>
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
                        <button className="bg-[#006ce4] hover:bg-[#005ea6] text-white font-bold text-base px-6 rounded-lg flex items-center gap-2 min-h-13 transition-colors shrink-0">
                            <Search size={18} />
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}