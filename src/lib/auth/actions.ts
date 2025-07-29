'use server';

import { redirect } from 'next/navigation';
import { auth } from './config';
import { z } from 'zod';
import { headers } from 'next/headers';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function signUp(formData: FormData) {
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
      headers: await headers(),
    });

    if (!result || result.token === null) {
      return { error: 'Failed to create account' };
    }

    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: 'Failed to create account' };
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
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
      headers: await headers(),
    });

    if (!result || !result.token) {
      return { error: 'Invalid email or password' };
    }

    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: 'Failed to sign in' };
  }
}

export async function signInAsGuest() {
  try {
    const result = await auth.api.signInAnonymous({
      headers: await headers(),
    });

    if (!result || !result.token) {
      return { error: 'Failed to create guest session' };
    }

    return { success: true, user: result.user };
  } catch {
    return { error: 'Failed to create guest session' };
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  } catch {
    return { error: 'Failed to sign out' };
  }
}

export async function signInWithProvider(provider: 'google' | 'apple') {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider,
      },
      headers: await headers(),
    });

    if (result?.url) {
      redirect(result.url);
    }

    return { success: true };
  } catch {
    return { error: `Failed to sign in with ${provider}` };
  }
}

export async function getCurrentSession() {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });
    return result || null;
  } catch {
    return null;
  }
}
