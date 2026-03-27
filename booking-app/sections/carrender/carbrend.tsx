"use client";
import { useTranslations } from "next-intl";

const CAR_BRANDS = [
    { name: "Surprice", logo: "https://cdn2.rcstatic.com/sp/images/suppliers/1463_logo_200.png" },
    { name: "Autounion", logo: "https://cdn2.rcstatic.com/sp/images/suppliers/3164_logo_200.png" },
    { name: "Europcar", logo: "https://cdn2.rcstatic.com/sp/images/suppliers/102_logo_200.png" },
    { name: "Avis", logo: "https://cdn2.rcstatic.com/sp/images/suppliers/47_logo_200.png" },
    { name: "Keddy By Europcar", logo: "https://cdn2.rcstatic.com/sp/images/suppliers/2061_logo_200.png" },
    { name: "addCar", logo: "https://cdn2.rcstatic.com/sp/images/suppliers/137_logo_200.png" },
    { name: "Sixt", logo: "https://cdn2.rcstatic.com/sp/images/suppliers/227_logo_200.png" },
];

export default function CarRentalSections() {
    const tCars = useTranslations("cars");
    const tStays = useTranslations("stays");

    return (
        <div className="w-6xl px-6 py-10 space-y-12 mx-auto mt-10">
            {/* Popular car hire brands */}
            <section className="mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{tCars("popularBrands")}</h2>
                <div className="flex flex-wrap gap-3 justify-start">
                    {CAR_BRANDS.map((brand) => (
                        <div
                            key={brand.name}
                            className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                            <div className="w-32 h-16 border border-gray-200 rounded-lg flex items-center justify-center bg-white hover:shadow-md transition-shadow px-3">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-600 text-center">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Travel more, spend less */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{tStays("travelMore")}</h2>
                <div className="border border-gray-200 rounded-xl p-6 flex items-center justify-between bg-white">
                    <div className="flex flex-col gap-2 items-start text-left">
                        <h3 className="text-base font-bold text-gray-900">{tStays("signInSave")}</h3>
                        <p className="text-sm text-gray-600">
                            {tStays("signInSaveDesc")}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            <button className="bg-[#006ce4] hover:bg-[#005ea6] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                                {tStays("signIn")}
                            </button>
                            <button className="text-[#006ce4] text-sm font-semibold hover:underline">
                                {tStays("register")}
                            </button>
                        </div>
                    </div>
                    <img
                        src="https://t-cf.bstatic.com/design-assets/assets/v3.176.0/illustrations-traveller/GeniusGenericGiftBox.png"
                        alt="Genius"
                        className="w-32 h-32 object-contain shrink-0"
                    />
                </div>
            </section>

        </div>
    );
}
