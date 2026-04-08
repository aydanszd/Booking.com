"use client";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("footer");

    const footerColumns = [
        {
            title: t("support"),
            links: [t("manageTrips"), t("contactService"), t("safetyResource")],
        },
        {
            title: t("discover"),
            links: [
                t("geniusLoyalty"), t("seasonalDeals"), t("travelArticles"),
                t("bookingBusiness"), t("reviewAwards"), t("carHire"),
                t("flightFinder"), t("restaurants"),
            ],
        },
        {
            title: t("terms"),
            links: [
                t("privacyNotice"), t("termsService"), t("accessibility"),
                t("partnerDispute"), t("slaveryStatement"), t("humanRights"),
            ],
        },
        {
            title: t("partners"),
            links: [t("extranetLogin"), t("partnerHelp"), t("listProperty"), t("affiliate")],
        },
        {
            title: t("about"),
            links: [
                t("aboutBooking"), t("howWeWork"), t("sustainability"), t("pressCentre"),
                t("careers"), t("investorRelations"), t("corporateContact"),
            ],
        },
    ];

    return (
        <div className="bg-gray-100 border-t border-gray-200 mt-10">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {footerColumns.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-sm font-bold text-gray-900 mb-3">{col.title}</h3>
                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-xs text-gray-600 hover:underline">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
