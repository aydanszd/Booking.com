export { buildingSchema } from '@/schemas/buildingSchema';
export type { BuildingFormValues as BuildingSchema } from '@/schemas/buildingSchema';

export interface Building {
    _id: string;
    title: string;
    location: { city: string; country: string; address?: string };
    type: 'hotel' | 'apartment' | 'villa' | 'hostel' | 'resort';
    brand?: string;
    rooms?: { bedrooms: number; bathrooms: number };
    pricePerNight: number;
    rating: number;
    isAvailable: boolean;
    images: string[];
    amenities?: string[];
    about?: string;
    travelGroups?: string[];
    minNights?: number;
    maxGuests?: number;
}

export interface BuildingForm {
    title: string;
    type: string;
    brand: string;
    city: string;
    country: string;
    address: string;
    pricePerNight: string;
    minNights: string;
    maxGuests: string;
    amenities: string;
    travelGroups: string[];
    bedrooms: string;
    bathrooms: string;
}

export const EMPTY_FORM: BuildingForm = {
    title: '', type: 'hotel', brand: '',
    city: '', country: '', address: '',
    pricePerNight: '', minNights: '1', maxGuests: '10',
    amenities: '', travelGroups: [],
    bedrooms: '', bathrooms: '',
};

export const INITIAL_SCHEMA: BuildingSchema = {
    title: '',
    type: 'hotel',
    brand: '',
    city: '',
    country: '',
    address: '',
    pricePerNight: 0,
    minNights: 1,
    maxGuests: 10,
    amenities: '',
    about: '',
    travelGroups: [],
    bedrooms: 0,
    bathrooms: 0,
};

export const TYPE_COLORS: Record<string, string> = {
    hotel: 'bg-violet-50 text-violet-600',
    apartment: 'bg-blue-50 text-blue-600',
    villa: 'bg-teal-50 text-teal-600',
    hostel: 'bg-gray-100 text-gray-600',
    resort: 'bg-orange-50 text-orange-500',
};
