import { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { X, Loader2, ImagePlus } from 'lucide-react';
import { Building, buildingSchema, BuildingSchema, INITIAL_SCHEMA } from '@/types/building';
import api, { IMG } from '@/api/building';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    editItem: Building | null;
    onClose: () => void;
    onSuccess: () => void;
}

// ✅ Xaricdə — fokus problemi olmur
const inputCls = (touched?: boolean, error?: string) =>
    `w-full border ${touched && error ? 'border-red-400' : 'border-gray-200'} rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors`;

const Field = ({
    label, error, touched, children,
}: {
    label: string; error?: string; touched?: boolean; children: React.ReactNode;
}) => (
    <div>
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{label}</label>
        {children}
        {touched && error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
);

// Zod → Formik adapter
const zodValidate = (values: BuildingSchema) => {
    const result = buildingSchema.safeParse(values);
    if (result.success) return {};
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
    });
    return errors;
};

export default function BuildingModal({ open, editItem, onClose, onSuccess }: Props) {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const formik = useFormik<BuildingSchema>({
        initialValues: INITIAL_SCHEMA,
        validate: zodValidate,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData();
                fd.append('title', values.title);
                fd.append('type', values.type);
                fd.append('brand', values.brand || '');
                fd.append('pricePerNight', String(values.pricePerNight));
                fd.append('minNights', String(values.minNights || 1));
                fd.append('maxGuests', String(values.maxGuests || 10));
                fd.append('location', JSON.stringify({
                    city: values.city,
                    country: values.country,
                    address: values.address || '',
                }));
                fd.append('rooms', JSON.stringify({
                    bedrooms: values.bedrooms || 0,
                    bathrooms: values.bathrooms || 0,
                }));
                if (values.amenities) {
                    fd.append('amenities', JSON.stringify(
                        values.amenities.split(',').map(a => a.trim()).filter(Boolean)
                    ));
                }
                if (values.travelGroups?.length) {
                    fd.append('travelGroups', JSON.stringify(values.travelGroups));
                }
                images.forEach(img => fd.append('images', img));

                if (editItem) {
                    await api.put(`/buildings/${editItem._id}`, fd);
                    toast.success('Bina yeniləndi ✅');
                } else {
                    await api.post('/buildings', fd);
                    toast.success('Bina əlavə edildi ✅');
                }
                onSuccess();
                onClose();
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Xəta baş verdi');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const { values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting, resetForm } = formik;

    // Modal açılanda formu init et
    useEffect(() => {
        if (!open) return;
        if (editItem) {
            resetForm({
                values: {
                    title: editItem.title,
                    type: editItem.type,
                    brand: editItem.brand || '',
                    city: editItem.location.city,
                    country: editItem.location.country,
                    address: editItem.location.address || '',
                    pricePerNight: editItem.pricePerNight,
                    minNights: editItem.minNights || 1,
                    maxGuests: editItem.maxGuests || 10,
                    amenities: (editItem.amenities || []).join(', '),
                    travelGroups: editItem.travelGroups || [],
                    bedrooms: editItem.rooms?.bedrooms || 0,
                    bathrooms: editItem.rooms?.bathrooms || 0,
                },
            });
            setPreviews(editItem.images || []);
        } else {
            resetForm({ values: INITIAL_SCHEMA });
            setPreviews([]);
        }
        setImages([]);
    }, [open, editItem]);

    if (!open) return null;

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + previews.length > 10) {
            toast.error('Maksimum 10 şəkil yükləyə bilərsiniz');
            return;
        }
        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removePreview = (i: number) => {
        setPreviews(prev => prev.filter((_, idx) => idx !== i));
        setImages(prev => prev.filter((_, idx) => idx !== i));
    };

    const toggleGroup = (g: string) => {
        const curr = values.travelGroups || [];
        setFieldValue(
            'travelGroups',
            curr.includes(g) ? curr.filter(x => x !== g) : [...curr, g]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="font-bold text-gray-800 text-base">
                        {editItem ? '✏️ Edit Building' : '+ Add Building'}
                    </h2>
                    <button type="button" onClick={onClose}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-4">

                    {/* Images */}
                    <Field label="Images (max 10)">
                        <div className="space-y-2">
                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {previews.map((p, i) => (
                                        <div key={i} className="relative group">
                                            <img
                                                src={p.startsWith('/uploads') ? IMG(p) : p}
                                                className="w-16 h-16 rounded-lg object-cover" alt=""
                                            />
                                            <button type="button" onClick={() => removePreview(i)}
                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div onClick={() => fileRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:border-[#006ce4] transition-colors">
                                <ImagePlus size={16} className="text-gray-400" />
                                <span className="text-xs text-gray-400">Şəkil əlavə et (jpg, png, webp • max 5MB)</span>
                            </div>
                            <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                        </div>
                    </Field>

                    {/* Title */}
                    <Field label="Title *" error={errors.title} touched={touched.title}>
                        <input
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Grand Baku Hotel"
                            className={inputCls(touched.title, errors.title)}
                        />
                    </Field>

                    {/* Type + Brand */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Type *">
                            <select name="type" value={values.type} onChange={handleChange} onBlur={handleBlur}
                                className={inputCls()}>
                                {['hotel', 'apartment', 'villa', 'hostel', 'resort'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Brand">
                            <input name="brand" value={values.brand} onChange={handleChange} onBlur={handleBlur}
                                placeholder="Hilton, Marriott..." className={inputCls()} />
                        </Field>
                    </div>

                    {/* City + Country */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="City *" error={errors.city} touched={touched.city}>
                            <input name="city" value={values.city} onChange={handleChange} onBlur={handleBlur}
                                placeholder="Baku" className={inputCls(touched.city, errors.city)} />
                        </Field>
                        <Field label="Country *" error={errors.country} touched={touched.country}>
                            <input name="country" value={values.country} onChange={handleChange} onBlur={handleBlur}
                                placeholder="Azerbaijan" className={inputCls(touched.country, errors.country)} />
                        </Field>
                    </div>

                    {/* Address */}
                    <Field label="Address">
                        <input name="address" value={values.address} onChange={handleChange} onBlur={handleBlur}
                            placeholder="Neftçilər pr. 153" className={inputCls()} />
                    </Field>

                    {/* Price + Min Nights + Max Guests */}
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Price/Night *" error={errors.pricePerNight} touched={touched.pricePerNight}>
                            <input name="pricePerNight" type="number" value={values.pricePerNight}
                                onChange={handleChange} onBlur={handleBlur} placeholder="150"
                                className={inputCls(touched.pricePerNight, errors.pricePerNight)} />
                        </Field>
                        <Field label="Min Nights">
                            <input name="minNights" type="number" value={values.minNights}
                                onChange={handleChange} onBlur={handleBlur} className={inputCls()} />
                        </Field>
                        <Field label="Max Guests">
                            <input name="maxGuests" type="number" value={values.maxGuests}
                                onChange={handleChange} onBlur={handleBlur} className={inputCls()} />
                        </Field>
                    </div>

                    {/* Bedrooms + Bathrooms */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Bedrooms" error={errors.bedrooms} touched={touched.bedrooms}>
                            <input name="bedrooms" type="number" value={values.bedrooms}
                                onChange={handleChange} onBlur={handleBlur} placeholder="2"
                                className={inputCls(touched.bedrooms, errors.bedrooms)} />
                        </Field>
                        <Field label="Bathrooms" error={errors.bathrooms} touched={touched.bathrooms}>
                            <input name="bathrooms" type="number" value={values.bathrooms}
                                onChange={handleChange} onBlur={handleBlur} placeholder="1"
                                className={inputCls(touched.bathrooms, errors.bathrooms)} />
                        </Field>
                    </div>

                    {/* Amenities */}
                    <Field label="Amenities (vergüllə ayır)">
                        <input name="amenities" value={values.amenities} onChange={handleChange} onBlur={handleBlur}
                            placeholder="WiFi, Pool, Gym, Parking" className={inputCls()} />
                    </Field>

                    {/* Travel Groups */}
                    <Field label="Travel Groups">
                        <div className="flex flex-wrap gap-2">
                            {['solo', 'couple', 'family', 'group', 'business'].map(g => (
                                <button key={g} type="button" onClick={() => toggleGroup(g)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${values.travelGroups?.includes(g)
                                            ? 'bg-[#006ce4] text-white border-[#006ce4]'
                                            : 'border-gray-200 text-gray-600 hover:border-[#006ce4]'
                                        }`}>
                                    {g}
                                </button>
                            ))}
                        </div>
                    </Field>

                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
                    <button type="button" onClick={onClose}
                        className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={() => formik.handleSubmit()} disabled={isSubmitting}
                        className="flex-1 bg-[#006ce4] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0057b8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                        {editItem ? 'Save Changes' : 'Add Building'}
                    </button>
                </div>

            </div>
        </div>
    );
}