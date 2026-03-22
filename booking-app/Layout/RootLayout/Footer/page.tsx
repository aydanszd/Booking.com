"use client";

const footerColumns = [
    {
        title: "Support",
        links: ["Manage your trips", "Contact Customer Service", "Safety resource centre"],
    },
    {
        title: "Discover",
        links: [
            "Genius loyalty programme", "Seasonal and holiday deals", "Travel articles",
            "Booking.com for Business", "Traveller Review Awards", "Car hire",
            "Flight finder", "Restaurant reservations",
        ],
    },
    {
        title: "Terms and settings",
        links: [
            "Privacy Notice", "Terms of Service", "Accessibility Statement",
            "Partner dispute", "Modern Slavery Statement", "Human Rights Statement",
        ],
    },
    {
        title: "Partners",
        links: ["Extranet login", "Partner help", "List your property", "Become an affiliate"],
    },
    {
        title: "About",
        links: [
            "About Booking.com", "How we work", "Sustainability", "Press centre",
            "Careers", "Investor relations", "Corporate contact", "Content guidelines and",
        ],
    },
];

export default function Footer() {
    return (
        <div className="bg-gray-100 border-t border-gray-200 mt-10">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-5 gap-6">
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