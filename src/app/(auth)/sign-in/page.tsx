"use client";

import React from "react";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import SocialProviders from "@/components/SocialProviders";

export default function SignIn() {
  return (
    <div className="space-y-8">
      <div className="text-right">
        <span className="text-dark-700 font-jost text-body">Don&apos;t have an account? </span>
        <Link href="/sign-up" className="text-dark-900 font-jost font-medium underline">
          Sign Up
        </Link>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-dark-900 font-jost">
          Welcome back to Nike!
        </h1>
        <p className="text-dark-700 font-jost text-body">
          Please enter your details to sign in your account
        </p>
      </div>

      <SocialProviders />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-light-100 text-dark-700 font-jost">Or sign in with</span>
        </div>
      </div>

      <AuthForm mode="signin" />
    </div>
  );
}
