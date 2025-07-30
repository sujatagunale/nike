'use server';

import { auth } from './config';
import { signUpSchema, signInSchema, formatAuthError } from '../utils';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '../db';
import { user } from '../db/schema/auth';
import { eq } from 'drizzle-orm';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
    isGuest?: boolean | null;
    emailVerified?: boolean | null;
    image?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    const existingUser = await db.select().from(user).where(eq(user.email, validatedData.email)).limit(1);
    
    if (existingUser.length > 0) {
      return { success: false, error: 'User with this email already exists' };
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      },
      headers: await headers(),
    });

    if (result.user) {
      redirect('/');
    }

    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Sign up error:', error);
    return { success: false, error: formatAuthError(error) };
  }
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signInSchema.parse(rawData);

    const result = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
      headers: await headers(),
    });

    if (result.user) {
      redirect('/');
    }

    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Sign in error:', error);
    return { success: false, error: formatAuthError(error) };
  }
}

export async function signOut(): Promise<void> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect('/sign-in');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Sign out error:', error);
  }
}

export async function createGuestSession(): Promise<AuthResult> {
  try {
    const guestUser = await db.insert(user).values({
      email: `guest_${Date.now()}@temp.local`,
      name: 'Guest User',
      isGuest: true,
    }).returning();

    if (guestUser[0]) {
      return { success: true, user: guestUser[0] };
    }

    return { success: false, error: 'Failed to create guest session' };
  } catch (error) {
    console.error('Guest session error:', error);
    return { success: false, error: formatAuthError(error) };
  }
}

export async function convertGuestToUser(formData: FormData): Promise<AuthResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: 'No session found' };
    }

    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    await db.update(user)
      .set({
        email: validatedData.email,
        name: validatedData.name,
        isGuest: false,
      })
      .where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error('Convert guest error:', error);
    return { success: false, error: formatAuthError(error) };
  }
}
