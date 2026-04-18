"use client"
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ArrowLeftRight, ChevronLeft, ChevronRight, Users, Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

interface CalendarMonthProps {
    year: number;
    month: number;
    selected: Date[];
    hovered: Date | null;
    onSelect: (date: Date) => void;
    onHover: (date: Date) => void;
}

function CalendarMonth({ year, month, selected, hovered, onSelect, onHover }: CalendarMonthProps) {
    const label = new Date(year, month, 1).toLocaleString(undefined, { month: "long" });
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month);
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

    const today = new Date(); today.setHours(0, 0, 0, 0);

    return (
        <div className="flex-1 min-w-0">
            <p className="text-center font-semibold text-gray-800 mb-3 text-sm">{label} {year}</p>
            <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {cells.map((date, i) => {
                    if (!date) return <div key={i} />;
                    const isPast = date < today;
                    const isStart = selected[0] && date.toDateString() === selected[0].toDateString();
                    const isEnd = selected[1] && date.toDateString() === selected[1].toDateString();
                    const isSelected = isStart || isEnd;
                    const rangeEnd = selected[1] || hovered;
                    const inRange = selected[0] && rangeEnd && date > selected[0] && date < rangeEnd;

                    return (
                        <div
                            key={i}
                            onClick={() => !isPast && onSelect(date)}
                            onMouseEnter={() => !isPast && onHover(date)}
                            className={`
                relative text-center text-sm py-1.5 cursor-pointer select-none transition-colors
                ${isPast ? "text-gray-300 cursor-default pointer-events-none" : ""}
                ${isSelected ? "z-10" : ""}
                ${inRange ? "bg-blue-50" : ""}
              `}
                        >
                            {isSelected ? (
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold text-sm">
                                    {date.getDate()}
                                </span>
                            ) : (
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm
                  ${!isPast ? "hover:bg-gray-100" : ""}
                `}>
                                    {date.getDate()}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function FlightsDates() {
    const t = useTranslations("flights");
    const router = useRouter();
    const [from, setFrom] = useState("Baku (BAK)");
    const [to, setTo] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [selected, setSelected] = useState<Date[]>([]);
    const [hovered, setHovered] = useState<Date | null>(null);
    const [calTab, setCalTab] = useState("DATES");
    const [monthOffset, setMonthOffset] = useState(0);
    const [showGuests, setShowGuests] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const calRef = useRef<HTMLDivElement>(null);
    const guestRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    const maxOffset = (2027 - today.getFullYear()) * 12 + (1 - today.getMonth()) - 1;

    const base = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const m1 = { year: base.getFullYear(), month: base.getMonth() };
    const m2date = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    const m2 = { year: m2date.getFullYear(), month: m2date.getMonth() };

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (calRef.current && !calRef.current.contains(e.target as Node)) {
                setShowCalendar(false);
            }
            if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
                setShowGuests(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function handleSelect(date: Date) {
        if (selected.length === 0 || selected.length === 2) {
            setSelected([date]);
        } else {
            if (date < selected[0]) {
                setSelected([date]);
            } else {
                setSelected([selected[0], date]);
                setShowCalendar(false);
            }
        }
    }

    function fmt(date: Date | null) {
        if (!date) return null;
        return date.toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" });
    }

    const label1 = selected[0] ? fmt(selected[0]) : "Wed 3/4";
    const label2 = selected[1] ? fmt(selected[1]) : "Wed 3/4";
    const dateActive = showCalendar;

    const CAL_TABS = [
        { key: "DATES", label: t("calDates") },
        { key: "WEEKEND", label: t("calWeekend") },
        { key: "MONTH", label: t("calMonth") },
    ];

    return (
        <section className="bg-[#eef2f7] w-full py-10 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex items-center gap-8">

                {/* ── Left ── */}
                <div className="flex-1 min-w-0 relative">
                    <h1 className="text-2xl sm:text-[40px] font-bold text-[#1a1a2e] leading-snug mb-5">
                        {t("searchHundreds")}
                    </h1>

                    {/* Round-trip */}
                    <div className="mb-3">
                        <button className="flex items-center gap-1 text-sm text-gray-600 font-medium hover:bg-black/5 px-2 py-1 rounded transition-colors">
                            {t("roundTrip")} <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* Search bar — desktop: tek sıra, mobile: alt-alta */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-visible flex flex-col sm:flex-row sm:items-center sm:h-15">

                        {/* From + Swap + To — birinci sıra (mobile'da) */}
                        <div className="flex items-center sm:contents">
                            {/* From */}
                            <div className="flex items-center gap-2 px-3 py-3 flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-gray-200">
                                {from ? (
                                    <span className="flex items-center gap-1 text-sm text-black font-medium bg-gray-100 border rounded px-2 py-0.5 whitespace-nowrap">
                                        {from}
                                        <button onClick={() => setFrom("")} className="text-black hover:text-gray-600">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ) : (
                                    <input
                                        autoFocus
                                        className="text-sm text-black outline-none w-full"
                                        placeholder={t("fromPlaceholder")}
                                        onBlur={(e) => e.target.value && setFrom(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Swap */}
                            <button className="px-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0 border-b sm:border-b-0 border-gray-200 py-3">
                                <ArrowLeftRight size={15} />
                            </button>

                            {/* To */}
                            <div className="flex items-center px-3 py-3 flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-gray-200">
                                <input
                                    className="text-sm text-gray-400 outline-none w-full"
                                    placeholder={t("toPlaceholder")}
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Dates + Passengers — ikinci sıra (mobile'da) */}
                        <div className="flex items-center sm:contents">
                            {/* Departure date */}
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className={`flex items-center gap-1 px-4 py-3 border-r border-gray-200 shrink-0 transition-colors flex-1 sm:flex-none justify-center sm:justify-start
                    ${dateActive ? "border border-blue-500 rounded-sm bg-white shadow-md z-10 -mx-px" : "hover:bg-gray-50"}`}
                            >
                                <span className="text-sm text-gray-700">{label1}</span>
                            </button>

                            {/* Return date */}
                            <div className="flex items-center gap-1 px-4 py-3 border-r border-gray-200 shrink-0 cursor-pointer hover:bg-gray-50 flex-1 sm:flex-none justify-center sm:justify-start">
                                <span className="text-sm text-gray-700">{label2}</span>
                            </div>

                            {/* Passengers */}
                            <div className="relative flex-1 sm:flex-none" ref={guestRef}>
                                <button
                                    onClick={() => setShowGuests(!showGuests)}
                                    className="flex items-center gap-1.5 px-4 py-3 border-r border-gray-200 shrink-0 hover:bg-gray-50 transition-colors w-full justify-center sm:justify-start"
                                >
                                    <Users size={15} className="text-gray-400" />
                                    <span className="text-sm text-gray-700 whitespace-nowrap">
                                        {t("adultsChildrenLabel", { adults, children })}
                                    </span>
                                    <ChevronDown size={13} className="text-gray-400" />
                                </button>

                                {showGuests && (
                                    <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-64 p-5">
                                        {[
                                            { labelKey: "adultsLabel", subKey: "ageAdults", val: adults, set: setAdults, min: 1 },
                                            { labelKey: "childrenLabel", subKey: "ageChildren", val: children, set: setChildren, min: 0 },
                                        ].map(({ labelKey, subKey, val, set, min }) => (
                                            <div key={labelKey} className="flex items-center justify-between mb-5 last:mb-0">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{t(labelKey as any)}</p>
                                                    <p className="text-xs text-gray-400">{t(subKey as any)}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => set(Math.max(min, val - 1))}
                                                        disabled={val <= min}
                                                        className="w-7 h-7 rounded-full border border-blue-400 text-blue-500 flex items-center justify-center hover:bg-blue-50 disabled:opacity-30 disabled:cursor-default transition-colors"
                                                    >
                                                        <Minus size={13} />
                                                    </button>
                                                    <span className="w-4 text-center text-sm font-semibold text-gray-800">{val}</span>
                                                    <button
                                                        onClick={() => set(val + 1)}
                                                        className="w-7 h-7 rounded-full border border-blue-400 text-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                                                    >
                                                        <Plus size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setShowGuests(false)}
                                            className="mt-5 w-full bg-[#0071c2] hover:bg-[#005fa3] text-white font-bold py-2.5 rounded text-sm transition-colors"
                                        >
                                            {t("done")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search */}
                        <button
                            onClick={() => {
                                const originCity = from.replace(/\s*\(.*?\)/, "").trim();
                                const params = new URLSearchParams();
                                if (originCity) params.set("from", originCity);
                                if (to.trim()) params.set("to", to.trim());
                                params.set("adults", String(adults));
                                params.set("children", String(children));
                                if (selected[0]) params.set("date", selected[0].toISOString().split("T")[0]);
                                router.push(`/flightsdetail?${params.toString()}`);
                            }}
                            className="bg-[#0071c2] hover:bg-[#005fa3] text-white text-sm rounded-b-xl sm:rounded-[20px] font-bold px-6 py-3 transition-colors shrink-0 w-full sm:w-auto"
                        >
                            {t("searchBtn")}
                        </button>
                    </div>

                    {/* ── Calendar Dropdown ── */}
                    {showCalendar && (
                        <div
                            ref={calRef}
                            className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-155"
                        >
                            {/* Tabs + Departure/Return */}
                            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    {CAL_TABS.map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => setCalTab(key)}
                                            className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${calTab === key
                                                    ? "border-gray-900 text-gray-900"
                                                    : "border-transparent text-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        {t("departure")} <span className="text-blue-600 font-medium">{t("exact")}</span> <ChevronDown size={12} className="text-blue-600" />
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {t("return")} <span className="text-blue-600 font-medium">{t("exact")}</span> <ChevronDown size={12} className="text-blue-600" />
                                    </span>
                                </div>
                            </div>

                            {/* Months navigation */}
                            <div className="flex items-start gap-6 px-5 py-4">
                                <button
                                    onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}
                                    disabled={monthOffset === 0}
                                    className="mt-1 p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 shrink-0"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <CalendarMonth
                                    year={m1.year} month={m1.month}
                                    selected={selected} hovered={hovered}
                                    onSelect={handleSelect} onHover={setHovered}
                                />

                                <div className="w-px bg-gray-100 self-stretch mx-1" />

                                <CalendarMonth
                                    year={m2.year} month={m2.month}
                                    selected={selected} hovered={hovered}
                                    onSelect={handleSelect} onHover={setHovered}
                                />

                                <button
                                    onClick={() => setMonthOffset(Math.min(maxOffset, monthOffset + 1))}
                                    disabled={monthOffset >= maxOffset}
                                    className="mt-1 p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 shrink-0"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Footer */}
                            {selected.length > 0 && (
                                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                                    <button
                                        onClick={() => setSelected([])}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        {t("clearDates")}
                                    </button>
                                    <button
                                        onClick={() => setShowCalendar(false)}
                                        className="bg-[#0071c2] hover:bg-[#005fa3] text-white text-xs font-bold px-5 py-2 rounded transition-colors"
                                    >
                                        {t("done")}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Right: 2x2 image grid ── */}
                <div className="hidden lg:grid grid-cols-2 gap-2.5 w-92.5 shrink-0">
                    <img src="https://images.unsplash.com/photo-1761839271800-f44070ff0eb9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" alt="aerial" className="rounded-xl object-cover w-full h-38.75" />
                    <img src="https://images.unsplash.com/photo-1547920759-8f8be2d2742c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhdmVsJTIwb24lMjBmbGlnaHRzfGVufDB8fDB8fHww" alt="coast" className="rounded-xl object-cover w-full h-38.75 mt-8" />
                    <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhdmVsfGVufDB8fDB8fHww" alt="window" className="rounded-xl object-cover w-full h-38.75 -mt-8" />
                    <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D" alt="desert" className="rounded-xl object-cover w-full h-38.75" />
                </div>

            </div>
        </section>
    );
}
