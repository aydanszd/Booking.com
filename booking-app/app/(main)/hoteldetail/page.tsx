import HotelImage from "@/sections/hoterdetail/hotelimage";
import Availability from "@/sections/hoterdetail/roomavailability";
import Rules from "@/sections/hoterdetail/hotelrule";
import Reviews from "@/sections/hoterdetail/guestreviews";
export default function HotelDetail() {
    return (
        <>
        <HotelImage />
        <Availability />
        <Rules/>
        <Reviews />
        </>
    )
}