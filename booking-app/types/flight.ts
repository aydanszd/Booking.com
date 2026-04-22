export type FlightStop = {
    airport: string;
    duration: number;
};

export type BookingSite = {
    name: string;
    url: string;
    price: number;
};

export interface FlightEndpoint {
    city: string;
    airport?: string;
    code: string;
}

export interface FlightType {
    _id: string;
    airline: string;
    alliance?: string;
    flightNumber?: string;
    aircraft?: string;
    cabin: 'economy' | 'premium_economy' | 'business' | 'first';
    origin: FlightEndpoint;
    destination: FlightEndpoint;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    stops: FlightStop[];
    price: number;
    baggagePerPax?: string;
    flightQuality?: number;
    bookingSites: BookingSite[];
    totalSeats: number;
    bookedSeats: number;
    logoUrl?: string;
    inbound?: FlightType;
}

export interface FetchFlightsResponse {
    flights: FlightType[];
    total: number;
}

export type ModalType = 'add' | 'edit' | 'delete' | null;

export type SortKey = 'price_asc' | 'price_desc' | 'duration' | 'quality'

export interface Filters {
    cabin: string[]
    stops: string[]
    airline: string
    minPrice: number
    maxPrice: number
    origin: string
    destination: string
    sortBy: SortKey
}

export const DEFAULT_FILTERS: Filters = {
    cabin: [],
    stops: [],
    airline: '',
    minPrice: 0,
    maxPrice: 5000,
    origin: '',
    destination: '',
    sortBy: 'price_asc',
}
