export type CarType = {
    _id?: string;
    title: string;
    brand: string;
    model: string;
    category: string;
    transmission: string;
    seats: number;
    mileage: number;
    pricePerDay: number;
    isAvailable: boolean;
    location: { city: string; country: string };
    features: string[];
    images: string[];
    rating?: number;
};

export type ModalType = "add" | "edit" | "delete" | null;

export type CarReview = {
    _id: string
    userName: string
    score: number
    comment: string
    adminReply?: string | null
    adminReplyAt?: string | null
    createdAt: string
}

export type CarWithReviews = CarType & {
    reviews?: CarReview[]
    bookedDates?: { pickUp: string; dropOff: string }[]
}