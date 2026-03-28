import { z } from 'zod'

export type RegisterFormData = {
    fname: string
    lname: string
    email: string
    phone: string
    idcode: string
    password: string
    confirmPassword: string
}

export const step0Schema = z.object({
    fname: z.string().min(1, 'fnameError'),
    lname: z.string().min(1, 'lnameError'),
    idcode: z.string().regex(/^\d{11}$/, 'idError'),
})

export const step1Schema = z.object({
    email: z.string().min(1, 'emailError').email('emailError'),
    phone: z.string().min(1, 'phoneError'),
})

export const step2Schema = z
    .object({
        password: z.string().min(8, 'pwError'),
        confirmPassword: z.string(),
    })
    .refine(data => data.confirmPassword === data.password, {
        message: 'cpwError',
        path: ['cpw'],
    })

const STEP_SCHEMAS = [step0Schema, step1Schema, step2Schema]

/** Returns a map of field → translation key string */
export function validateRegisterStep(step: number, data: RegisterFormData): Record<string, string> {
    const schema = STEP_SCHEMAS[step]
    if (!schema) return {}
    const result = schema.safeParse(data)
    if (result.success) return {}
    const errs: Record<string, string> = {}
    for (const issue of result.error.issues) {
        const key = String(issue.path[0])
        if (!errs[key]) errs[key] = issue.message
    }
    return errs
}
