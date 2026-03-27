"use client";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { X, Plus, Upload, Pencil, Car } from "lucide-react";
import { toast } from "sonner";
import { carSchema, defaultCarValues, CarFormValues } from "@/schemas/carSchema";
import { CarType } from "@/types/car";
import { carApi, buildCarFormData } from "@/api/carapi";

interface CarFormModalProps {
    mode: "add" | "edit";
    car?: CarType | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CarFormModal({ mode, car, onClose, onSuccess }: CarFormModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [featInput, setFeatInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik<CarFormValues>({
        initialValues: car
            ? {
                title: car.title,
                brand: car.brand,
                model: car.model,
                category: car.category as CarFormValues["category"],
                transmission: car.transmission as CarFormValues["transmission"],
                seats: car.seats,
                mileage: car.mileage,
                pricePerDay: car.pricePerDay,
                isAvailable: car.isAvailable,
                location: { city: car.location.city, country: car.location.country },
                features: car.features ?? [],
                images: car.images ?? [],
            }
            : defaultCarValues,
        validationSchema: toFormikValidationSchema(carSchema),
        onSubmit: async (values) => {
            try {
                const fd = buildCarFormData(values, files);
                if (mode === "edit" && car?._id) {
                    await carApi.update(car._id, fd);
                    toast.success("Maşın yeniləndi");
                } else {
                    await carApi.create(fd);
                    toast.success("Maşın əlavə edildi");
                }
                onSuccess();
            } catch (e: any) {
                toast.error(e.message || "Xəta baş verdi");
            }
        },
    });

    const addFeature = () => {
        const trimmed = featInput.trim();
        if (trimmed) {
            formik.setFieldValue("features", [...formik.values.features, trimmed]);
            setFeatInput("");
        }
    };

    const removeFeature = (index: number) => {
        formik.setFieldValue(
            "features",
            formik.values.features.filter((_, i) => i !== index)
        );
    };

    const Field = ({
        label,
        name,
        children,
        colSpan2,
    }: {
        label: string;
        name: string;
        children: React.ReactNode;
        colSpan2?: boolean;
    }) => {
        const touched = formik.touched as Record<string, any>;
        const errors = formik.errors as Record<string, any>;
        const err = touched[name] && errors[name];
        return (
            <div className={colSpan2 ? "col-span-2" : ""}>
                <label className="text-xs text-gray-500 font-medium mb-1 block">{label}</label>
                {children}
                {err && (
                    <p className="text-[11px] text-red-500 mt-1">
                        {typeof err === "string" ? err : JSON.stringify(err)}
                    </p>
                )}
            </div>
        );
    };

    const inputClass =
        "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mode === "edit" ? "bg-blue-50" : "bg-emerald-50"}`}>
                            {mode === "edit"
                                ? <Pencil size={16} className="text-blue-500" />
                                : <Car size={16} className="text-emerald-500" />
                            }
                        </div>
                        <h2 className="font-bold text-gray-800 text-base">
                            {mode === "edit" ? "Maşını Redaktə Et" : "Yeni Maşın Əlavə Et"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                    <div className="px-6 py-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Title */}
                            <Field label="Başlıq *" name="title" colSpan2>
                                <input
                                    {...formik.getFieldProps("title")}
                                    placeholder="BMW 5 Series 2024"
                                    className={inputClass}
                                />
                            </Field>

                            {/* Brand */}
                            <Field label="Marka" name="brand">
                                <input
                                    {...formik.getFieldProps("brand")}
                                    placeholder="BMW"
                                    className={inputClass}
                                />
                            </Field>

                            {/* Model */}
                            <Field label="Model" name="model">
                                <input
                                    {...formik.getFieldProps("model")}
                                    placeholder="5 Series"
                                    className={inputClass}
                                />
                            </Field>

                            {/* Category */}
                            <Field label="Kateqoriya" name="category">
                                <select {...formik.getFieldProps("category")} className={`${inputClass} bg-white`}>
                                    {["economy", "compact", "suv", "luxury", "van", "electric"].map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            {/* Transmission */}
                            <Field label="Ötürücü" name="transmission">
                                <select {...formik.getFieldProps("transmission")} className={`${inputClass} bg-white`}>
                                    <option value="automatic">Avtomat</option>
                                    <option value="manual">Mexanik</option>
                                </select>
                            </Field>

                            {/* Seats */}
                            <Field label="Oturacaq sayı" name="seats">
                                <input
                                    type="number"
                                    {...formik.getFieldProps("seats")}
                                    onChange={(e) => formik.setFieldValue("seats", Number(e.target.value))}
                                    className={inputClass}
                                />
                            </Field>

                            {/* Mileage */}
                            <Field label="Millaj (km)" name="mileage">
                                <input
                                    type="number"
                                    {...formik.getFieldProps("mileage")}
                                    onChange={(e) => formik.setFieldValue("mileage", Number(e.target.value))}
                                    className={inputClass}
                                />
                            </Field>

                            {/* Price */}
                            <Field label="Qiymət/Gün ($) *" name="pricePerDay">
                                <input
                                    type="number"
                                    {...formik.getFieldProps("pricePerDay")}
                                    onChange={(e) => formik.setFieldValue("pricePerDay", Number(e.target.value))}
                                    className={inputClass}
                                />
                            </Field>

                            {/* City */}
                            <Field label="Şəhər" name="location.city">
                                <input
                                    {...formik.getFieldProps("location.city")}
                                    placeholder="Bakı"
                                    className={inputClass}
                                />
                                {formik.touched.location?.city && formik.errors.location?.city && (
                                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.location.city}</p>
                                )}
                            </Field>

                            {/* Country */}
                            <Field label="Ölkə" name="location.country">
                                <input
                                    {...formik.getFieldProps("location.country")}
                                    placeholder="Azərbaycan"
                                    className={inputClass}
                                />
                                {formik.touched.location?.country && formik.errors.location?.country && (
                                    <p className="text-[11px] text-red-500 mt-1">{formik.errors.location.country}</p>
                                )}
                            </Field>

                            {/* Status */}
                            <div className="col-span-2">
                                <label className="text-xs text-gray-500 font-medium mb-1 block">Status</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => formik.setFieldValue("isAvailable", true)}
                                        className={`text-xs px-4 py-2 rounded-xl font-medium border transition-colors ${formik.values.isAvailable
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                                : "border-gray-200 text-gray-400"
                                            }`}
                                    >
                                        Mövcud
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => formik.setFieldValue("isAvailable", false)}
                                        className={`text-xs px-4 py-2 rounded-xl font-medium border transition-colors ${!formik.values.isAvailable
                                                ? "bg-orange-50 border-orange-200 text-orange-500"
                                                : "border-gray-200 text-gray-400"
                                            }`}
                                    >
                                        İcarəde
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="col-span-2">
                                <label className="text-xs text-gray-500 font-medium mb-1 block">Xüsusiyyətlər</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        value={featInput}
                                        onChange={(e) => setFeatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                        placeholder="GPS, AC, Bluetooth..."
                                        className={`flex-1 ${inputClass}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600 transition-colors"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formik.values.features.map((ft, i) => (
                                        <span
                                            key={i}
                                            className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[11px] font-medium px-2.5 py-1 rounded-full"
                                        >
                                            {ft}
                                            <button type="button" onClick={() => removeFeature(i)}>
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Images */}
                            <div className="col-span-2">
                                <label className="text-xs text-gray-500 font-medium mb-1 block">Şəkillər</label>
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-6 cursor-pointer hover:border-[#006ce4] transition-colors group">
                                    <Upload size={20} className="text-gray-300 group-hover:text-[#006ce4] transition-colors mb-2" />
                                    <span className="text-xs text-gray-400">JPG, PNG, WEBP · Maks 5MB</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => setFiles(Array.from(e.target.files || []))}
                                    />
                                </label>

                                {files.length > 0 && (
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {files.map((f, i) => (
                                            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                                                <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFiles((fs) => fs.filter((_, idx) => idx !== i))}
                                                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center"
                                                >
                                                    <X size={8} className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {mode === "edit" && formik.values.images.length > 0 && files.length === 0 && (
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {formik.values.images.map((img, i) => (
                                            <div key={i} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                                                <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Ləğv et
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="text-sm text-white bg-[#006ce4] px-6 py-2.5 rounded-xl hover:bg-[#0057b8] transition-colors font-medium disabled:opacity-60"
                        >
                            {formik.isSubmitting ? "Saxlanır..." : mode === "edit" ? "Yadda Saxla" : "Əlavə Et"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}