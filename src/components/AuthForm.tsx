'use client';

import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth/actions';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const result = mode === 'signin' 
      ? await signInWithEmail(formData)
      : await signUpWithEmail(formData);

    if (result?.error) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block font-jost text-body font-medium text-dark-900 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 border border-light-400 rounded-lg font-jost text-body focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block font-jost text-body font-medium text-dark-900 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 border border-light-400 rounded-lg font-jost text-body focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-jost text-body font-medium text-dark-900 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={6}
          className="w-full px-4 py-3 border border-light-400 rounded-lg font-jost text-body focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="p-4 bg-red text-light-100 rounded-lg font-jost text-body">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-dark-900 text-light-100 py-3 px-4 rounded-lg font-jost text-body font-medium hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}
