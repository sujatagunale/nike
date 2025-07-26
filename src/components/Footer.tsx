export default function Footer() {
  return (
    <footer className="bg-dark-900 text-light-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-8">
              <svg
                className="h-12 w-12 text-light-100"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.456 0-2.525-.616-3.668-1.848C-1.456 13.737-1.456 12.505-1.456 11.58c0-1.232.308-2.464 1.232-3.08L22.237.925c.616-.308 1.232-.308 1.763 0z"/>
              </svg>
            </div>
          </div>

          <div>
            <h3 className="text-body-medium font-body-medium text-light-100 mb-6 uppercase tracking-wide">Info</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Find a Store
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Become a Member
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Sign Up for Email
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Send Us Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Student Discounts
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-body-medium font-body-medium text-light-100 mb-6 uppercase tracking-wide">Shop</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Men&apos;s
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Women&apos;s
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Kids&apos;
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Shoes
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Clothing
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-body-medium font-body-medium text-light-100 mb-6 uppercase tracking-wide">About</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Investors
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-light-100 hover:text-dark-300 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </a>
              <a href="#" className="text-light-100 hover:text-dark-300 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </a>
              <a href="#" className="text-light-100 hover:text-dark-300 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </a>
              <a href="#" className="text-light-100 hover:text-dark-300 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-caption text-dark-500 mb-1">
                © 2024 Nike, Inc. All Rights Reserved
              </p>
              <div className="flex flex-wrap justify-center md:justify-end space-x-4 text-caption text-dark-500">
                <a href="#" className="hover:text-light-100 transition-colors">Guides</a>
                <a href="#" className="hover:text-light-100 transition-colors">Terms of Sale</a>
                <a href="#" className="hover:text-light-100 transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-light-100 transition-colors">Nike Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
