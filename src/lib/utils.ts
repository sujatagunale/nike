import { auth } from './auth/config';
import { headers } from 'next/headers';

export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session || null;
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session?.session;
}

export async function isGuest() {
  const session = await getServerSession();
  return session?.user?.isAnonymous || false;
}
