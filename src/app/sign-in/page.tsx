import React from 'react';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import SocialProviders from '@/components/SocialProviders';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-light-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-jost text-heading-3 font-medium text-dark-900">
            Sign in to your account
          </h1>
          <p className="mt-2 font-jost text-body text-dark-700">
            Welcome back! Please enter your details.
          </p>
        </div>

        <div className="bg-light-100 py-8 px-6 shadow-sm rounded-lg border border-light-300">
          <AuthForm mode="signin" />
          
          <div className="mt-6">
            <SocialProviders />
          </div>
        </div>

        <div className="text-center">
          <p className="font-jost text-body text-dark-700">
            Don&apos;t have an account?{' '}
            <Link 
              href="/sign-up" 
              className="font-medium text-dark-900 hover:text-dark-700 underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
