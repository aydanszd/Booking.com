"use client"
import React, { useState, useEffect, useRef } from "react";
import { AdminNotificationsProvider, useAdminNotifications } from "@/context/AdminNotificationsContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Building2, Car, Plane,
    Settings, Users,
    Menu, Bell, Search, ChevronLeft, LogOut, Calendar, CreditCard, Star, Languages, DollarSign,
    Camera, X, Globe,
} from "lucide-react";

const AVATAR_KEY = "admin_avatar";

function AvatarButton({ size = "md", onClick }: { size?: "sm" | "md"; onClick?: () => void }) {
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(AVATAR_KEY);
        if (stored) setAvatar(stored);
        const handler = () => setAvatar(localStorage.getItem(AVATAR_KEY));
        window.addEventListener("admin-avatar-changed", handler);
        return () => window.removeEventListener("admin-avatar-changed", handler);
    }, []);

    const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-[11px]";

    return (
        <div
            onClick={onClick}
            className={`${dim} rounded-xl bg-[#006ce4] flex items-center justify-center text-white font-bold cursor-pointer overflow-hidden shrink-0`}
        >
            {avatar
                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                : "AK"
            }
        </div>
    );
}

function AvatarModal({ onClose }: { onClose: () => void }) {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem(AVATAR_KEY);
        if (stored) setAvatar(stored);
    }, []);

    const applyFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = e => {
            const result = e.target?.result as string;
            setAvatar(result);
            localStorage.setItem(AVATAR_KEY, result);
            window.dispatchEvent(new Event("admin-avatar-changed"));
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setAvatar(null);
        localStorage.removeItem(AVATAR_KEY);
        window.dispatchEvent(new Event("admin-avatar-changed"));
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-80 p-6 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={16} />
                </button>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">Profile Photo</h3>

                {/* Preview */}
                <div className="flex justify-center mb-5">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#006ce4] flex items-center justify-center text-white text-3xl font-bold">
                        {avatar
                            ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                            : "AK"
                        }
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                            <Camera size={22} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Drop zone */}
                <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) applyFile(f); }}
                    onClick={() => inputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl py-5 flex flex-col items-center gap-1.5 cursor-pointer transition-colors ${dragging ? "border-[#006ce4] bg-blue-50 dark:bg-blue-950" : "border-gray-200 dark:border-gray-700 hover:border-[#006ce4]"}`}
                >
                    <Camera size={18} className="text-gray-400" />
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Click or drag image here</p>
                    <p className="text-[11px] text-gray-400">JPG, PNG, WEBP · max 5 MB</p>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) applyFile(f); }}
                />

                {avatar && (
                    <button
                        onClick={handleRemove}
                        className="mt-3 w-full py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-colors"
                    >
                        Remove photo
                    </button>
                )}
            </div>
        </div>
    );
}

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: string }
type NavGroup = { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
    {
        label: "Main",
        items: [
            { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/buildings", label: "Buildings",  icon: Building2 },
            { href: "/admin/cars",      label: "Cars",       icon: Car },
            { href: "/admin/flights",   label: "Flights",    icon: Plane },
        ],
    },
    {
        label: "Management",
        items: [
            { href: "/admin/destinations", label: "Destinations", icon: Globe },
            { href: "/admin/bookings", label: "Bookings", icon: Calendar },
            { href: "/admin/payments", label: "Payments", icon: CreditCard },
            { href: "/admin/reviews",  label: "Reviews",  icon: Star },
            { href: "/admin/users",    label: "Users",    icon: Users },
        ],
    },
    {
        label: "System",
        items: [
            { href: "/admin/translations", label: "Translations", icon: Languages },
            { href: "/admin/currencies",   label: "Currencies",   icon: DollarSign },
            { href: "/admin/settings", label: "Settings", icon: Settings },
        ],
    },
];

const pageMeta = {
    "/admin/dashboard": { title: "Dashboard",  subtitle: "Welcome back! Here's today's overview." },
    "/admin/buildings":  { title: "Buildings",  subtitle: "Manage all registered properties." },
    "/admin/cars":       { title: "Cars",       subtitle: "Fleet and rental management." },
    "/admin/flights":    { title: "Flights",    subtitle: "Flight schedules and bookings." },
    "/admin/bookings":   { title: "Bookings",   subtitle: "System wide reservations." },
    "/admin/payments":   { title: "Payments",   subtitle: "Reservation payment tracking." },
    "/admin/reviews":    { title: "Reviews",    subtitle: "Guest reviews and admin replies." },
    "/admin/users":         { title: "Users",         subtitle: "User accounts and permissions." },
    "/admin/translations":  { title: "Translations",  subtitle: "Manage EN · TR · RU translations." },
    "/admin/currencies":    { title: "Currencies",    subtitle: "Manage currency rates and symbols." },
    "/admin/settings":      { title: "Settings",      subtitle: "Configure your platform." },
    "/admin/destinations":  { title: "Destinations",  subtitle: "Manage explore destinations." },
};

function SidebarInner({ collapsed, onNavClick, onAvatarClick }: { collapsed: boolean; onNavClick: () => void; onAvatarClick: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            <div className={`flex items-center h-16 border-b border-gray-100 dark:border-gray-800 ${collapsed ? "justify-center px-3" : "gap-2 px-5"}`}>
                {!collapsed ? (
                    <div className="flex items-center select-none">
                        <span className="font-extrabold text-[20px] tracking-tight text-[#006ce4]">Booking</span>
                        <span className="font-extrabold text-[20px] tracking-tight text-[#006ce4]">.</span>
                        <span className="font-extrabold text-[20px] tracking-tight text-[#003580]">com</span>
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-[#006ce4] flex items-center justify-center">
                        <span className="text-white font-extrabold text-sm">B</span>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
                {navGroups.map((group) => (
                    <div key={group.label}>
                        {!collapsed && (
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-1.5">
                                {group.label}
                            </div>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavClick}
                                        title={collapsed ? item.label : undefined}
                                        className={[
                                            "relative w-full flex items-center rounded-xl transition-all duration-150 group",
                                            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                                            isActive
                                                ? "bg-[#006ce4] text-white shadow-md shadow-blue-200"
                                                : "text-gray-500 dark:text-gray-400 hover:bg-[#006ce4] hover:text-white",
                                        ].join(" ")}
                                    >
                                        <Icon size={17} className="shrink-0" />
                                        {!collapsed && (
                                            <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                                        )}
                                        {!collapsed && item.badge && (
                                            <span className={[
                                                "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center leading-none",
                                                isActive
                                                    ? "bg-white/25 text-white"
                                                    : "bg-[#006ce4]/10 text-[#006ce4] group-hover:bg-white/25 group-hover:text-white",
                                            ].join(" ")}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {collapsed && item.badge && (
                                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="border-t border-gray-100 dark:border-gray-800 p-3">
                {!collapsed ? (
                    <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                        <AvatarButton onClick={onAvatarClick} />
                        <div className="flex-1 min-w-0">
                            <div className="text-gray-800 dark:text-gray-200 text-[13px] font-semibold truncate">Anar K.</div>
                            <div className="text-gray-400 text-[11px]">Administrator</div>
                        </div>
                        <LogOut size={14} className="text-gray-400 group-hover:text-red-400 transition-colors shrink-0" />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <AvatarButton onClick={onAvatarClick} />
                    </div>
                )}
            </div>
        </div>
    );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
    const { total } = useAdminNotifications();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [avatarModal, setAvatarModal] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        try {
            const s = localStorage.getItem("admin_settings");
            if (s) {
                const { darkMode } = JSON.parse(s);
                document.documentElement.classList.toggle("dark", !!darkMode);
            }
        } catch {}
    }, []);

    const page = (pageMeta as any)[pathname] ?? { title: "Page", subtitle: "" };

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* Desktop Sidebar */}
            <aside className={[
                "hidden lg:flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-sm shrink-0 transition-all duration-300 ease-in-out relative",
                collapsed ? "w-16" : "w-54",
            ].join(" ")}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-19 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center text-gray-500 hover:text-[#006ce4] hover:border-[#006ce4] transition-colors"
                >
                    <ChevronLeft size={12} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
                </button>
                <SidebarInner collapsed={collapsed} onNavClick={() => {}} onAvatarClick={() => setAvatarModal(true)} />
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={[
                "fixed top-0 left-0 h-full w-54 z-50 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-xl lg:hidden transition-transform duration-300 ease-in-out",
                mobileOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}>
                <SidebarInner collapsed={false} onNavClick={() => setMobileOpen(false)} onAvatarClick={() => setAvatarModal(true)} />
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-5 gap-3 shrink-0 w-full">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu size={18} />
                    </button>
                    <div className="hidden sm:flex items-center gap-2 flex-1">
                        <span className="text-xs font-extrabold text-[#006ce4]">Booking.com</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{page.title}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-400 hover:border-[#006ce4]/30 transition-colors cursor-text">
                            <Search size={13} />
                            <span className="text-xs hidden md:block">Search...</span>
                        </div>
                        <button className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors">
                            <Bell size={16} />
                            {total > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 bg-[#006ce4] rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                                    {total > 99 ? "99+" : total}
                                </span>
                            )}
                        </button>
                        <AvatarButton onClick={() => setAvatarModal(true)} />
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6 dark:bg-gray-950">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{page.title}</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{page.subtitle}</p>
                    </div>
                    {children}
                </main>
            </div>

            {avatarModal && <AvatarModal onClose={() => setAvatarModal(false)} />}
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminNotificationsProvider>
            <AdminLayoutInner>{children}</AdminLayoutInner>
        </AdminNotificationsProvider>
    );
}