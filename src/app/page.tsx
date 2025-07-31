import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-light-100 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-dark-900 font-jost">
          Welcome to Nike
        </h1>
        <p className="text-lg text-dark-700 font-jost">
          Your ultimate destination for athletic gear and lifestyle products
        </p>
        <div className="space-x-4">
          <Link
            href="/sign-in"
            className="inline-block bg-orange hover:bg-orange/90 text-light-100 font-jost font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-block border border-dark-900 text-dark-900 hover:bg-dark-900 hover:text-light-100 font-jost font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
