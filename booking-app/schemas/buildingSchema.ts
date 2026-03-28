import { z } from 'zod'

export const buildingSchema = z.object({
    title: z
        .string()
        .min(1, 'Başlıq mütləqdir')
        .max(100, 'Başlıq çox uzundur'),

    type: z.enum(['hotel', 'apartment', 'villa', 'hostel', 'resort'], {
        errorMap: () => ({ message: 'Düzgün tip seçin' }),
    }),

    brand: z.string().optional(),

    city: z
        .string()
        .min(1, 'Şəhər mütləqdir'),

    country: z
        .string()
        .min(1, 'Ölkə mütləqdir'),

    address: z.string().optional(),

    pricePerNight: z
        .number({ invalid_type_error: 'Qiymət rəqəm olmalıdır' })
        .positive('Qiymət 0-dan böyük olmalıdır'),

    minNights: z
        .number({ invalid_type_error: 'Rəqəm olmalıdır' })
        .int()
        .min(1, 'Minimum 1 gecə')
        .optional(),

    maxGuests: z
        .number({ invalid_type_error: 'Rəqəm olmalıdır' })
        .int()
        .min(1, 'Minimum 1 qonaq')
        .optional(),

    bedrooms: z
        .number({ invalid_type_error: 'Rəqəm olmalıdır' })
        .int()
        .min(0, 'Mənfi ola bilməz')
        .optional(),

    bathrooms: z
        .number({ invalid_type_error: 'Rəqəm olmalıdır' })
        .int()
        .min(0, 'Mənfi ola bilməz')
        .optional(),

    amenities: z.string().optional(),

    travelGroups: z.array(z.string()).optional(),

    images: z.array(z.string()).optional(),
})

export type BuildingFormValues = z.infer<typeof buildingSchema>

export const defaultBuildingValues: BuildingFormValues = {
    title: '',
    type: 'hotel',
    brand: '',
    city: '',
    country: '',
    address: '',
    pricePerNight: 0,
    minNights: 1,
    maxGuests: 10,
    bedrooms: 0,
    bathrooms: 0,
    amenities: '',
    travelGroups: [],
    images: [],
}
