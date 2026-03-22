"use client";

import {
    LogIn,
    LogOut,
    Ban,
    Baby,
    ShieldOff,
    PawPrint,
    Users,
    Banknote,
    BedDouble,
} from "lucide-react";

interface Rule {
    icon: React.ReactNode;
    label: string;
    content: React.ReactNode;
}

const rules: Rule[] = [
    {
        icon: <LogIn size={18} />,
        label: "Check-in",
        content: (
            <div className="space-y-1 text-sm text-gray-700">
                <p className="font-medium">Başlangıç: 14:00</p>
                <p>Check-in sırasında konukların fotoğraflı kimlik belgesi ve kredi kartı göstermesi gerekmektedir.</p>
                <p>Önceden tesise varış saatinizi bildirmeniz gerekiyor.</p>
            </div>
        ),
    },
    {
        icon: <LogOut size={18} />,
        label: "Check-out",
        content: (
            <p className="text-sm text-gray-700 font-medium">Bitiş: 12:00</p>
        ),
    },
    {
        icon: <Ban size={18} />,
        label: "İptal/ ön ödeme",
        content: (
            <p className="text-sm text-gray-700">
                İptal ve ön ödeme koşulları, konaklama tesisinin türüne göre değişmektedir.
                Lütfen seçiminizi yaparken her seçenek için hangi{" "}
                <a href="#" className="text-[#006ce4] hover:underline">koşulların</a>{" "}
                geçerli olabileceğini kontrol edin.
            </p>
        ),
    },
    {
        icon: <Baby size={18} />,
        label: "Çocuklar ve yataklar",
        content: (
            <div className="space-y-4 text-sm text-gray-700">
                <div>
                    <p className="font-bold text-gray-900 mb-2">Çocuk koşulları</p>
                    <p className="mb-2">Her yaştan çocuk konaklayabilir.</p>
                    <p>
                        Doğru fiyatları ve doluluk bilgilerini görmek için lütfen grubunuzdaki çocuk
                        sayısını ve bunların yaşlarını aramanıza ekleyin.
                    </p>
                </div>

                <div>
                    <p className="font-bold text-gray-900 mb-3">Bebek karyolası ve ilave yatak koşulları</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
                        <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 border-b border-gray-200">
                            0 – 6 yaş
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <BedDouble size={15} className="text-gray-500" />
                                <span>İlave yatak (talep üzerine)</span>
                            </div>
                            <span className="text-sm text-gray-700">Çocuk başına gecelik AZN 20</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                        <p>İlave yatak fiyatları toplam tutara dahil edilmez ve konaklamanız sırasında ayrı olarak ödenmelidir.</p>
                        <p>İzin verilen ilave yatak sayısı tercih ettiğiniz seçeneğe bağlıdır. Daha fazla bilgi için lütfen seçtiğiniz oda tipine göz atın.</p>
                        <p>Bu tesiste bebek karyolası mevcut değil.</p>
                        <p>Tüm ilave yataklar müsaitliğe bağlıdır.</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        icon: <ShieldOff size={18} />,
        label: "Yaş kısıtlaması yok",
        content: (
            <p className="text-sm text-gray-700">Check-in için minimum yaş sınırı yok</p>
        ),
    },
    {
        icon: <PawPrint size={18} />,
        label: "Evcil Hayvanlar",
        content: (
            <p className="text-sm text-gray-700">Evcil hayvan giremez.</p>
        ),
    },
    {
        icon: <Users size={18} />,
        label: "Gruplar",
        content: (
            <p className="text-sm text-gray-700">
                Rezervasyon 5 üzeri oda için yapıldığında farklı koşullar ve ek ücretler uygulanabilir.
            </p>
        ),
    },
    {
        icon: <Banknote size={18} />,
        label: "Sadece nakit",
        content: (
            <p className="text-sm text-gray-700">Bu tesis sadece nakit ödemeleri kabul eder.</p>
        ),
    },
];

export default function TesisKurallari() {
    return (
        <div className=" min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Tesis kuralları</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Tour-ZamZam-Madinah Halal Hotels Group özel talep alıyor – bir sonraki adımda ekleyin!
                        </p>
                    </div>
                    <button className="bg-[#006ce4] hover:bg-[#0055b3] text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                        Yer durumuna bak
                    </button>
                </div>

                {/* Rules card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                    {rules.map((rule) => (
                        <div key={rule.label} className="flex gap-6 px-6 py-5">
                            {/* Label */}
                            <div className="w-52 flex-shrink-0 flex items-start gap-2.5 pt-0.5">
                                <span className="text-gray-500 mt-0.5">{rule.icon}</span>
                                <span className="text-sm font-semibold text-gray-800">{rule.label}</span>
                            </div>
                            {/* Content */}
                            <div className="flex-1">{rule.content}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}