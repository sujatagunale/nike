'use server';

import { z } from 'zod';
import { auth } from './config';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function signUp(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    const result = await auth.api.signUpEmail({
      body: validatedData,
    });

    if (!result.token) {
      return { error: 'Failed to create account' };
    }

    const cookieStore = await cookies();
    cookieStore.set('better-auth.session_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect('/dashboard');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function signIn(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signInSchema.parse(rawData);

    const result = await auth.api.signInEmail({
      body: validatedData,
    });

    if (!result.token) {
      return { error: 'Invalid email or password' };
    }

    const cookieStore = await cookies();
    cookieStore.set('better-auth.session_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect('/dashboard');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function createGuestSession() {
  try {
    const guestEmail = `guest_${Date.now()}_${Math.random().toString(36).substring(2)}@temp.local`;
    
    const result = await auth.api.signUpEmail({
      body: {
        email: guestEmail,
        password: crypto.randomUUID(),
        name: 'Guest User',
      },
    });

    if (!result.token) {
      return { error: 'Failed to create guest session' };
    }

    return { success: true, token: result.token };
  } catch {
    return { error: 'Failed to create guest session' };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token');
    
    if (!sessionToken) {
      return null;
    }

    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: `better-auth.session_token=${sessionToken.value}`,
      }),
    });

    return session?.user || null;
  } catch {
    return null;
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token');
    
    if (sessionToken) {
      await auth.api.signOut({
        headers: new Headers({
          cookie: `better-auth.session_token=${sessionToken.value}`,
        }),
      });
    }

    cookieStore.delete('better-auth.session_token');
    
    redirect('/sign-in');
  } catch {
    return { error: 'Failed to sign out' };
  }
}
