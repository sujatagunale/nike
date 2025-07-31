'use server';

import { z } from 'zod';
import { auth } from './config';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { db } from '../db';
import { users, guestSessions } from '../db/schema';
import { eq } from 'drizzle-orm';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type AuthResult = {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    isGuest?: boolean;
  };
};

export type GuestSessionResult = {
  success: boolean;
  sessionToken?: string;
  error?: string;
};

export async function signUp(formData: FormData): Promise<AuthResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      },
    });

    if (!result.user) {
      return { success: false, error: 'Failed to create account' };
    }

    if (result.token) {
      const cookieStore = await cookies();
      cookieStore.set('better-auth.session_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return { success: true, user: result.user };
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

    if (!result.user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (result.token) {
      const cookieStore = await cookies();
      cookieStore.set('better-auth.session_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function signOut(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;
    
    if (sessionToken) {
      await auth.api.signOut({
        headers: new Headers({
          'cookie': `better-auth.session_token=${sessionToken}`
        })
      });
    }
    
    cookieStore.delete('better-auth.session_token');
  } catch (error) {
    console.error('Sign out error:', error);
  }
  redirect('/');
}

export async function createGuestSession(): Promise<GuestSessionResult> {
  try {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const [guestUser] = await db.insert(users).values({
      email: `guest_${sessionToken}@temp.nike.com`,
      name: 'Guest User',
      isGuest: true,
    }).returning();

    await db.insert(guestSessions).values({
      sessionToken,
      userId: guestUser.id,
      expiresAt,
      cartData: JSON.stringify([]),
    });

    const cookieStore = await cookies();
    cookieStore.set('nike_guest_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return { success: true, sessionToken };
  } catch (error) {
    console.error('Guest session creation error:', error);
    return { success: false, error: 'Failed to create guest session' };
  }
}

export async function convertGuestToUser(
  guestSessionToken: string,
  formData: FormData
): Promise<AuthResult> {
  try {
    const validatedData = signUpSchema.parse({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    });

    const [guestSession] = await db
      .select()
      .from(guestSessions)
      .where(eq(guestSessions.sessionToken, guestSessionToken))
      .limit(1);

    if (!guestSession) {
      return { success: false, error: 'Guest session not found' };
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        email: validatedData.email,
        name: validatedData.name,
        isGuest: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, guestSession.userId!))
      .returning();

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      },
    });

    if (!result.user) {
      return { success: false, error: 'Failed to create permanent account' };
    }

    const cookieStore = await cookies();
    cookieStore.delete('nike_guest_session');

    return { 
      success: true, 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name || undefined,
        isGuest: updatedUser.isGuest || undefined,
      }
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
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;
    if (!sessionToken) return null;
    
    const session = await auth.api.getSession({
      headers: new Headers({
        'cookie': `better-auth.session_token=${sessionToken}`
      })
    });
    return session?.user || null;
  } catch {
    return null;
  }
}

export async function getGuestSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('nike_guest_session')?.value;
    if (!sessionToken) return null;

    const [guestSession] = await db
      .select()
      .from(guestSessions)
      .where(eq(guestSessions.sessionToken, sessionToken))
      .limit(1);

    return guestSession || null;
  } catch {
    return null;
  }
}
