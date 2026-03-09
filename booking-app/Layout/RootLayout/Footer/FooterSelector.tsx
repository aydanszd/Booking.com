"use client";

import { usePathname } from "next/navigation";
import DefaultFooter from "./page";
import FlightsFooter from "./FlightsFooter";

export default function FooterSelector() {
    const pathname = usePathname() || "";
    const isFlights = pathname === "/flights" || pathname.startsWith("/flights/");

    if (isFlights) return <FlightsFooter />;

    return <DefaultFooter />;
}