import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import SocialProviders from "@/components/SocialProviders";

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <div className="text-right">
        <span className="font-jost text-body text-dark-700">
          Already have an account?{" "}
        </span>
        <Link
          href="/sign-in"
          className="font-jost text-body font-medium text-dark-900 hover:text-orange transition-colors"
        >
          Sign In
        </Link>
      </div>

      <div className="text-center">
        <h1 className="font-jost text-heading-2 font-bold text-dark-900 mb-2">
          Create your Nike account
        </h1>
        <p className="font-jost text-body text-dark-700">
          Please enter your details to create your account
        </p>
      </div>

      <SocialProviders />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-400" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-light-100 font-jost text-body text-dark-700">
            Or sign up with
          </span>
        </div>
      </div>

      <AuthForm mode="signup" />

      <div className="text-center">
        <p className="font-jost text-caption text-dark-500">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-dark-900 hover:text-orange transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-dark-900 hover:text-orange transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>

      <div className="text-center text-caption font-jost text-dark-500">
        © 2024 Nike
      </div>
    </div>
  );
}
