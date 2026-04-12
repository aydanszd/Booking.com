"use client";

import { usePathname } from "next/navigation";
import DefaultFooter from "./page";
import FlightsFooter from "./FlightsFooter";

export default function FooterSelector() {
    const raw = usePathname() || "";
    const pathname = raw.replace(/^\/(en|tr|ru)(\/|$)/, "/").replace(/\/$/, "") || "/";
    const isFlights = pathname === "/flights" || pathname.startsWith("/flights/");
    const isSignin = pathname === "/signin" || pathname.startsWith("/signin/");
    const isRegister = pathname === "/register" || pathname.startsWith("/register/");
    const isForgot = pathname === "/forgot-password" || pathname.startsWith("/forgot-password/");
    const isReset = pathname.startsWith("/reset-password/");
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin || isSignin || isRegister || isForgot || isReset) return null;
    if (isFlights) return <FlightsFooter />;
    return <DefaultFooter />;
}