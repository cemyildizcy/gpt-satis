import { z } from 'zod'

export const registerSchema = z.object({
  email: z
    .string()
    .email('Geçerli bir email adresi giriniz')
    .min(1, 'Email zorunludur'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100, 'Şifre en fazla 100 karakter olabilir'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(1, 'Şifre zorunludur'),
})

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
  email: z.string().email('Geçerli bir email adresi giriniz').optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'PENDING']).optional(),
  addedToWorkspace: z.boolean().optional(),
  notes: z.string().optional().nullable(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  subscriptionEnd: z.string().datetime().optional().nullable(),
})

export const subscriptionSchema = z.object({
  months: z.number().min(1).max(12),
})

export const paymentReviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminNote: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type SubscriptionInput = z.infer<typeof subscriptionSchema>
export type PaymentReviewInput = z.infer<typeof paymentReviewSchema>
