'use server';

import { auth } from './config';
import { db } from '../db';
import { users, passwords, guestUsers } from '../db/schema/auth';
import { signUpSchema, signInSchema, generateGuestSessionId } from '../utils';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export type AuthResult = {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
};

export type GuestResult = {
  success: boolean;
  error?: string;
  guestId?: string;
  sessionId?: string;
};

export async function signUp(formData: FormData): Promise<AuthResult> {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        email: validatedData.email.toLowerCase(),
        name: validatedData.name,
        emailVerified: false,
      })
      .returning();

    await db.insert(passwords).values({
      userId: newUser.id,
      hashedPassword,
    });

    const session = await auth.api.signInEmail({
      body: {
        email: validatedData.email.toLowerCase(),
        password: validatedData.password,
      },
      headers: new Headers(),
    });

    if (session) {
      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name || undefined,
        },
      };
    }

    return {
      success: false,
      error: 'Failed to create session after registration',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred during registration',
    };
  }
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validatedData = signInSchema.parse(rawData);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email.toLowerCase()))
      .limit(1);

    if (user.length === 0) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const userPassword = await db
      .select()
      .from(passwords)
      .where(eq(passwords.userId, user[0].id))
      .limit(1);

    if (userPassword.length === 0) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      userPassword[0].hashedPassword
    );

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const session = await auth.api.signInEmail({
      body: {
        email: validatedData.email.toLowerCase(),
        password: validatedData.password,
      },
      headers: new Headers(),
    });

    if (session) {
      return {
        success: true,
        user: {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name || undefined,
        },
      };
    }

    return {
      success: false,
      error: 'Failed to create session',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred during sign in',
    };
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    await auth.api.signOut({
      headers: new Headers(),
    });
    return { success: true };
  } catch {
    return {
      success: false,
      error: 'Failed to sign out',
    };
  }
}

export async function createGuestUser(cartData?: Record<string, unknown>): Promise<GuestResult> {
  try {
    const sessionId = generateGuestSessionId();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const [guestUser] = await db
      .insert(guestUsers)
      .values({
        sessionId,
        cartData: cartData || {},
        expiresAt,
      })
      .returning();

    const cookieStore = await cookies();
    cookieStore.set('guest_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return {
      success: true,
      guestId: guestUser.id,
      sessionId: guestUser.sessionId,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to create guest session',
    };
  }
}

export async function getGuestUser(sessionId: string) {
  try {
    const guestUser = await db
      .select()
      .from(guestUsers)
      .where(
        and(
          eq(guestUsers.sessionId, sessionId),
          gt(guestUsers.expiresAt, new Date())
        )
      )
      .limit(1);

    return guestUser[0] || null;
  } catch {
    return null;
  }
}

export async function updateGuestCart(sessionId: string, cartData: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(guestUsers)
      .set({
        cartData,
        updatedAt: new Date(),
      })
      .where(eq(guestUsers.sessionId, sessionId));

    return { success: true };
  } catch {
    return {
      success: false,
      error: 'Failed to update cart',
    };
  }
}

export async function convertGuestToUser(guestSessionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const guestUser = await getGuestUser(guestSessionId);
    
    if (!guestUser) {
      return {
        success: false,
        error: 'Guest session not found',
      };
    }

    await db
      .delete(guestUsers)
      .where(eq(guestUsers.sessionId, guestSessionId));

    const cookieStore = await cookies();
    cookieStore.delete('guest_session_id');

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to convert guest account',
    };
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
