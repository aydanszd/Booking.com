"use client";

import { usePathname } from "next/navigation";
import MainHeader from "./page";
import SecondLayoutOption from "./secondLayoutOption";

export default function HeaderSelector() {
  const pathname = usePathname() || "";
  const isFlights = pathname === "/flights" || pathname.startsWith("/flights/");
  const isStays = pathname === "/stays" || pathname.startsWith("/stays/");

  if (isFlights) return <SecondLayoutOption />;
  if (isStays) return <MainHeader />;

  return <MainHeader />;
}