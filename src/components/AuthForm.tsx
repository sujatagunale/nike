"use client";

import React, { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signUp, signIn } from "@/lib/auth/actions";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { setUser } = useAppStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = mode === "signup" 
          ? await signUp(formData)
          : await signIn(formData);

        if (result.success && result.user) {
          setUser(result.user);
          router.push('/');
        } else {
          setError(result.error || 'Authentication failed');
        }
      } catch {
        setError('An unexpected error occurred');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-jost text-sm">
          {error}
        </div>
      )}

      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark-900 font-jost mb-2">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required={mode === "signup"}
            disabled={isPending}
            className="w-full px-4 py-3 border border-light-300 rounded-lg focus:ring-2 focus:ring-dark-900 focus:border-transparent outline-none font-jost text-body disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your full name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-dark-900 font-jost mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isPending}
          className="w-full px-4 py-3 border border-light-300 rounded-lg focus:ring-2 focus:ring-dark-900 focus:border-transparent outline-none font-jost text-body disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="johndoe@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-dark-900 font-jost mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            disabled={isPending}
            className="w-full px-4 py-3 pr-12 border border-light-300 rounded-lg focus:ring-2 focus:ring-dark-900 focus:border-transparent outline-none font-jost text-body disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="minimum 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isPending}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-900 disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-orange hover:bg-orange/90 text-light-100 font-jost font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending 
          ? (mode === "signin" ? "Signing In..." : "Signing Up...") 
          : (mode === "signin" ? "Sign In" : "Sign Up")} →
      </button>

      {mode === "signin" && (
        <div className="text-center">
          <a href="#" className="text-dark-700 hover:text-dark-900 font-jost text-body underline">
            Forgot password?
          </a>
        </div>
      )}
    </form>
  );
}
