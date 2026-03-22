"use client";
import { Ticket, Zap, Headphones } from "lucide-react";

export default function InfoSections() {
    return (
        <div style={{ fontFamily: "'BlinkMacSystemFont', 'Segoe UI', sans-serif" }}>

            {/* Your account, your travel */}
            <section className="max-w-6xl mx-auto px-6 py-10">
                <div className="border-t border-gray-200 mb-8" />
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your account, your travel</h2>
                <div className="border border-gray-200 rounded-xl px-8 py-6 flex items-center justify-between">
                    <div>
                        <p className="text-base font-bold text-gray-900 mb-1">All your trip details in one place</p>
                        <p className="text-sm text-gray-500 mb-4">Sign in to book faster and manage your trip with ease</p>
                        <div className="flex items-center gap-3">
                            <button className="bg-[#0071c2] hover:bg-[#005ea6] text-white text-sm font-semibold px-5 py-2 rounded transition-colors">
                                Sign in
                            </button>
                            <button className="text-[#0071c2] text-sm font-semibold hover:underline">
                                Register
                            </button>
                        </div>
                    </div>
                    <img
                        src="https://t-cf.bstatic.com/design-assets/assets/v3.176.0/illustrations-traveller/GeniusGenericGiftBox.png"
                        alt="Genius"
                        className="h-28 object-contain"
                    />
                </div>
            </section>

            {/* We've got you covered */}
            <section className="max-w-6xl mx-auto px-6 pb-10">
                <div className="border-t border-gray-200 mb-8" />
                <h2 className="text-xl font-bold text-gray-900 mb-6">We've got you covered</h2>
                <div className="grid grid-cols-3 gap-8">
                    <div className="flex items-start gap-4">
                        <Ticket size={32} className="text-green-700 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-1">Explore top attractions</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Experience the best of your destination, with attractions, tours, activities and more
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Zap size={32} className="text-green-700 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-1">Fast and flexible</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Book tickets online in minutes, with free cancellation on many attractions
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Headphones size={32} className="text-green-700 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-1">Support when you need it</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Booking.com's global Customer Service team is here to help 24/7
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}