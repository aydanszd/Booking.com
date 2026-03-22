import { z } from "zod";

export const carSchema = z.object({
    title: z
        .string()
        .min(1, "Başlıq mütləqdir")
        .max(100, "Başlıq çox uzundur"),

    brand: z
        .string()
        .min(1, "Marka mütləqdir"),

    model: z
        .string()
        .min(1, "Model mütləqdir"),

    category: z.enum(["economy", "compact", "suv", "luxury", "van", "electric"], {
        errorMap: () => ({ message: "Düzgün kateqoriya seçin" }),
    }),

    transmission: z.enum(["automatic", "manual"], {
        errorMap: () => ({ message: "Düzgün ötürücü seçin" }),
    }),

    seats: z
        .number({ invalid_type_error: "Oturacaq sayı rəqəm olmalıdır" })
        .int("Tam rəqəm daxil edin")
        .min(1, "Minimum 1 oturacaq")
        .max(20, "Maksimum 20 oturacaq"),

    mileage: z
        .number({ invalid_type_error: "Millaj rəqəm olmalıdır" })
        .min(0, "Millaj mənfi ola bilməz"),

    pricePerDay: z
        .number({ invalid_type_error: "Qiymət rəqəm olmalıdır" })
        .min(1, "Qiymət mütləqdir və 0-dan böyük olmalıdır"),

    isAvailable: z.boolean(),

    location: z.object({
        city: z.string().min(1, "Şəhər mütləqdir"),
        country: z.string().min(1, "Ölkə mütləqdir"),
    }),

    features: z.array(z.string()),

    images: z.array(z.string()),
});

export type CarFormValues = z.infer<typeof carSchema>;

export const defaultCarValues: CarFormValues = {
    title: "",
    brand: "",
    model: "",
    category: "economy",
    transmission: "automatic",
    seats: 5,
    mileage: 0,
    pricePerDay: 0,
    isAvailable: true,
    location: { city: "", country: "" },
    features: [],
    images: [],
};