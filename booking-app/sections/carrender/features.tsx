"use client"

const FEATURES = [
    {
        icon: "https://t-cf.bstatic.com/design-assets/assets/v3.176.0/illustrations-traveller/CustomerService.webp",
        title: "We're here for you",
        description: "Customer support in over 30 languages",
    },
    {
        icon: "https://t-cf.bstatic.com/design-assets/assets/v3.176.0/illustrations-traveller/FreeCancellation.webp",
        title: "Free cancellation",
        description: "Up to 48 hours before pick-up, on most bookings",
    },
    {
        icon: "https://t-cf.bstatic.com/design-assets/assets/v3.176.0/illustrations-traveller/Reviews.webp",
        title: "5 million+ reviews",
        description: "By real, verified customers",
    },
];

export default function FeaturesSection() {
    return (
        <section className="bg-[#f5f5f5] py-12 px-6">
            <div className="flex items-center justify-around gap-8 max-w-7xl mx-auto">
                {FEATURES.map((feature) => (
                    <div key={feature.title} className="flex items-center gap-4">
                        <img
                            src={feature.icon}
                            alt={feature.title}
                            className="w-20 h-20 object-contain shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div>
                            <h3 className="text-base font-bold text-gray-900">{feature.title}</h3>
                            <p className="text-sm text-gray-600 mt-0.5">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}