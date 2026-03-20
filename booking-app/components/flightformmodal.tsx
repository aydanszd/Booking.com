"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { X, Plus, Plane, Pencil } from "lucide-react";
import { toast } from "sonner";
import { flightSchema, defaultFlightValues, FlightFormValues } from "@/schemas/flightshema";
import { FlightType } from "@/types/flight";
import { flightApi } from "@/api/flight";

interface FlightFormModalProps {
    mode: "add" | "edit";
    flight?: FlightType | null;
    onClose: () => void;
    onSuccess: () => void;
}

const CABINS = ["economy", "premium_economy", "business", "first"] as const;
const CABIN_LABELS: Record<string, string> = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First",
};

const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors";

// ── Komponent XARİCİNDƏ təyin edilib — hər render-də yenidən yaranmır ──
interface FieldProps {
    label: string;
    error?: string;
    colSpan2?: boolean;
    children: React.ReactNode;
}

function Field({ label, error, colSpan2, children }: FieldProps) {
    return (
        <div className={colSpan2 ? "col-span-2" : ""}>
            <label className="text-xs text-gray-500 font-medium mb-1 block">{label}</label>
            {children}
            {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        </div>
    );
}

export default function FlightFormModal({ mode, flight, onClose, onSuccess }: FlightFormModalProps) {
    const [stopInput, setStopInput] = useState({ airport: "", duration: "" });
    const [siteInput, setSiteInput] = useState({ name: "", url: "", price: "" });

    const formik = useFormik<FlightFormValues>({
        initialValues: flight
            ? {
                  airline: flight.airline,
                  alliance: flight.alliance ?? "",
                  flightNumber: flight.flightNumber ?? "",
                  aircraft: flight.aircraft ?? "",
                  cabin: flight.cabin,
                  origin: { ...flight.origin },
                  destination: { ...flight.destination },
                  departureTime: flight.departureTime?.slice(0, 16) ?? "",
                  arrivalTime: flight.arrivalTime?.slice(0, 16) ?? "",
                  duration: flight.duration,
                  stops: flight.stops ?? [],
                  price: flight.price,
                  baggagePerPax: flight.baggagePerPax ?? "",
                  flightQuality: flight.flightQuality,
                  bookingSites: flight.bookingSites ?? [],
                  totalSeats: flight.totalSeats,
                  bookedSeats: flight.bookedSeats,
              }
            : defaultFlightValues,
        validationSchema: toFormikValidationSchema(flightSchema),
        onSubmit: async (values) => {
            try {
                if (mode === "edit" && flight?._id) {
                    await flightApi.update(flight._id, values);
                    toast.success("Uğurlu");
                } else {
                    await flightApi.create(values);
                    toast.success("Uğurlu");
                }
                onSuccess();
            } catch (e: any) {
                toast.error(e.message || "Xəta baş verdi");
            }
        },
    });

    const getErr = (name: string): string | undefined => {
        const parts = name.split(".");
        let t: any = formik.touched;
        let e: any = formik.errors;
        for (const p of parts) { t = t?.[p]; e = e?.[p]; }
        return t && typeof e === "string" ? e : undefined;
    };

    // Rəqəm inputu üçün: dəyər 0-dırsa boş göstər
    const numericProps = (name: string, val: number) => ({
        type: "number" as const,
        value: val === 0 ? "" : val,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            formik.setFieldValue(name, e.target.value === "" ? 0 : Number(e.target.value)),
        onBlur: formik.handleBlur,
        name,
        className: inputClass,
    });

    const addStop = () => {
        if (stopInput.airport.trim() && stopInput.duration) {
            formik.setFieldValue("stops", [
                ...formik.values.stops,
                { airport: stopInput.airport.trim(), duration: Number(stopInput.duration) },
            ]);
            setStopInput({ airport: "", duration: "" });
        }
    };

    const removeStop = (i: number) =>
        formik.setFieldValue("stops", formik.values.stops.filter((_, idx) => idx !== i));

    const addSite = () => {
        if (siteInput.name.trim() && siteInput.url.trim() && siteInput.price) {
            formik.setFieldValue("bookingSites", [
                ...formik.values.bookingSites,
                { name: siteInput.name.trim(), url: siteInput.url.trim(), price: Number(siteInput.price) },
            ]);
            setSiteInput({ name: "", url: "", price: "" });
        }
    };

    const removeSite = (i: number) =>
        formik.setFieldValue("bookingSites", formik.values.bookingSites.filter((_, idx) => idx !== i));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mode === "edit" ? "bg-blue-50" : "bg-emerald-50"}`}>
                            {mode === "edit"
                                ? <Pencil size={16} className="text-blue-500" />
                                : <Plane size={16} className="text-emerald-500" />
                            }
                        </div>
                        <h2 className="font-bold text-gray-800 text-base">
                            {mode === "edit" ? "Uçuşu Redaktə Et" : "Yeni Uçuş Əlavə Et"}
                        </h2>
                    </div>
                    <button type="button" onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="px-6 py-5 space-y-6">

                        {/* ── Ümumi ── */}
                        <section>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Ümumi</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Aviaşirkət *" error={getErr("airline")}>
                                    <input {...formik.getFieldProps("airline")} placeholder="AZAL" className={inputClass} />
                                </Field>
                                <Field label="Uçuş nömrəsi" error={getErr("flightNumber")}>
                                    <input {...formik.getFieldProps("flightNumber")} placeholder="J2-101" className={inputClass} />
                                </Field>
                                <Field label="Alliance" error={getErr("alliance")}>
                                    <input {...formik.getFieldProps("alliance")} placeholder="Star Alliance" className={inputClass} />
                                </Field>
                                <Field label="Təyyarə" error={getErr("aircraft")}>
                                    <input {...formik.getFieldProps("aircraft")} placeholder="Boeing 787" className={inputClass} />
                                </Field>
                                <Field label="Kabinə" error={getErr("cabin")} colSpan2>
                                    <select {...formik.getFieldProps("cabin")} className={`${inputClass} bg-white`}>
                                        {CABINS.map((c) => <option key={c} value={c}>{CABIN_LABELS[c]}</option>)}
                                    </select>
                                </Field>
                            </div>
                        </section>

                        {/* ── Marşrut ── */}
                        <section>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Marşrut</p>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <Field label="Çıxış şəhəri *" error={getErr("origin.city")}>
                                        <input {...formik.getFieldProps("origin.city")} placeholder="Bakı" className={inputClass} />
                                    </Field>
                                    <Field label="Hava limanı" error={getErr("origin.airport")}>
                                        <input {...formik.getFieldProps("origin.airport")} placeholder="Heydər Əliyev" className={inputClass} />
                                    </Field>
                                    <Field label="Kod *" error={getErr("origin.code")}>
                                        <input {...formik.getFieldProps("origin.code")} placeholder="GYD" className={`${inputClass} uppercase`} />
                                    </Field>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <Field label="Gediş şəhəri *" error={getErr("destination.city")}>
                                        <input {...formik.getFieldProps("destination.city")} placeholder="İstanbul" className={inputClass} />
                                    </Field>
                                    <Field label="Hava limanı" error={getErr("destination.airport")}>
                                        <input {...formik.getFieldProps("destination.airport")} placeholder="Atatürk" className={inputClass} />
                                    </Field>
                                    <Field label="Kod *" error={getErr("destination.code")}>
                                        <input {...formik.getFieldProps("destination.code")} placeholder="IST" className={`${inputClass} uppercase`} />
                                    </Field>
                                </div>
                            </div>
                        </section>

                        {/* ── Vaxt ── */}
                        <section>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Vaxt</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Uçuş vaxtı *" error={getErr("departureTime")}>
                                    <input type="datetime-local" {...formik.getFieldProps("departureTime")} className={inputClass} />
                                </Field>
                                <Field label="Eniş vaxtı *" error={getErr("arrivalTime")}>
                                    <input type="datetime-local" {...formik.getFieldProps("arrivalTime")} className={inputClass} />
                                </Field>
                                <Field label="Müddət (dəq) *" error={getErr("duration")}>
                                    <input placeholder="135" {...numericProps("duration", formik.values.duration)} />
                                </Field>
                                <Field label="Bagaj" error={getErr("baggagePerPax")}>
                                    <input {...formik.getFieldProps("baggagePerPax")} placeholder="23kg" className={inputClass} />
                                </Field>
                            </div>
                        </section>

                        {/* ── Qiymət & Oturacaqlar ── */}
                        <section>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Qiymət & Oturacaqlar</p>
                            <div className="grid grid-cols-3 gap-4">
                                <Field label="Qiymət ($) *" error={getErr("price")}>
                                    <input {...numericProps("price", formik.values.price)} />
                                </Field>
                                <Field label="Ümumi oturacaq" error={getErr("totalSeats")}>
                                    <input {...numericProps("totalSeats", formik.values.totalSeats)} />
                                </Field>
                                <Field label="Sifariş edilmiş" error={getErr("bookedSeats")}>
                                    <input {...numericProps("bookedSeats", formik.values.bookedSeats)} />
                                </Field>
                                <Field label="Keyfiyyət (0-10)" error={getErr("flightQuality")}>
                                    <input type="number" min={0} max={10} step={0.1}
                                        value={formik.values.flightQuality === 0 || formik.values.flightQuality == null ? "" : formik.values.flightQuality}
                                        onChange={(e) => formik.setFieldValue("flightQuality", e.target.value ? Number(e.target.value) : undefined)}
                                        onBlur={formik.handleBlur}
                                        name="flightQuality"
                                        className={inputClass} />
                                </Field>
                            </div>
                        </section>

                        {/* ── Dayanacaqlar ── */}
                        <section>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Dayanacaqlar</p>
                            <div className="flex gap-2 mb-2">
                                <input value={stopInput.airport}
                                    onChange={(e) => setStopInput(s => ({ ...s, airport: e.target.value }))}
                                    placeholder="Hava limanı (DXB)" className={`flex-1 ${inputClass}`} />
                                <input type="number" value={stopInput.duration}
                                    onChange={(e) => setStopInput(s => ({ ...s, duration: e.target.value }))}
                                    placeholder="Dəq" className="w-24 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors" />
                                <button type="button" onClick={addStop} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
                                    <Plus size={13} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formik.values.stops.map((s, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[11px] font-medium px-2.5 py-1 rounded-full">
                                        {s.airport} · {s.duration}dəq
                                        <button type="button" onClick={() => removeStop(i)}><X size={10} /></button>
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* ── Sifariş saytları ── */}
                        <section>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Sifariş Saytları</p>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                <input value={siteInput.name}
                                    onChange={(e) => setSiteInput(s => ({ ...s, name: e.target.value }))}
                                    placeholder="Sayt adı" className={inputClass} />
                                <input value={siteInput.url}
                                    onChange={(e) => setSiteInput(s => ({ ...s, url: e.target.value }))}
                                    placeholder="https://..." className={inputClass} />
                                <div className="flex gap-2">
                                    <input type="number" value={siteInput.price}
                                        onChange={(e) => setSiteInput(s => ({ ...s, price: e.target.value }))}
                                        placeholder="Qiymət" className={`flex-1 ${inputClass}`} />
                                    <button type="button" onClick={addSite} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
                                        <Plus size={13} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formik.values.bookingSites.map((s, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-violet-50 text-violet-600 text-[11px] font-medium px-2.5 py-1 rounded-full">
                                        {s.name} · ${s.price}
                                        <button type="button" onClick={() => removeSite(i)}><X size={10} /></button>
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
                        <button type="button" onClick={onClose} className="text-sm text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                            Ləğv et
                        </button>
                        <button type="submit" disabled={formik.isSubmitting}
                            className="text-sm text-white bg-[#006ce4] px-6 py-2.5 rounded-xl hover:bg-[#0057b8] transition-colors font-medium disabled:opacity-60">
                            {formik.isSubmitting ? "Saxlanır..." : mode === "edit" ? "Yadda Saxla" : "Əlavə Et"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}