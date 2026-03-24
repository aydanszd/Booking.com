"use client"
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Building2, Hotel, Car, Plane,
    MessageSquare, ShoppingBag, Settings, Users,
    Menu, Bell, Search, ChevronLeft, LogOut, Calendar,
} from "lucide-react";

const navGroups = [
    {
        label: "Main",
        items: [
            { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/buildings", label: "Buildings",  icon: Building2, badge: 3 },
            { href: "/admin/hotels",    label: "Hotels",     icon: Hotel },
            { href: "/admin/cars",      label: "Cars",       icon: Car, badge: 12 },
            { href: "/admin/flights",   label: "Flights",    icon: Plane },
        ],
    },
    {
        label: "Management",
        items: [
            { href: "/admin/messages", label: "Messages", icon: MessageSquare, badge: 7 },
            { href: "/admin/orders",   label: "Orders",   icon: ShoppingBag },
            { href: "/admin/bookings", label: "Bookings", icon: Calendar },
            { href: "/admin/users",    label: "Users",    icon: Users },
        ],
    },
    {
        label: "System",
        items: [
            { href: "/admin/settings", label: "Settings", icon: Settings },
        ],
    },
];

const pageMeta = {
    "/admin/dashboard": { title: "Dashboard",  subtitle: "Welcome back! Here's today's overview." },
    "/admin/buildings":  { title: "Buildings",  subtitle: "Manage all registered properties." },
    "/admin/hotels":     { title: "Hotels",     subtitle: "Browse and manage hotel listings." },
    "/admin/cars":       { title: "Cars",       subtitle: "Fleet and rental management." },
    "/admin/flights":    { title: "Flights",    subtitle: "Flight schedules and bookings." },
    "/admin/messages":   { title: "Messages",   subtitle: "Customer communications." },
    "/admin/orders":     { title: "Orders",     subtitle: "Track and manage all orders." },
    "/admin/bookings":   { title: "Bookings",   subtitle: "System wide reservations." },
    "/admin/users":      { title: "Users",      subtitle: "User accounts and permissions." },
    "/admin/settings":   { title: "Settings",   subtitle: "Configure your platform." },
};

function SidebarInner({ collapsed, onNavClick }: { collapsed: boolean; onNavClick: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            <div className={`flex items-center h-16 border-b border-gray-100 ${collapsed ? "justify-center px-3" : "gap-2 px-5"}`}>
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
                                                : "text-gray-500 hover:bg-[#006ce4] hover:text-white",
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

            <div className="border-t border-gray-100 p-3">
                {!collapsed ? (
                    <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-xl bg-[#006ce4] flex items-center justify-center text-white text-[11px] font-bold shrink-0">AK</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-gray-800 text-[13px] font-semibold truncate">Anar K.</div>
                            <div className="text-gray-400 text-[11px]">Administrator</div>
                        </div>
                        <LogOut size={14} className="text-gray-400 group-hover:text-red-400 transition-colors flex-shrink-0" />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-xl bg-[#006ce4] flex items-center justify-center text-white text-[11px] font-bold">AK</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const page = (pageMeta as any)[pathname] ?? { title: "Page", subtitle: "" };

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className={[
                "hidden lg:flex flex-col h-full bg-white border-r border-gray-100 shadow-sm flex-shrink-0 transition-all duration-300 ease-in-out relative",
                collapsed ? "w-[64px]" : "w-[216px]",
            ].join(" ")}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-[76px] z-10 w-6 h-6 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center text-gray-500 hover:text-[#006ce4] hover:border-[#006ce4] transition-colors"
                >
                    <ChevronLeft size={12} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
                </button>
                <SidebarInner collapsed={collapsed} onNavClick={() => {}} />
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={[
                "fixed top-0 left-0 h-full w-54 z-50 bg-white border-r border-gray-100 shadow-xl lg:hidden transition-transform duration-300 ease-in-out",
                mobileOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}>
                <SidebarInner collapsed={false} onNavClick={() => setMobileOpen(false)} />
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 gap-3 flex-shrink-0 w-full">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu size={18} />
                    </button>
                    <div className="hidden sm:flex items-center gap-2 flex-1">
                        <span className="text-xs font-extrabold text-[#006ce4]">Booking.com</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs text-gray-500 font-medium">{page.title}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 hover:border-[#006ce4]/30 transition-colors cursor-text">
                            <Search size={13} />
                            <span className="text-xs hidden md:block">Search...</span>
                        </div>
                        <button className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors">
                            <Bell size={16} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#006ce4] rounded-full text-[9px] text-white font-bold flex items-center justify-center">4</span>
                        </button>
                        <div className="w-8 h-8 rounded-xl bg-[#006ce4] flex items-center justify-center text-white text-[11px] font-bold cursor-pointer">AK</div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-800">{page.title}</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{page.subtitle}</p>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}