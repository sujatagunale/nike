'use server';

import { signOut as betterAuthSignOut } from './config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token');
    
    if (sessionToken) {
      await betterAuthSignOut({
        headers: new Headers({
          cookie: `better-auth.session_token=${sessionToken.value}`,
        }),
      });
    }

    cookieStore.delete('better-auth.session_token');
    
    redirect('/sign-in');
  } catch (error) {
    console.error('Sign out error:', error);
    redirect('/sign-in');
  }
}
