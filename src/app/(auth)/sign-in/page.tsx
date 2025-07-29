import AuthForm from "@/components/AuthForm";
import SocialProviders from "@/components/SocialProviders";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <div className="text-right">
        <span className="font-jost text-body text-dark-700">
          Don&apos;t have an account?{" "}
        </span>
        <Link
          href="/sign-up"
          className="font-jost text-body font-medium text-dark-900 hover:text-orange transition-colors"
        >
          Sign Up
        </Link>
      </div>

      <div className="text-center">
        <h1 className="font-jost text-heading-2 font-bold text-dark-900 mb-2">
          Welcome Back
        </h1>
        <p className="font-jost text-body text-dark-700">
          Please enter your details to sign in your account
        </p>
      </div>

      <SocialProviders />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-400" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-light-100 font-jost text-body text-dark-700">
            Or sign in with
          </span>
        </div>
      </div>

      <AuthForm mode="signin" />

      <div className="text-center text-caption font-jost text-dark-500">
        © 2024 Nike
      </div>
    </div>
  );
}
