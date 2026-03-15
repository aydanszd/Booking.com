"use client";

import { usePathname } from "next/navigation";
import MainHeader from "./page";
import SecondLayoutOption from "./secondLayoutOption";
import CarRentalHeader from "./CarRender";
import AttractionsHeader from "./attractions"

export default function HeaderSelector() {
  const pathname = usePathname() || "";
  const isFlights = pathname === "/flights" || pathname.startsWith("/flights/");
  const isFlightsDetail = pathname === "/flightsdetail" || pathname.startsWith("/flightsdetail/");
  const isCarRental = pathname === "/carrender" || pathname.startsWith("/carrender/");
  const isattractions = pathname === "/attractions" || pathname.startsWith("/attractions/");
  const isCarFilter = pathname === "/carfilter" || pathname.startsWith("/carfilter/");
  const isCartDetails = pathname === "/cardetails" || pathname.startsWith("/cardetails/");

  if (isFlights) return <SecondLayoutOption />;
  if (isCarRental) return <CarRentalHeader />;
  if (isFlightsDetail) return <SecondLayoutOption />;
  if (isattractions) return <AttractionsHeader />;
  if (isCarFilter) return <CarRentalHeader />;
  if (isCartDetails) return <CarRentalHeader />;

  return <MainHeader />;
}