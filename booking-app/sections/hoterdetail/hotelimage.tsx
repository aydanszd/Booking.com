"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import {
    Heart,
    Share2,
    MapPin,
    Wifi,
    ParkingCircle,
    Plane,
    Users,
    Clock,
    Coffee,
    CigaretteOff,
    ChevronRight,
    ZoomIn,
} from "lucide-react";

const slides = [
    { src: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1400&q=90" },
    { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=90" },
    { src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1400&q=90" },
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&q=90" },
    { src: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=1400&q=90" },
    { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1400&q=90" },
    { src: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1400&q=90" },
];

const thumbs = slides.map((s) => s.src.replace("w=1400", "w=400"));

const tabs = [
    "Genel Bakış",
    "Bilgi ve fiyatlar",
    "Özellikler",
    "Tesis kuralları",
    "Önemli ve yasal bilgi",
    "Konuk değerlendirmeleri (1.597)",
];

const features = [
    { icon: Plane, label: "Havaalanı servisi" },
    { icon: CigaretteOff, label: "Sigara içilmeyen odalar" },
    { icon: ParkingCircle, label: "Ücretsiz otopark" },
    { icon: Wifi, label: "Ücretsiz Wi-Fi" },
    { icon: Users, label: "Aile odaları" },
    { icon: Clock, label: "24 saat açık resepsiyon" },
    { icon: Coffee, label: "İyi bir kahvaltı" },
];

const descriptions = [
    {
        title: "Konforlu Konaklamalar",
        text: "Tour-ZamZam-Madinah Halal Hotels Group, Bakü'de aile odaları sunmaktadır. Odalar, klima, deniz veya şehir manzarası ve çalışma masası, TV ve ücretsiz WiFi gibi modern olanaklarla donatılmıştır.",
    },
    {
        title: "Kolaylık Sağlayan Özellikler",
        text: "Konuklar, ücretsiz WiFi, özel check-in ve check-out, 24 saat açık resepsiyon, günlük temizlik hizmeti ve ücretsiz dış mekan otoparkından yararlanabilirler. Ek hizmetler arasında ücretli servis, asansör, bisiklet ve araba kiralama, tur masası ve bagaj muhafazası bulunmaktadır.",
    },
    {
        title: "Yemek Deneyimi",
        text: "Her gün meyve suyu ve peynir içeren helal seçeneklerle zenginleştirilmiş kontinental kahvaltı sunulmaktadır.",
    },
    {
        title: "Avantajlı Konum",
        text: "Heydar Aliyev Uluslararası Havalimanı'na 27 km uzaklıkta bulunan otel, Bayrak Meydanı (1,7 km), Alev Kuleleri (1,6 km) ve Azerbaycan Halı Müzesi (14 dakikalık yürüyüş mesafesi) gibi cazibe merkezlerine yakındır.",
    },
];

export default function HotelDetail() {
    const [activeTab, setActiveTab] = useState(0);
    const [saved, setSaved] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <div className="min-h-screen">
            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={slides}
                index={lightboxIndex}
                plugins={[Thumbnails, Zoom, Counter]}
                thumbnails={{ border: 2, borderRadius: 8, padding: 2, gap: 8 }}
                counter={{ container: { style: { top: "unset", bottom: 0 } } }}
            />

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm mt-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`shrink-0 px-5 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === i
                                        ? "border-[#006ce4] text-[#006ce4]"
                                        : "border-transparent text-gray-500 hover:text-gray-800"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* ── LEFT ── */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 pr-4">
                                <span className="text-amber-400 text-sm">★★</span>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight mt-1">
                                    Tour-ZamZam-Madinah Halal Hotels Group
                                </h1>
                                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500 flex-wrap">
                                    <MapPin size={14} className="text-[#006ce4] shrink-0" />
                                    <span>Qurban Abbasov 24, Sabayil, AZ1003 Bakü, Azerbaycan</span>
                                    <span className="text-[#006ce4] font-medium cursor-pointer hover:underline whitespace-nowrap">
                                        – Mükemmel konum - haritayı göster
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => setSaved(!saved)}
                                    className={`p-2 rounded-full border transition-all ${saved
                                            ? "border-red-300 bg-red-50 text-red-500"
                                            : "border-gray-200 text-gray-400 hover:border-gray-300"
                                        }`}
                                >
                                    <Heart size={18} fill={saved ? "currentColor" : "none"} />
                                </button>
                                <button className="p-2 rounded-full border border-gray-200 text-gray-400 hover:border-gray-300 transition-all">
                                    <Share2 size={18} />
                                </button>
                                <button className="bg-[#006ce4] hover:bg-[#0055b3] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
                                    Rezervasyon yap
                                </button>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 rounded-2xl overflow-hidden h-80 mb-6">
                            {/* Large main */}
                            <button
                                onClick={() => openLightbox(0)}
                                className="col-span-2 row-span-2 relative group overflow-hidden"
                            >
                                <img
                                    src={thumbs[0]}
                                    alt="Otel dış cephe"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                                    <ZoomIn
                                        size={28}
                                        className="text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                </div>
                            </button>

                            {/* 3 small cells */}
                            {[1, 2, 3].map((i) => (
                                <button
                                    key={i}
                                    onClick={() => openLightbox(i)}
                                    className="col-span-1 row-span-1 relative group overflow-hidden"
                                >
                                    <img
                                        src={thumbs[i]}
                                        alt={`Fotoğraf ${i + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                                        <ZoomIn
                                            size={18}
                                            className="text-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </button>
                            ))}

                            {/* +15 overlay */}
                            <button
                                onClick={() => openLightbox(4)}
                                className="col-span-1 row-span-1 relative group overflow-hidden"
                            >
                                <img
                                    src={thumbs[4]}
                                    alt="Daha fazla fotoğraf"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-all flex items-center justify-center">
                                    <span className="text-white text-sm font-bold drop-shadow-lg">+15 fotoğraf</span>
                                </div>
                            </button>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Tour-ZamZam-Madinah Halal Hotels Group tesisinde Genius indiriminden yararlanma hakkınız
                                olabilir. Seçtiğiniz tarihlerde Genius indirimi olup olmadığını kontrol etmek için{" "}
                                <span className="text-[#006ce4] cursor-pointer hover:underline">giriş yapın</span>.
                            </p>
                            <p className="text-gray-500 text-sm leading-relaxed mb-5">
                                Bu tesisteki Genius indirimleri, rezervasyon ve konaklama tarihleri ile diğer mevcut
                                fırsatlara göre değişebilir.
                            </p>
                            <div className="space-y-4">
                                {descriptions.map((item) => (
                                    <p key={item.title} className="text-gray-800 text-sm leading-relaxed">
                                        <span className="font-bold">{item.title}:</span> {item.text}
                                    </p>
                                ))}
                            </div>
                            <p className="text-[#006ce4] text-sm mt-5 font-medium">
                                Çiftler özellikle burayı tercih ediyor: iki kişilik bir seyahat için bu tesise{" "}
                                <span className="font-bold">9,1</span> puan verdiler.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-900 mb-4">En popüler özellikler</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {features.map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-2.5 text-sm text-gray-700">
                                        <Icon size={16} className="text-[#009966] shrink-0" />
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR ── */}
                    <div className="w-full lg:w-80 shrink-0">
                        {/* Score */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xl font-bold text-gray-900">Fevkalade</p>
                                    <p className="text-xs text-gray-500">1.597 değerlendirme</p>
                                </div>
                                <div className="bg-[#003580] text-white text-xl font-bold w-12 h-12 rounded-xl flex items-center justify-center">
                                    9,1
                                </div>
                            </div>
                            <div className="bg-[#fdf7ee] border border-amber-100 rounded-xl p-4 mb-4 relative">
                                <p className="text-sm text-gray-700 leading-relaxed italic">
                                    "Vulgar ve İlkay beye çok teşekkür ediyorum. İlk andan itibaren çok yardımcı oldular.
                                    Odalar geniş, temiz, sıcak ve konforluydu. İçeri Şehere'..."
                                </p>
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="w-7 h-7 rounded-full bg-[#cc0000] text-white text-xs flex items-center justify-center font-bold">
                                        K
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Kübra</span>
                                    <span className="text-xs text-gray-400">🇺🇸 ABD</span>
                                </div>
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <span className="text-sm font-medium text-gray-700">Çalışanlar</span>
                                <div className="bg-[#003580] text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                                    9,4
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4 h-44">
                            <div className="relative w-full h-full">
                                <iframe
                                    title="map"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.5!2d49.8671!3d40.3777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDIyJzM5LjciTiA0OcKwNTInMDEuNiJF!5e0!3m2!1str!2saz!4v1620000000000"
                                />
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                                    <button className="bg-[#006ce4] text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md hover:bg-[#0055b3] transition-colors whitespace-nowrap">
                                        Haritada göster
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm">Tesisin öne çıkan noktaları</h3>
                            <div className="bg-[#ebf3ff] rounded-xl px-4 py-3 mb-4">
                                <p className="text-[#003580] font-bold text-sm">2 gecelik konaklama için mükemmel!</p>
                            </div>
                            <div className="flex items-start gap-2.5 mb-4">
                                <MapPin size={15} className="text-[#006ce4] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Popüler konum:</p>
                                    <p className="text-sm text-gray-500">
                                        Son kalan konuklar yüksek puan veriyor (9,2)
                                    </p>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Kahvaltı bilgisi</p>
                                <p className="text-sm text-gray-500 mb-3">Kontinental, Helal</p>
                                <div className="flex items-center gap-2">
                                    <ParkingCircle size={15} className="text-[#009966]" />
                                    <span className="text-sm text-gray-700 font-medium">ÜCRETSİZ otopark!</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-[#006ce4] hover:bg-[#0055b3] text-white font-bold py-3.5 rounded-xl text-base transition-colors shadow-sm">
                            Rezervasyon yap
                        </button>
                        <p className="text-center text-xs text-[#006ce4] mt-2 font-medium cursor-pointer hover:underline">
                            Fiyat Eşitlemesi Yapıyoruz
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}