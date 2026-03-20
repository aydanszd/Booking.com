"use client";
import { useState } from "react";
import { Bell, Globe, Lock, Palette, Save } from "lucide-react";

export default function SettingsPage() {
    const [siteName, setSiteName] = useState("Booking.com Admin");
    const [email, setEmail] = useState("admin@booking.com");
    const [timezone, setTimezone] = useState("Asia/Baku");
    const [language, setLanguage] = useState("English");
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);
    const [bookingAlerts, setBookingAlerts] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="max-w-2xl space-y-5">
            {/* General */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center"><Globe size={15} className="text-blue-600" /></div>
                    <h2 className="text-sm font-bold text-gray-700">General Settings</h2>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Platform Name</label>
                        <input value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#006ce4] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Admin Email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#006ce4] transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Timezone</label>
                            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#006ce4] transition-colors bg-white">
                                <option>Asia/Baku</option>
                                <option>Europe/Istanbul</option>
                                <option>Europe/London</option>
                                <option>America/New_York</option>
                                <option>Asia/Dubai</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Language</label>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#006ce4] transition-colors bg-white">
                                <option>English</option>
                                <option>Azerbaijani</option>
                                <option>Russian</option>
                                <option>Turkish</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center"><Bell size={15} className="text-orange-500" /></div>
                    <h2 className="text-sm font-bold text-gray-700">Notifications</h2>
                </div>
                <div className="p-5 space-y-4">
                    {[
                        { label: "Email Notifications", desc: "Receive updates via email", value: emailNotif, set: setEmailNotif },
                        { label: "SMS Notifications", desc: "Receive SMS alerts for critical events", value: smsNotif, set: setSmsNotif },
                        { label: "New Booking Alerts", desc: "Get notified on every new booking", value: bookingAlerts, set: setBookingAlerts },
                    ].map(({ label, desc, value, set }) => (
                        <div key={label} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{label}</p>
                                <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                            <button
                                onClick={() => set(!value)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-[#006ce4]" : "bg-gray-200"}`}
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : ""}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center"><Palette size={15} className="text-violet-600" /></div>
                    <h2 className="text-sm font-bold text-gray-700">Appearance</h2>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Dark Mode</p>
                            <p className="text-xs text-gray-400">Switch the admin panel to dark theme</p>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${darkMode ? "bg-[#006ce4]" : "bg-gray-200"}`}
                        >
                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${darkMode ? "translate-x-5" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center"><Lock size={15} className="text-red-500" /></div>
                    <h2 className="text-sm font-bold text-gray-700">Security</h2>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#006ce4] transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">New Password</label>
                            <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#006ce4] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm Password</label>
                            <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#006ce4] transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
                <button onClick={handleSave} className="flex items-center gap-2 bg-[#006ce4] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0057b8] transition-colors">
                    <Save size={14} />
                    {saved ? "Saved!" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}