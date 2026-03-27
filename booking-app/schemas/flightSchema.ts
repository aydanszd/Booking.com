import { z } from "zod";

export const flightSchema = z.object({
    airline: z.string().min(1, "Aviaşirkət mütləqdir"),
    alliance: z.string().optional(),
    flightNumber: z.string().optional(),
    aircraft: z.string().optional(),
    cabin: z.enum(["economy", "premium_economy", "business", "first"], {
        errorMap: () => ({ message: "Düzgün kabinə seçin" }),
    }),
    origin: z.object({
        airport: z.string().min(1, "Hava limanı mütləqdir"),
        city: z.string().min(1, "Şəhər mütləqdir"),
        code: z.string().min(2, "Kod mütləqdir").max(4),
    }),
    destination: z.object({
        airport: z.string().min(1, "Hava limanı mütləqdir"),
        city: z.string().min(1, "Şəhər mütləqdir"),
        code: z.string().min(2, "Kod mütləqdir").max(4),
    }),
    departureTime: z.string().min(1, "Uçuş vaxtı mütləqdir"),
    arrivalTime: z.string().min(1, "Eniş vaxtı mütləqdir"),
    duration: z
        .number({ invalid_type_error: "Müddət rəqəm olmalıdır" })
        .min(1, "Müddət mütləqdir"),
    stops: z.array(
        z.object({
            airport: z.string().min(1),
            duration: z.number().min(0),
        })
    ),
    price: z
        .number({ invalid_type_error: "Qiymət rəqəm olmalıdır" })
        .min(1, "Qiymət mütləqdir"),
    baggagePerPax: z.string().optional(),
    flightQuality: z.number().min(0).max(10).optional(),
    bookingSites: z.array(
        z.object({
            name: z.string().min(1),
            url: z.string().url("Düzgün URL daxil edin"),
            price: z.number().min(0),
        })
    ),
    totalSeats: z
        .number({ invalid_type_error: "Oturacaq sayı rəqəm olmalıdır" })
        .int()
        .min(1, "Minimum 1 oturacaq"),
    bookedSeats: z
        .number({ invalid_type_error: "Rəqəm olmalıdır" })
        .int()
        .min(0),
});

export type FlightFormValues = z.infer<typeof flightSchema>;

export const defaultFlightValues: FlightFormValues = {
    airline: "",
    alliance: "",
    flightNumber: "",
    aircraft: "",
    cabin: "economy",
    origin: { airport: "", city: "", code: "" },
    destination: { airport: "", city: "", code: "" },
    departureTime: "",
    arrivalTime: "",
    duration: 0,
    stops: [],
    price: 0,
    baggagePerPax: "",
    flightQuality: undefined,
    bookingSites: [],
    totalSeats: 180,
    bookedSeats: 0,
};