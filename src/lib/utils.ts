import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
});

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const guestSessionSchema = z.object({
  sessionId: z.string().optional(),
  cartData: z.record(z.string(), z.unknown()).optional(),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type GuestSessionData = z.infer<typeof guestSessionSchema>;

export function isValidEmail(email: string): boolean {
  return signInSchema.shape.email.safeParse(email).success;
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function sanitizeInput(input: string): string {
  return input.trim().toLowerCase();
}

export function generateGuestSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
