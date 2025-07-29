"use client";

import React, { useTransition } from "react";
import { createGuestSession } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

export default function GuestSessionButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGuestSession = () => {
    startTransition(async () => {
      try {
        await createGuestSession();
        router.push('/');
        router.refresh();
      } catch (error) {
        console.error('Failed to create guest session:', error);
      }
    });
  };

  return (
    <button
      onClick={handleGuestSession}
      disabled={isPending}
      className="font-jost text-body text-dark-700 hover:text-orange transition-colors disabled:opacity-50"
    >
      {isPending ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating session...
        </span>
      ) : (
        'Continue as Guest'
      )}
    </button>
  );
}
