import { Filters } from "@/types/buildingFilter";

export const DEFAULT_FILTERS: Filters = {
    types: [],
    brand: "",
    city: "",
    country: "",
    minPrice: 0,
    maxPrice: 2000,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    travelGroups: [],
    availableOnly: false,
    minRating: 0,
};

export const BUILDING_TYPES = ["hotel", "apartment", "villa", "hostel", "resort"];
export const TRAVEL_GROUPS = ["solo", "couple", "family", "group", "business"];
export const AMENITY_OPTIONS = [
    "WiFi", "Pool", "Gym", "Parking", "Breakfast", "Air Conditioning", "Pet Friendly",
];
export const RATING_FILTERS = [
    { label: "Exceptional: 9+", value: 9 },
    { label: "Very good: 8+", value: 8 },
    { label: "Good: 7+", value: 7 },
    { label: "Pleasant: 6+", value: 6 },
];