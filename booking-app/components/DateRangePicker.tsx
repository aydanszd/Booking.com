"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";

interface BookedRange { start: Date; end: Date; }

interface Props {
    bookedRanges?: BookedRange[];
    startDate: string;
    endDate: string;
    onStartChange: (d: string) => void;
    onEndChange: (d: string) => void;
    startLabel?: string;
    endLabel?: string;
}

const DOW = ["Bz", "Be", "Ça", "Çr", "Ca", "Cü", "Şn"];
const MONTHS_AZ = [
    "Yanvar","Fevral","Mart","Aprel","May","İyun",
    "İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr",
];

function toStr(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function parse(s: string) {
    if (!s) return null;
    const [y,m,d] = s.split("-").map(Number);
    return new Date(y, m-1, d);
}
function fmtDisplay(s: string) {
    if (!s) return null;
    const d = parse(s)!;
    return `${d.getDate()} ${MONTHS_AZ[d.getMonth()]} ${d.getFullYear()}`;
}

export default function DateRangePicker({
    bookedRanges = [],
    startDate, endDate,
    onStartChange, onEndChange,
    startLabel = "Giriş", endLabel = "Çıxış",
}: Props) {
    const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selecting, setSelecting] = useState<"start"|"end">("start");
    const [hovered, setHovered] = useState<Date|null>(null);

    /* ── open / animate ── */
    const [open, setOpen]       = useState(false);
    const [visible, setVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const openCal = useCallback(() => {
        clearTimeout(timerRef.current);
        setOpen(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    const closeCal = useCallback(() => {
        setVisible(false);
        timerRef.current = setTimeout(() => setOpen(false), 380);
    }, []);

    useEffect(() => {
        function onOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) closeCal();
        }
        document.addEventListener("mousedown", onOutside);
        return () => { document.removeEventListener("mousedown", onOutside); clearTimeout(timerRef.current); };
    }, [closeCal]);

    /* ── computed ── */
    const start = parse(startDate);
    const end   = parse(endDate);

    const isBooked = (d: Date) => bookedRanges.some(r => d >= r.start && d < r.end);
    const isPast   = (d: Date) => d < today;
    const isStart  = (d: Date) => !!start && d.getTime() === start.getTime();
    const isEnd    = (d: Date) => !!end   && d.getTime() === end.getTime();
    const inSel    = (d: Date) => !!start && !!end && d > start && d < end;
    const inHov    = (d: Date) => {
        if (!start || !!end || !hovered || hovered <= start) return false;
        return d > start && d < hovered;
    };

    const hasBookedBetween = (from: Date, to: Date) =>
        bookedRanges.some(r => from < r.end && to > r.start);

    function handleDay(day: Date) {
        if (isBooked(day) || isPast(day)) return;
        const str = toStr(day);
        if (selecting === "start") {
            onStartChange(str); onEndChange(""); setSelecting("end");
        } else {
            if (!start || day <= start) {
                onStartChange(str); onEndChange(""); setSelecting("end");
            } else if (hasBookedBetween(start, day)) {
                onStartChange(str); onEndChange(""); setSelecting("end");
            } else {
                onEndChange(str); setSelecting("start"); closeCal();
            }
        }
    }

    function prevMonth() {
        if (viewMonth===0) { setViewMonth(11); setViewYear(y=>y-1); }
        else setViewMonth(m=>m-1);
    }
    function nextMonth() {
        if (viewMonth===11) { setViewMonth(0); setViewYear(y=>y+1); }
        else setViewMonth(m=>m+1);
    }

    const days = useMemo(() => {
        const firstDow = new Date(viewYear, viewMonth, 1).getDay();
        const total    = new Date(viewYear, viewMonth+1, 0).getDate();
        const cells: (Date|null)[] = [];
        for (let i=0; i<firstDow; i++) cells.push(null);
        for (let d=1; d<=total; d++) cells.push(new Date(viewYear, viewMonth, d));
        return cells;
    }, [viewYear, viewMonth]);

    function triggerClick(which: "start"|"end") {
        setSelecting(which);
        open ? (visible ? undefined : openCal()) : openCal();
        if (!open) openCal();
    }

    return (
        <div ref={containerRef} className="relative w-full">

            {/* ── Trigger ── */}
            <div className="grid grid-cols-2 gap-2">
                {/* Start */}
                <button
                    type="button"
                    onClick={() => triggerClick("start")}
                    className={`
                        flex flex-col gap-0.5 px-4 py-3 rounded-2xl border-2 text-left w-full
                        transition-all duration-200
                        ${open && selecting==="start"
                            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"}
                    `}
                >
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <CalendarDays size={11} /> {startLabel}
                    </span>
                    <span className={`text-sm font-bold truncate ${startDate ? "text-gray-900" : "text-gray-300"}`}>
                        {startDate ? fmtDisplay(startDate) : "Tarix seçin"}
                    </span>
                </button>

                {/* End */}
                <button
                    type="button"
                    onClick={() => triggerClick("end")}
                    className={`
                        flex flex-col gap-0.5 px-4 py-3 rounded-2xl border-2 text-left w-full
                        transition-all duration-200
                        ${open && selecting==="end"
                            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"}
                    `}
                >
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <CalendarDays size={11} /> {endLabel}
                    </span>
                    <span className={`text-sm font-bold truncate ${endDate ? "text-gray-900" : "text-gray-300"}`}>
                        {endDate ? fmtDisplay(endDate) : "Tarix seçin"}
                    </span>
                </button>
            </div>

            {/* ── Dropdown Calendar ── */}
            {open && (
                <div
                    style={{
                        opacity:   visible ? 1 : 0,
                        transform: visible ? "translateY(0) scale(1)" : "translateY(-12px) scale(0.97)",
                        transition: "opacity 360ms cubic-bezier(.22,1,.36,1), transform 360ms cubic-bezier(.22,1,.36,1)",
                        pointerEvents: visible ? "auto" : "none",
                    }}
                    className="absolute z-50 top-[calc(100%+8px)] left-0 right-0 bg-white rounded-3xl shadow-2xl shadow-gray-300/50 border border-gray-100 p-5 origin-top"
                >
                    {/* Close btn */}
                    <button
                        onClick={closeCal}
                        className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X size={15} />
                    </button>

                    {/* Hint */}
                    <p className="text-[11px] font-bold text-blue-600 mb-4 uppercase tracking-widest">
                        {selecting === "start" ? `${startLabel} tarixini seçin` : `${endLabel} tarixini seçin`}
                    </p>

                    {/* Month nav */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-black text-gray-800">
                            {MONTHS_AZ[viewMonth]} {viewYear}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* DOW */}
                    <div className="grid grid-cols-7 mb-1">
                        {DOW.map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-gray-400 py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-y-1">
                        {days.map((day, i) => {
                            if (!day) return <div key={`e${i}`} />;

                            const booked  = isBooked(day);
                            const past    = isPast(day);
                            const selS    = isStart(day);
                            const selE    = isEnd(day);
                            const inS     = inSel(day);
                            const inH     = inHov(day);
                            const disabled = booked || past;

                            /* range connectors */
                            const isStartEdge = selS && (!!end || (!!hovered && hovered > day));
                            const isEndEdge   = selE;

                            return (
                                <div
                                    key={`d${i}`}
                                    className={`relative flex items-center justify-center h-9
                                        ${(inS || inH) ? "bg-blue-50" : ""}
                                        ${isStartEdge ? "rounded-l-full" : ""}
                                        ${isEndEdge   ? "rounded-r-full" : ""}
                                    `}
                                >
                                    <button
                                        disabled={disabled}
                                        onClick={() => handleDay(day)}
                                        onMouseEnter={() => !disabled && setHovered(day)}
                                        onMouseLeave={() => setHovered(null)}
                                        title={booked ? "Bu tarix rezervasiya olunub" : undefined}
                                        className={[
                                            "w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full transition-all duration-150 z-10",
                                            booked  ? "bg-red-100 text-red-400 line-through cursor-not-allowed" : "",
                                            past && !booked ? "text-gray-300 cursor-not-allowed" : "",
                                            (selS || selE) ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-110" : "",
                                            (inS || inH) && !selS && !selE ? "text-blue-700 hover:bg-blue-200" : "",
                                            !disabled && !selS && !selE && !inS && !inH
                                                ? "hover:bg-gray-100 text-gray-700"
                                                : "",
                                        ].join(" ")}
                                    >
                                        {day.getDate()}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-5 text-[10px] font-bold text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-100 border border-red-200 inline-block" />
                            Dolu
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                            Seçilmiş
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200 inline-block" />
                            Boş
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
