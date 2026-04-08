"use client";
import { useTranslations } from "next-intl";

interface OfferCardProps {
    tag: string;
    title: string;
    description: string;
    ctaLabel: string;
    image: string;
    onExplore?: () => void;
}

function OfferCard({ tag, title, description, ctaLabel, image, onExplore }: OfferCardProps) {
    return (
        <div className="border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4 bg-white hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col flex-1">
                <p className="text-xs text-gray-500 mb-1">{tag}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
                <button
                    onClick={onExplore}
                    className="bg-[#006ce4] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 w-fit"
                >
                    {ctaLabel}
                </button>
            </div>
            <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

export default function FirsatlarSection() {
    const t = useTranslations("stays");

    const OFFERS = [
        {
            tag: t("offer1Tag"),
            title: t("offer1Title"),
            description: t("offer1Desc"),
            ctaLabel: t("exploreOffers"),
            image: "https://q-xx.bstatic.com/xdata/images/xphoto/248x248/617102726.jpeg?k=53213209311f5bd09c92829da56d538bd77abbf521aae5658dc434a0ac448e1a&o=",
        },
        {
            tag: t("offer2Tag"),
            title: t("offer2Title"),
            description: t("offer2Desc"),
            ctaLabel: t("exploreOffers"),
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
        },
    ];

    return (
        <section className="py-8 sm:py-10 px-4 sm:px-6 max-w-6xl mx-auto sm:mx-0 sm:ml-92.5 font-sans sm:-mt-7.5">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t("offers")}</h2>
                <p className="text-sm text-gray-500 mt-1">{t("offersSubtitle")}</p>
            </div>
            <div className="flex flex-col gap-4">
                {OFFERS.map((offer, i) => (
                    <OfferCard
                        key={i}
                        {...offer}
                        onExplore={() => console.log("Explore:", offer.title)}
                    />
                ))}
            </div>
        </section>
    );
}
