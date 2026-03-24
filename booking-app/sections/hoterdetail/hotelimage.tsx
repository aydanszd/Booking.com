"use client";
import { useState, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import {
    Heart, Share2, MapPin, Wifi, ParkingCircle, Plane, Users, Clock,
    Coffee, CigaretteOff, ChevronRight, ZoomIn, Star
} from "lucide-react";
import { IMG } from "@/api/building";

const tabs = [
    "Overview", "Info & prices", "Features", "House rules", "User reviews"
];

const featureConfig = [
    { icon: Plane, label: "Airport shuttle", key: "shuttle" },
    { icon: CigaretteOff, label: "Non-smoking rooms", key: "smoking" },
    { icon: ParkingCircle, label: "Free parking", key: "parking" },
    { icon: Wifi, label: "Free WiFi", key: "wifi" },
    { icon: Users, label: "Family rooms", key: "family" },
    { icon: Clock, label: "24-hour front desk", key: "reception" },
    { icon: Coffee, label: "Good breakfast", key: "breakfast" },
];

export default function HotelImage({ building }: { building: any }) {
    const [activeTab, setActiveTab] = useState(0);
    const [saved, setSaved] = useState(false);
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

    return (
        <div className="pb-10">
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={slides}
                index={lightboxIndex}
                plugins={[Thumbnails, Zoom, Counter]}
            />

            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm mt-8 rounded-full px-6 mb-8 mx-auto max-w-5xl">
                <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
                    {tabs.map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`shrink-0 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                                activeTab === i ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={14} className={i < Math.floor(building.rating / 2) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                                ))}
                                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{building.type}</span>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
                                {building.title}
                            </h1>
                            <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                                <MapPin size={16} className="text-blue-600 shrink-0" />
                                <span className="font-medium">{building.location.address}, {building.location.city}, {building.location.country}</span>
                                <span className="text-blue-600 font-bold cursor-pointer hover:underline text-xs ml-2 uppercase tracking-tighter">— Show on map</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSaved(!saved)} className={`p-3 rounded-full border transition-all shadow-sm ${saved ? "bg-red-50 border-red-200 text-red-500 scale-110" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}>
                                <Heart size={20} fill={saved ? "currentColor" : "none"} />
                            </button>
                            <button 
                                onClick={() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
                            >
                                Reserve Now
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[450px] mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
                        <button onClick={() => openLightbox(0)} className="col-span-2 row-span-2 relative group overflow-hidden">
                            <img src={slides[0].src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Main" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={40} />
                            </div>
                        </button>
                        {slides.slice(1, 4).map((slide: any, i: number) => (
                            <button key={i} onClick={() => openLightbox(i+1)} className="col-span-1 row-span-1 relative group overflow-hidden">
                                <img src={slide.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Img ${i}`} />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={30} />
                                </div>
                            </button>
                        ))}
                        {slides.length > 4 && (
                            <button onClick={() => openLightbox(4)} className="col-span-1 row-span-1 relative group overflow-hidden">
                                <img src={slides[4].src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="More" />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-all flex flex-col items-center justify-center text-white">
                                    <span className="text-xl font-black">+{slides.length - 4}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Photos</span>
                                </div>
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                             Popular facilities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {(building.amenities || ["Wifi", "Parking", "AC", "Breakfast"]).map((a: string) => (
                                <div key={a} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                    <CheckCircle2 size={18} className="text-[#008009] shrink-0" />
                                    <span>{a}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:w-80 shrink-0">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xl font-black text-gray-900 italic">Excellent</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">1,245 reviews</p>
                            </div>
                            <div className="bg-blue-600 text-white text-xl font-black w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                                {building.rating}
                            </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100 relative group cursor-pointer hover:bg-blue-100 transition-colors">
                            <p className="text-sm font-semibold text-blue-900 leading-relaxed line-clamp-3">
                                "The location is absolutely stunning. We had a great view of the city and the service was top notch. Highly recommended!"
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">KM</div>
                                <span className="text-sm font-bold text-blue-900">Kevin M.</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Location</span>
                                <span className="text-sm font-black text-blue-600">9.5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Cleanliness</span>
                                <span className="text-sm font-black text-blue-600">9.8</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-lg transition-all shadow-xl shadow-blue-100 mt-8 active:scale-95"
                        >
                            Reserve Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle2({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}