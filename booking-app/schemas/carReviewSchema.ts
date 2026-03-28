import { z } from 'zod'

export const carReviewSchema = z.object({
    score: z
        .number({ invalid_type_error: 'Qiymət seçilməlidir' })
        .min(1, 'Minimum 1 ulduz seçin')
        .max(10, 'Maksimum 10 ulduz'),

    comment: z
        .string()
        .min(1, 'Rəy yazılmalıdır')
        .max(1000, 'Rəy çox uzundur'),
})

export type CarReviewFormValues = z.infer<typeof carReviewSchema>
