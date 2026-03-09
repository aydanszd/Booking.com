export default function FlightsFooter() {
    return (
        <footer className="w-full mt-50 py-10 px-6 flex flex-col items-center gap-6">
            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-600">
                <a href="#" className="hover:underline">Booking.com Privacy Policy</a>
                <a href="#" className="hover:underline">Booking.com Terms of Use</a>
                <a href="#" className="hover:underline">KAYAK Privacy Policy</a>
                <a href="#" className="hover:underline">KAYAK Terms of Use</a>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 text-center">
                Booking.com is part of Booking Holdings Inc., the world leader in online travel & related services.
            </p>

            {/* Logos */}
            <div className="flex flex-wrap justify-center items-center gap-6">
                <span className="text-blue-700 font-bold text-lg">Booking.com</span>
                <span className="bg-orange-500 text-white font-bold text-sm px-3 py-1 rounded tracking-widest">KAYAK</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                    <span className="text-red-500 text-lg">●</span> OpenTable
                </span>
                <span className="text-blue-500 font-bold text-lg">priceline</span>
                <span className="flex items-center gap-1">
                    <span className="text-green-500 font-bold text-sm">agoda.com</span>
                    <span className="flex gap-0.5">
                        <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
                    </span>
                </span>
            </div>
        </footer>
    );
}