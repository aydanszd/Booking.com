"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
    { id: 1, label: "Personal", title: "Personal information", sub: "Tell us a bit about yourself" },
    { id: 2, label: "Contact", title: "Contact & travel", sub: "How can we reach you?" },
    { id: 3, label: "Security", title: "Account security", sub: "Protect your account" },
];

type FormData = {
    fname: string;
    lname: string;
    year: string;
    gender: string;
    email: string;
    phone: string;
    passport: string;
    password: string;
    confirm: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const initialData: FormData = {
    fname: "", lname: "", year: "", gender: "",
    email: "", phone: "", passport: "",
    password: "", confirm: "",
};

export default function RegisterForm() {
    const [step, setStep] = useState(1);
    const [done, setDone] = useState(false);
    const [data, setData] = useState<FormData>(initialData);
    const [errors, setErrors] = useState<Errors>({});
    const [showPw, setShowPw] = useState(false);
    const [showCf, setShowCf] = useState(false);

    const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setData((d) => ({ ...d, [key]: e.target.value }));

    const pwStrength = (pw: string) => {
        let s = 0;
        if (pw.length >= 8) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[0-9]/.test(pw)) s++;
        if (/[^A-Za-z0-9]/.test(pw)) s++;
        return s;
    };

    const strColor = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
    const strLabel = ["Weak", "Fair", "Good", "Strong"];

    const validate = (s: number): boolean => {
        const e: Errors = {};
        if (s === 1) {
            if (!data.fname.trim()) e.fname = "Enter your first name";
            if (!data.lname.trim()) e.lname = "Enter your surname";
            const y = parseInt(data.year);
            if (!data.year || y < 1920 || y > 2007) e.year = "Enter a valid year (1920–2007)";
            if (!data.gender) e.gender = "Select your gender";
        }
        if (s === 2) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email";
            if (!/^\+?[\d\s\-]{7,}$/.test(data.phone)) e.phone = "Enter a valid phone number";
            if (!data.passport.trim()) e.passport = "Enter your passport number";
        }
        if (s === 3) {
            if (data.password.length < 8) e.password = "Minimum 8 characters";
            if (data.password !== data.confirm) e.confirm = "Passwords do not match";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => {
        if (!validate(step)) return;
        if (step === 3) { setDone(true); return; }
        setStep((s) => s + 1);
    };

    const back = () => {
        setErrors({});
        setStep((s) => s - 1);
    };

    const progress = done ? 100 : Math.round((step / 3) * 100);

    const InputClass = (key: keyof FormData) =>
        `w-full h-11 px-3 rounded-lg border text-sm text-gray-900 bg-white outline-none transition-all
    ${errors[key]
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-[#0071c2] focus:ring-2 focus:ring-blue-100"
        }`;

    return (
        <div className="min-h-screen bg-[#f2f6fe] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {/* Card header */}
                <div className="bg-[#003b95] rounded-t-xl px-7 pt-6 pb-5">
                    <p className="text-xs text-blue-200 mb-1">
                        {done ? "Done" : `Step ${step} of 3`}
                    </p>
                    <h1 className="text-xl font-medium text-white">
                        {done ? "Welcome aboard!" : STEPS[step - 1].title}
                    </h1>
                    <p className="text-sm text-blue-200 mt-0.5">
                        {done ? "Your account has been created" : STEPS[step - 1].sub}
                    </p>
                    {/* Progress bar */}
                    <div className="mt-4 h-1 rounded-full bg-white/20 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step indicators */}
                <div className="bg-white border-x border-gray-100 flex">
                    {STEPS.map((s, i) => {
                        const isDone = done || s.id < step;
                        const isActive = !done && s.id === step;
                        return (
                            <div key={s.id} className="flex-1 flex flex-col items-center py-3 relative">
                                {i < 2 && (
                                    <div className={`absolute top-[22px] left-1/2 right-[-50%] h-px ${isDone ? "bg-[#003b95]" : "bg-gray-200"}`} />
                                )}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 z-10 transition-all
                  ${isDone ? "bg-[#003b95] text-white" : isActive ? "bg-[#0071c2] text-white ring-4 ring-blue-100" : "bg-gray-100 text-gray-400"}`}>
                                    {isDone ? <Check size={12} strokeWidth={2.5} /> : s.id}
                                </div>
                                <span className={`text-[11px] ${isDone ? "text-[#003b95] font-medium" : isActive ? "text-[#0071c2] font-medium" : "text-gray-400"}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Card body */}
                <div className="bg-white rounded-b-xl border border-t-0 border-gray-100 px-7 py-6">

                    {/* Step 1 */}
                    {step === 1 && !done && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">First name</label>
                                    <input className={InputClass("fname")} placeholder="John" value={data.fname} onChange={set("fname")} />
                                    {errors.fname && <p className="text-[11px] text-red-500 mt-1">{errors.fname}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Surname</label>
                                    <input className={InputClass("lname")} placeholder="Doe" value={data.lname} onChange={set("lname")} />
                                    {errors.lname && <p className="text-[11px] text-red-500 mt-1">{errors.lname}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Year of birth</label>
                                    <input className={InputClass("year")} type="number" placeholder="1990" value={data.year} onChange={set("year")} />
                                    {errors.year && <p className="text-[11px] text-red-500 mt-1">{errors.year}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Gender</label>
                                    <select className={InputClass("gender")} value={data.gender} onChange={set("gender")}>
                                        <option value="">Select</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                    {errors.gender && <p className="text-[11px] text-red-500 mt-1">{errors.gender}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && !done && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
                                <input className={InputClass("email")} type="email" placeholder="john@email.com" value={data.email} onChange={set("email")} />
                                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone number</label>
                                <input className={InputClass("phone")} type="tel" placeholder="+1 555 000 0000" value={data.phone} onChange={set("phone")} />
                                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Passport number</label>
                                <input className={`${InputClass("passport")} uppercase`} placeholder="AB1234567" value={data.passport} onChange={set("passport")} />
                                {errors.passport && <p className="text-[11px] text-red-500 mt-1">{errors.passport}</p>}
                            </div>
                            <div className="bg-blue-50 rounded-lg px-4 py-3 text-xs text-[#0c447c]">
                                Your passport number is encrypted and stored securely.
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && !done && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        className={InputClass("password")}
                                        type={showPw ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={data.password}
                                        onChange={set("password")}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPw((v) => !v)}
                                    >
                                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {data.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength(data.password) ? strColor[pwStrength(data.password) - 1] : "bg-gray-200"}`} />
                                            ))}
                                        </div>
                                        <p className={`text-[11px] font-medium ${["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"][pwStrength(data.password) - 1] ?? "text-gray-400"}`}>
                                            {pwStrength(data.password) > 0 ? strLabel[pwStrength(data.password) - 1] : ""}
                                        </p>
                                    </div>
                                )}
                                {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm password</label>
                                <div className="relative">
                                    <input
                                        className={InputClass("confirm")}
                                        type={showCf ? "text" : "password"}
                                        placeholder="Repeat your password"
                                        value={data.confirm}
                                        onChange={set("confirm")}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowCf((v) => !v)}
                                    >
                                        {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {errors.confirm && <p className="text-[11px] text-red-500 mt-1">{errors.confirm}</p>}
                            </div>
                        </div>
                    )}

                    {/* Done */}
                    {done && (
                        <div className="text-center py-2">
                            <div className="w-14 h-14 rounded-full bg-[#003b95] flex items-center justify-center mx-auto mb-4">
                                <Check size={28} strokeWidth={2.5} className="text-yellow-400" />
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Your account is ready to use.</p>
                            <div className="text-left bg-gray-50 rounded-lg border border-gray-100 divide-y divide-gray-100">
                                {[
                                    ["Full name", `${data.fname} ${data.lname}`],
                                    ["Email", data.email],
                                    ["Phone", data.phone],
                                    ["Year of birth", data.year],
                                    ["Gender", data.gender],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                                        <span className="text-gray-500">{label}</span>
                                        <span className="text-gray-900 font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-5 w-full h-11 bg-[#0071c2] hover:bg-[#005fa3] text-white text-sm font-medium rounded-lg transition-colors">
                                Go to my account →
                            </button>
                        </div>
                    )}

                    {/* Buttons */}
                    {!done && (
                        <div className={`flex gap-3 mt-6 pt-5 border-t border-gray-100 ${step === 1 ? "justify-end" : ""}`}>
                            {step > 1 && (
                                <button
                                    onClick={back}
                                    className="flex items-center gap-1 h-11 px-5 bg-white border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft size={15} /> Back
                                </button>
                            )}
                            <button
                                onClick={next}
                                className="flex-1 flex items-center justify-center gap-1 h-11 bg-[#0071c2] hover:bg-[#005fa3] text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {step === 3 ? "Create account" : "Continue"}
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    )}

                    {!done && (
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Already have an account?{" "}
                            <a href="#" className="text-[#0071c2] hover:underline font-medium">Sign in</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}