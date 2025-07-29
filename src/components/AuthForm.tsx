"use client";

import { useState, useTransition } from "react";
import { signUp, signIn } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "signin" | "signup";
}

interface FormData {
  email: string;
  password: string;
  name?: string;
}

interface FormErrors {
  email?: string[];
  password?: string[];
  name?: string[];
  general?: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formDataObj = new FormData();
    formDataObj.append('email', formData.email);
    formDataObj.append('password', formData.password);
    if (mode === 'signup' && formData.name) {
      formDataObj.append('name', formData.name);
    }

    startTransition(async () => {
      try {
        const result = mode === 'signup' 
          ? await signUp(formDataObj)
          : await signIn(formDataObj);

        if (result.success) {
          router.push('/');
          router.refresh();
        } else {
          if (result.errors) {
            setErrors(result.errors);
          } else if (result.message) {
            setErrors({ general: result.message });
          }
        }
      } catch {
        setErrors({ general: 'An unexpected error occurred' });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {errors.general}
        </div>
      )}

      {mode === "signup" && (
        <div>
          <label
            htmlFor="name"
            className="block font-jost text-body font-medium text-dark-900 mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 border rounded-lg font-jost text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent ${
              errors.name ? 'border-red-400' : 'border-light-400'
            }`}
            required
            disabled={isPending}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block font-jost text-body font-medium text-dark-900 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="johndoe@gmail.com"
          className={`w-full px-4 py-3 border rounded-lg font-jost text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent ${
            errors.email ? 'border-red-400' : 'border-light-400'
          }`}
          required
          disabled={isPending}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block font-jost text-body font-medium text-dark-900 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="minimum 8 character"
            className={`w-full px-4 py-3 pr-12 border rounded-lg font-jost text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent ${
              errors.password ? 'border-red-400' : 'border-light-400'
            }`}
            required
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-900"
            disabled={isPending}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-orange text-light-100 py-3 px-4 rounded-lg font-jost text-body-medium font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {mode === "signin" ? "Signing In..." : "Creating Account..."}
          </span>
        ) : (
          `${mode === "signin" ? "Sign In" : "Sign Up"} →`
        )}
      </button>

      {mode === "signin" && (
        <div className="text-center">
          <a
            href="#"
            className="font-jost text-body text-dark-900 hover:text-orange transition-colors"
          >
            Forgot password?
          </a>
        </div>
      )}
    </form>
  );
}
