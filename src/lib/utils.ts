import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function isValidPassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}

export function isValidName(name: string): boolean {
  return nameSchema.safeParse(name).success;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function isGuestUser(user: { isGuest?: boolean } | null | undefined): boolean {
  return user?.isGuest === true;
}

export function formatUserName(user: { name?: string; email?: string; isGuest?: boolean } | null | undefined): string {
  if (!user) return 'Guest';
  if (isGuestUser(user)) return 'Guest';
  return user.name || user.email || 'User';
}

export function parseCartData(cartData: string | null): unknown[] {
  if (!cartData) return [];
  try {
    return JSON.parse(cartData);
  } catch {
    return [];
  }
}
