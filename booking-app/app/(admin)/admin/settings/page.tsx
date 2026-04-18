"use client";
import { useState, useEffect } from "react";
import { Bell, Globe, Lock, Palette, Save, Check, Eye, EyeOff, AlertCircle } from "lucide-react";

const STORAGE_KEY = "admin_settings";

const DEFAULT = {
    siteName: "Booking.com Admin",
    email: "admin@booking.com",
    timezone: "Asia/Baku",
    language: "English",
    emailNotif: true,
    smsNotif: false,
    bookingAlerts: true,
    darkMode: false,
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!value)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${value ? "bg-[#006ce4]" : "bg-gray-200"}`}
        >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : ""}`} />
        </button>
    );
}

export default function SettingsPage() {
    const [form, setForm] = useState(DEFAULT);
    const [saved, setSaved] = useState(false);

    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwError, setPwError] = useState("");
    const [pwSaved, setPwSaved] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setForm(parsed);
                applyDark(parsed.darkMode);
            }
        } catch {}
    }, []);

    const applyDark = (on: boolean) => {
        document.documentElement.classList.toggle("dark", on);
    };

    const set = <K extends keyof typeof DEFAULT>(key: K, value: (typeof DEFAULT)[K]) => {
        setForm(prev => {
            const next = { ...prev, [key]: value };
            if (key === "darkMode") applyDark(value as boolean);
            return next;
        });
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handlePasswordSave = () => {
        if (!currentPw) return setPwError("Current password is required.");
        if (newPw.length < 6) return setPwError("New password must be at least 6 characters.");
        if (newPw !== confirmPw) return setPwError("Passwords do not match.");
        setPwError("");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setPwSaved(true);
        setTimeout(() => setPwSaved(false), 2500);
    };

    const inputCls = "w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-800 outline-none focus:border-[#006ce4] transition-colors bg-white";

    return (
        <div className="space-y-5">
            {/* General */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Globe size={15} className="text-blue-600" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">General Settings</h2>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Platform Name</label>
                        <input value={form.siteName} onChange={e => set("siteName", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Admin Email</label>
                        <input value={form.email} onChange={e => set("email", e.target.value)} type="email" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Timezone</label>
                            <select value={form.timezone} onChange={e => set("timezone", e.target.value)} className={inputCls}>
                                {["Asia/Baku", "Europe/Istanbul", "Europe/London", "America/New_York", "Asia/Dubai"].map(tz => (
                                    <option key={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Language</label>
                            <select value={form.language} onChange={e => set("language", e.target.value)} className={inputCls}>
                                {["English", "Azerbaijani", "Russian", "Turkish"].map(l => (
                                    <option key={l}>{l}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Bell size={15} className="text-orange-500" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">Notifications</h2>
                </div>
                <div className="p-5 divide-y divide-gray-50 dark:divide-gray-800">
                    {([
                        { label: "Email Notifications", desc: "Receive updates via email", key: "emailNotif" as const },
                        { label: "SMS Notifications", desc: "Receive SMS alerts for critical events", key: "smsNotif" as const },
                        { label: "New Booking Alerts", desc: "Get notified on every new booking", key: "bookingAlerts" as const },
                    ]).map(({ label, desc, key }) => (
                        <div key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
                                <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                            <Toggle value={form[key] as boolean} onChange={v => set(key, v)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                        <Palette size={15} className="text-violet-600" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">Appearance</h2>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</p>
                            <p className="text-xs text-gray-400">Switch the admin panel to dark theme</p>
                        </div>
                        <Toggle value={form.darkMode} onChange={v => set("darkMode", v)} />
                    </div>
                </div>
            </div>

            {/* Save general */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors ${saved ? "bg-green-500" : "bg-[#006ce4] hover:bg-[#0057b8]"}`}
                >
                    {saved ? <Check size={14} /> : <Save size={14} />}
                    {saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                        <Lock size={15} className="text-red-500" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">Security</h2>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={currentPw}
                                onChange={e => setCurrentPw(e.target.value)}
                                placeholder="••••••••"
                                className={inputCls + " pr-10"}
                            />
                            <button onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPw}
                                    onChange={e => setNewPw(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputCls + " pr-10"}
                                />
                                <button onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPw}
                                    onChange={e => setConfirmPw(e.target.value)}
                                    placeholder="••••••••"
                                    className={`${inputCls} pr-10 ${confirmPw && confirmPw !== newPw ? "border-red-300 focus:border-red-400" : ""}`}
                                />
                                <button onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {newPw.length > 0 && (
                        <div className="flex gap-3">
                            {[
                                { label: "6+ chars", ok: newPw.length >= 6 },
                                { label: "Uppercase", ok: /[A-Z]/.test(newPw) },
                                { label: "Number", ok: /\d/.test(newPw) },
                            ].map(({ label, ok }) => (
                                <span key={label} className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${ok ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                    {ok ? "✓" : "·"} {label}
                                </span>
                            ))}
                        </div>
                    )}

                    {pwError && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500">
                            <AlertCircle size={13} />
                            {pwError}
                        </div>
                    )}

                    <div className="flex justify-end pt-1">
                        <button
                            onClick={handlePasswordSave}
                            className={`flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors ${pwSaved ? "bg-green-500" : "bg-red-500 hover:bg-red-600"}`}
                        >
                            {pwSaved ? <Check size={14} /> : <Lock size={14} />}
                            {pwSaved ? "Password Updated!" : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
