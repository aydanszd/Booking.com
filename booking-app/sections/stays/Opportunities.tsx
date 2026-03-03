"use client";
interface OfferCardProps {
    tag: string;
    title: string;
    description: string;
    ctaLabel: string;
    image: string;
    onExplore?: () => void;
}

function OfferCard({
    tag,
    title,
    description,
    ctaLabel,
    image,
    onExplore,
}: OfferCardProps) {
    return (
        <div className="border  border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4 bg-white hover:shadow-md transition-shadow duration-300">
            <div className="flex-1 max-w-6xl">
                <p className="text-xs text-gray-500 mb-1">{tag}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {description}
                </p>
                <button
                    onClick={onExplore}
                    className="bg-[#006ce4] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                    {ctaLabel}
                </button>
            </div>

            <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}

const OFFERS: OfferCardProps[] = [
    {
        tag: "2026'ya Merhaba Fırsatları",
        title: "En az %15 tasarruf",
        description:
            "2026'ya Merhaba Fırsatıyla konaklamada tasarruf edin. Şimdi rezerve edin, 1 Nisan 2026'ya kadar konaklayın.",
        ctaLabel: "Fırsatları keşfet",
        image:
            "https://q-xx.bstatic.com/xdata/images/xphoto/248x248/617102726.jpeg?k=53213209311f5bd09c92829da56d538bd77abbf521aae5658dc434a0ac448e1a&o=",
    },
    {
        tag: "Erken Rezervasyon",
        title: "Erken rezerve et, %20 kazan",
        description:
            "Tatil planınızı erken yapın ve özel erken rezervasyon indiriminden yararlanın.",
        ctaLabel: "Fırsatları keşfet",
        image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
    },
];


export default function FirsatlarSection() {
    return (
        <section className="py-10 px-6 max-w-6xl mx-auto font-sans -mt-7.5">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Offers</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Size özel promosyonlar, indirimler ve fırsatlar
                </p>
            </div>
            <div className="flex flex-col gap-4">
                {OFFERS.map((offer, i) => (
                    <OfferCard
                        key={i}
                        {...offer}
                        onExplore={() => console.log("Keşfet:", offer.title)}
                    />
                ))}
            </div>
        </section>
    );
}