"use client";

import { usePathname } from "next/navigation";
import DefaultFooter from "./page";
import FlightsFooter from "./FlightsFooter";

export default function FooterSelector() {
    const pathname = usePathname() || "";
    const isFlights = pathname === "/flights" || pathname.startsWith("/flights/");
    const isSignin = pathname === "/signin" || pathname.startsWith("/signin/");
    const isRegister = pathname === "/register" || pathname.startsWith("/register/");
    if (isSignin) return null;
    if (isRegister) return null;
    if (isFlights) return <FlightsFooter />;
    return <DefaultFooter />;
}