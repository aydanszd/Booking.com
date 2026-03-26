export interface Building {
    _id: string;
    title: string;
    type: string;
    brand?: string;
    location: { city: string; country: string; address?: string };
    rooms?: { bedrooms: number; bathrooms: number };
    amenities?: string[];
    travelGroups?: string[];
    pricePerNight: number;
    minNights?: number;
    maxGuests?: number;
    rating: number;
    isAvailable: boolean;
    images?: string[];
    description?: string;
    sustainability?: boolean;
}

export interface Filters {
    types: string[];
    brand: string;
    city: string;
    country: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    travelGroups: string[];
    availableOnly: boolean;
    minRating: number;
}