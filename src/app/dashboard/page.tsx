import React from "react";
import { getCurrentUser } from "@/lib/auth/actions";
import { signOutAction } from "@/lib/auth/server-actions";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-light-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-dark-900 font-jost">
            Welcome to Nike Dashboard
          </h1>
          <form action={signOutAction}>
            <button
              type="submit"
              className="bg-dark-900 hover:bg-dark-700 text-light-100 font-jost font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-dark-900 font-jost mb-4">
            User Profile
          </h2>
          <div className="space-y-2">
            <p className="text-dark-700 font-jost">
              <span className="font-medium">Name:</span> {user.name || 'Not provided'}
            </p>
            <p className="text-dark-700 font-jost">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-dark-700 font-jost">
              <span className="font-medium">Account Type:</span> {user.email.includes('@temp.local') ? 'Guest' : 'Registered'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
