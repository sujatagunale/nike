'use server';

import bcrypt from 'bcrypt';
import { auth } from './config';
import { db } from '../db';
import { users } from '../db/schema/users';
import { carts } from '../db/schema/carts';
import { signUpSchema, signInSchema, type AuthResponse } from '../utils';
import { eq, and, isNull } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData): Promise<AuthResponse> {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signUpSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = validatedData.data;

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash,
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get('guest-session-id')?.value;
    if (guestSessionId) {
      await db.update(carts)
        .set({ userId: newUser.id, sessionId: null })
        .where(and(eq(carts.sessionId, guestSessionId), isNull(carts.userId)));
      
      cookieStore.delete('guest-session-id');
    }

    await auth.api.signInEmail({
      body: { email, password },
    });

    return {
      success: true,
      message: 'Account created successfully',
      user: newUser,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'An error occurred during sign up',
    };
  }
}

export async function signIn(formData: FormData): Promise<AuthResponse> {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signInSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedData.data;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get('guest-session-id')?.value;
    if (guestSessionId) {
      await db.update(carts)
        .set({ userId: user.id, sessionId: null })
        .where(and(eq(carts.sessionId, guestSessionId), isNull(carts.userId)));
      
      cookieStore.delete('guest-session-id');
    }

    await auth.api.signInEmail({
      body: { email, password },
    });

    return {
      success: true,
      message: 'Signed in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'An error occurred during sign in',
    };
  }
}

export async function createGuestSession(): Promise<string> {
  try {
    const sessionId = crypto.randomUUID();
    
    const cookieStore = await cookies();
    cookieStore.set('guest-session-id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    await db.insert(carts).values({
      sessionId,
      userId: null,
    });

    return sessionId;
  } catch (error) {
    console.error('Guest session error:', error);
    throw new Error('Failed to create guest session');
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: new Headers(),
    });
  } catch (error) {
    console.error('Sign out error:', error);
  }
  redirect('/');
}
