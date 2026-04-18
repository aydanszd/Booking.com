"use client";
import { useState, useMemo } from "react"; // useState used for lightboxOpen, lightboxIndex
import { useTranslations } from "next-intl";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import {
    Heart, MapPin, Star, Camera, Wifi, ParkingCircle,
    Coffee, Wind, ChevronRight, Bath, Dumbbell, Utensils,
    MonitorSmartphone, CheckCircle2
} from "lucide-react";
import { IMG } from "@/api/building";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";


const AMENITY_ICONS: Record<string, React.ReactNode> = {
    "WiFi": <Wifi size={16} />,
    "Wifi": <Wifi size={16} />,
    "Parking": <ParkingCircle size={16} />,
    "Breakfast": <Coffee size={16} />,
    "Air Conditioning": <Wind size={16} />,
    "Pool": <Bath size={16} />,
    "Gym": <Dumbbell size={16} />,
    "Restaurant": <Utensils size={16} />,
    "TV": <MonitorSmartphone size={16} />,
};

export default function HotelImage({ building }: { building: any }) {
    const t = useTranslations("hotel");
    const { toggle, has } = useWishlist();
    const { format } = useCurrency();
    const saved = has(building._id);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const slides = useMemo(() => {
        if (!building.images || building.images.length === 0) {
            return [{ src: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1400&q=90" }];
        }
        return building.images.map((img: string) => ({ src: IMG(img) }));
    }, [building.images]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const getRatingLabel = (rating: number) => {
        if (rating >= 9) return t("excellent");
        if (rating >= 7) return t("veryGood");
        if (rating >= 5) return t("good");
        return "";
    };

    const reviewCount = building.reviews?.length || 0;
    const starCount = Math.round((building.rating || 0) / 2);

    return (
        <div className="pb-6">
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={slides}
                index={lightboxIndex}
                plugins={[Thumbnails, Zoom, Counter]}
            />

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-[#006ce4] mb-3 flex-wrap">
                <span className="hover:underline cursor-pointer">Home</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span className="hover:underline cursor-pointer">{building.location.country}</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span className="hover:underline cursor-pointer">{building.location.city}</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span className="text-gray-500">{building.title}</span>
            </div>

            {/* Hotel Title + Meta */}
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={13}
                                    className={i < starCount ? "fill-[#febb02] text-[#febb02]" : "fill-gray-200 text-gray-200"} />
                            ))}
                        </div>
                        <span className="text-xs bg-[#f2f6fa] text-[#006ce4] border border-[#006ce4] px-2 py-0.5 rounded font-semibold capitalize">
                            {building.type}
                        </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-1.5">{building.title}</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-[#006ce4] hover:underline cursor-pointer flex items-center gap-1">
                            <MapPin size={13} />
                            {[building.location.address, building.location.city, building.location.country].filter(Boolean).join(", ")}
                        </span>
                        <span className="text-sm text-[#006ce4] hover:underline cursor-pointer font-bold">
                            – {t("showOnMap")}
                        </span>
                    </div>
                </div>

                {/* Right: Actions + Rating */}
                <div className="flex items-start gap-3 shrink-0">
                    <button
                        onClick={() => toggle({
                            id: building._id,
                            type: "building",
                            title: building.title,
                            image: building.images?.[0] ? IMG(building.images[0]) : undefined,
                            price: building.pricePerNight,
                            priceLabel: "per night",
                            location: [building.location.city, building.location.country].filter(Boolean).join(", "),
                            rating: building.rating,
                            href: `/hoteldetail/${building._id}`,
                        })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-semibold transition-colors ${
                            saved
                                ? "border-red-400 text-red-500 bg-red-50"
                                : "border-[#006ce4] text-[#006ce4] hover:bg-blue-50"
                        }`}
                    >
                        <Heart size={13} fill={saved ? "currentColor" : "none"} />
                        {saved ? "Saved" : t("save") || "Save"}
                    </button>

                    {(building.rating ?? 0) > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{getRatingLabel(building.rating)}</p>
                                <p className="text-xs text-gray-500">{reviewCount} {t("guestReviews").toLowerCase()}</p>
                            </div>
                            <div className="bg-[#003580] text-white text-base font-bold w-12 h-10 rounded-tl-lg rounded-tr-lg rounded-br-lg flex items-center justify-center">
                                {(building.rating || 0).toFixed(1)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Photo Gallery */}
            <div className="relative mb-6">
                {/* Mobile: single image */}
                <div className="sm:hidden relative h-56 rounded-lg overflow-hidden">
                    <button onClick={() => openLightbox(0)} className="w-full h-full">
                        <img src={slides[0]?.src} className="w-full h-full object-cover" alt="Main" />
                    </button>
                    <button
                        onClick={() => openLightbox(0)}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-md shadow border border-gray-300"
                    >
                        <Camera size={12} />
                        {t("photos")} ({slides.length})
                    </button>
                </div>

                {/* Desktop: grid */}
                <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-1 h-[400px] rounded-lg overflow-hidden">
                    <button onClick={() => openLightbox(0)} className="col-span-2 row-span-2 relative overflow-hidden group">
                        <img src={slides[0]?.src} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300" alt="Main" />
                    </button>
                    {slides.slice(1, 5).map((slide: any, i: number) => (
                        <button key={i} onClick={() => openLightbox(i + 1)} className="col-span-1 row-span-1 relative overflow-hidden group">
                            <img src={slide.src} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300" alt={`Photo ${i + 2}`} />
                        </button>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - (slides.length - 1)) }).map((_, i) => (
                        <div key={`empty-${i}`} className="col-span-1 row-span-1 bg-gray-100" />
                    ))}
                    <button
                        onClick={() => openLightbox(0)}
                        className="absolute bottom-3 right-3 flex items-center gap-2 bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-md shadow hover:bg-gray-50 transition-colors border border-gray-300"
                    >
                        <Camera size={14} />
                        {t("photos")} ({slides.length})
                    </button>
                </div>
            </div>

            {/* Two-column layout: Facilities + Sidebar */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Left: Facilities */}
                <div className="flex-1 min-w-0 w-full">
                    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <div className="bg-[#f2f6fa] px-5 py-3 border-b border-gray-200">
                            <h2 className="text-base font-bold text-gray-900">{t("popularFacilities")}</h2>
                        </div>
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(building.amenities || ["WiFi", "Parking", "Breakfast", "Air Conditioning"]).map((a: string) => (
                                <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-[#008009]">
                                        {AMENITY_ICONS[a] ?? <CheckCircle2 size={16} />}
                                    </span>
                                    <span>{a}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* About */}
                    {building.about && (
                        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden mt-4">
                            <div className="bg-[#f2f6fa] px-5 py-3 border-b border-gray-200">
                                <h2 className="text-base font-bold text-gray-900">About</h2>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{building.about}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Booking sidebar */}
                <div className="w-full sm:w-72 shrink-0 sm:sticky sm:top-16">
                    <div className="border border-gray-200 rounded-lg bg-white p-4">
                        {/* Rating row */}
                        {(building.rating ?? 0) > 0 && (
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{getRatingLabel(building.rating)}</p>
                                    <p className="text-xs text-gray-500">{reviewCount} {t("guestReviews").toLowerCase()}</p>
                                </div>
                                <div className="bg-[#003580] text-white text-sm font-bold px-2.5 py-1.5 rounded-tl-lg rounded-tr-lg rounded-br-lg">
                                    {(building.rating || 0).toFixed(1)}
                                </div>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-0.5">{t("pricePerNight")}:</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-gray-900">{format(building.pricePerNight)}</span>
                            </div>
                            <p className="text-xs text-[#008009] font-semibold mt-1">
                                ✓ {t("freeCancellation")}
                            </p>
                        </div>

                        {/* Reserve button */}
                        <button
                            onClick={() => document.getElementById("availability")?.scrollIntoView({ behavior: "smooth" })}
                            className="w-full bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold py-3 rounded-md text-sm transition-colors mb-2"
                        >
                            {t("reserveNow")}
                        </button>
                        <p className="text-[11px] text-gray-500 text-center">{t("noPrepayment")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
