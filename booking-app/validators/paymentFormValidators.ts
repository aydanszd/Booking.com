import { z } from 'zod'

export const paymentFormSchema = z.object({
    cardHolder: z
        .string()
        .min(2, 'Kart üzərindəki ad daxil edin')
        .max(60, 'Ad çox uzundur')
        .regex(/^[A-ZÇŞĞÜÖİa-zçşğüöı\s]+$/, 'Yalnız hərf daxil edin'),
    arrivalTime: z.string().min(1, 'Varış saatını seçin'),
    terms: z.literal(true, { error: 'Şərtləri qəbul etməlisiniz' }),
})

export type PaymentFormValues = z.infer<typeof paymentFormSchema>

export function validatePaymentForm(values: unknown) {
    const result = paymentFormSchema.safeParse(values)
    if (result.success) return { errors: null }
    const errors: Record<string, string> = {}
    for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        if (!errors[key]) errors[key] = issue.message
    }
    return { errors }
}
