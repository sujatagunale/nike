"use client";

import { useState } from "react";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  email: string;
  password: string;
  name?: string;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full px-4 py-3 border border-light-400 rounded-lg font-jost text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
            required
          />
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
          className="w-full px-4 py-3 border border-light-400 rounded-lg font-jost text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          required
        />
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
            className="w-full px-4 py-3 pr-12 border border-light-400 rounded-lg font-jost text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-900"
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
      </div>

      <button
        type="submit"
        className="w-full bg-orange text-light-100 py-3 px-4 rounded-lg font-jost text-body-medium font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
      >
        {mode === "signin" ? "Sign In" : "Sign Up"} →
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
