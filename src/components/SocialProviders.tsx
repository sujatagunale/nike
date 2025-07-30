"use client";

import React from "react";
import { Chrome, Apple } from "lucide-react";

export default function SocialProviders() {
  const handleGoogleSignIn = async () => {
    try {
      window.location.href = '/api/auth/signin/google';
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      window.location.href = '/api/auth/signin/apple';
    } catch (error) {
      console.error("Apple sign-in error:", error);
    }
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center px-4 py-3 border border-light-300 rounded-lg bg-light-100 hover:bg-light-200 transition-colors font-jost text-body text-dark-900"
      >
        <Chrome className="w-5 h-5 mr-3" />
        Continue with Google
      </button>
      
      <button 
        onClick={handleAppleSignIn}
        className="w-full flex items-center justify-center px-4 py-3 border border-light-300 rounded-lg bg-light-100 hover:bg-light-200 transition-colors font-jost text-body text-dark-900"
      >
        <Apple className="w-5 h-5 mr-3" />
        Continue with Apple
      </button>
    </div>
  );
}
