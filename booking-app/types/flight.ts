export type FlightStop = {
    airport: string;
    duration: number;
};

export type BookingSite = {
    name: string;
    url: string;
    price: number;
};

export type FlightType = {
    _id?: string;
    airline: string;
    logoUrl?: string;
    alliance?: string;
    flightNumber?: string;
    aircraft?: string;
    cabin: "economy" | "premium_economy" | "business" | "first";
    origin: {
        airport: string;
        city: string;
        code: string;
    };
    destination: {
        airport: string;
        city: string;
        code: string;
    };
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
};

export type ModalType = "add" | "edit" | "delete" | null;