"use client";

import { usePathname } from "next/navigation";
import MainHeader from "./homeHeader";
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
  const isRegister = pathname === "/register" || pathname.startsWith("/register/");
  const isSignIn = pathname === "/signin" || pathname.startsWith("/signin/");
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;
  if (isRegister) return null;  
  if (isSignIn) return null;
  if (isFlights) return <SecondLayoutOption />;
  if (isCarRental) return <CarRentalHeader />;
  if (isFlightsDetail) return <SecondLayoutOption />;
  if (isattractions) return <AttractionsHeader />;
  if (isCarFilter) return <CarRentalHeader />;
  if (isCartDetails) return <CarRentalHeader />;

  return <MainHeader />;
}