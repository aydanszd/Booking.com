const DESTINATIONS = [
    {
        city: "Dubai",
        things: "8065 things to do",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    },
    {
        city: "London",
        things: "3967 things to do",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    },
    {
        city: "Istanbul",
        things: "2701 things to do",
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80",
    },
    {
        city: "New York",
        things: "2191 things to do",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    },
    {
        city: "Las Vegas",
        things: "1085 things to do",
        image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=600&q=80",
    },
    {
        city: "Paris",
        things: "3976 things to do",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    },
];

export default function TopDestinations() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-10" style={{ fontFamily: "'BlinkMacSystemFont', 'Segoe UI', sans-serif" }}>
            <div className="border-t border-gray-200 mb-8" />
            <h2 className="text-xl font-bold text-gray-900 mb-5">Top destinations</h2>

            <div className="grid grid-cols-3 gap-4">
                {DESTINATIONS.map((dest, i) => (
                    <div
                        key={i}
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        style={{ height: 240 }}
                    >
                        <img
                            src={dest.image}
                            alt={dest.city}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <p className="text-white font-bold text-base leading-tight">{dest.city}</p>
                            <p className="text-white/80 text-xs mt-0.5">{dest.things}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}