"use client";

import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-light-100 border-b border-light-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-dark-900"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.456 0-2.525-.616-3.668-1.848C-1.456 13.737-1.456 12.505-1.456 11.58c0-1.232.308-2.464 1.232-3.08L22.237.925c.616-.308 1.232-.308 1.763 0z"/>
              </svg>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#"
                className="text-dark-900 hover:text-dark-700 px-3 py-2 text-body font-body-medium transition-colors"
              >
                Men
              </a>
              <a
                href="#"
                className="text-dark-900 hover:text-dark-700 px-3 py-2 text-body font-body-medium transition-colors"
              >
                Women
              </a>
              <a
                href="#"
                className="text-dark-900 hover:text-dark-700 px-3 py-2 text-body font-body-medium transition-colors"
              >
                Kids
              </a>
              <a
                href="#"
                className="text-dark-900 hover:text-dark-700 px-3 py-2 text-body font-body-medium transition-colors"
              >
                Sale
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-dark-900 hover:text-dark-700 p-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-dark-900 hover:text-dark-700 p-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
              </svg>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dark-900 hover:text-dark-700 p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-light-300">
              <a
                href="#"
                className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-body font-body-medium"
              >
                Men
              </a>
              <a
                href="#"
                className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-body font-body-medium"
              >
                Women
              </a>
              <a
                href="#"
                className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-body font-body-medium"
              >
                Kids
              </a>
              <a
                href="#"
                className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-body font-body-medium"
              >
                Sale
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
