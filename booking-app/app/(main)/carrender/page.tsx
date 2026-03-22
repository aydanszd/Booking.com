import CarBrand from "@/sections/carrender/carbrend";
import Features from "@/sections/carrender/features";
import Faq from "@/sections/carrender/carfaq";
import Destination from "@/sections/carrender/populardestinations";
export default function CarRentalHeader() {
    return (
        <><CarBrand />
        <Features />
        <Faq/>
        <Destination/>
        </>
    );
}