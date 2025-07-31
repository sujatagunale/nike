import { auth } from './config';
import { cookies } from 'next/headers';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;
    
    if (!sessionToken) return null;
    
    const session = await auth.api.getSession({
      headers: new Headers({
        'cookie': `better-auth.session_token=${sessionToken}`
      })
    });
    
    return session;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Authentication required');
  }
  return session;
}
