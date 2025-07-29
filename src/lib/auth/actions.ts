'use server';

import { auth } from './config';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    redirect('/');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid email or password';
    return { error: errorMessage };
  }
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !name) {
    return { error: 'All fields are required' };
  }

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
      headers: await headers(),
    });

    redirect('/');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
    return { error: errorMessage };
  }
}

export async function signInAsGuest() {
  try {
    await auth.api.signInAnonymous({
      headers: await headers(),
    });

    redirect('/');
  } catch {
    return { error: 'Failed to create guest session' };
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect('/sign-in');
  } catch {
    return { error: 'Failed to sign out' };
  }
}
