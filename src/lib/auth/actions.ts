'use server';

import { z } from 'zod';
import { auth } from './config';
import { db } from '../db';
import { users } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type AuthResult = {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
};

export async function signUp(formData: FormData): Promise<AuthResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      },
    });

    return {
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'An unexpected error occurred' };
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
    });

    return {
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function signOut(): Promise<void> {
  await auth.api.signOut({
    headers: new Headers(),
  });
  redirect('/');
}

export async function createGuestSession(): Promise<{ guestId: string }> {
  const guestIdentifier = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const [guestUser] = await db.insert(users).values({
    email: `${guestIdentifier}@guest.local`,
    name: 'Guest User',
    isGuest: true,
    guestIdentifier,
  }).returning();

  return { guestId: guestUser.id };
}

export async function convertGuestToUser(
  guestId: string,
  formData: FormData
): Promise<AuthResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    const existingUser = await db.query.users.findFirst({
      where: and(eq(users.email, validatedData.email), eq(users.isGuest, false)),
    });

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const [updatedUser] = await db.update(users)
      .set({
        email: validatedData.email,
        name: validatedData.name,
        isGuest: false,
        guestIdentifier: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, guestId))
      .returning();

    await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      },
    });

    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name || undefined,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to convert guest account' };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });
    return session?.user || null;
  } catch {
    return null;
  }
}
