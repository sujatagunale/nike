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
            <h3 className="text-body-medium font-body-medium text-light-100 mb-6 uppercase tracking-wide">Featured</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Air Force 1
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Huarache
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Air Max 90
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Air Max 95
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-body-medium font-body-medium text-light-100 mb-6 uppercase tracking-wide">Shoes</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  All Shoes
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Custom Shoes
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Jordan Shoes
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Running Shoes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-body-medium font-body-medium text-light-100 mb-6 uppercase tracking-wide">Clothing</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  All Clothing
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Modest Wear
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Hoodies &amp; Pullovers
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Shirts &amp; Tops
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-body-medium font-body-medium text-light-100 mb-6 uppercase tracking-wide">Kids&apos;</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Infant &amp; Toddler Shoes
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Kids&apos; Shoes
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Kids&apos; Jordan Shoes
                </a>
              </li>
              <li>
                <a href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                  Kids&apos; Basketball Shoes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-light-100 hover:text-dark-300 transition-colors" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-light-100 hover:text-dark-300 transition-colors" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-light-100 hover:text-dark-300 transition-colors" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.404c-.315 0-.595-.122-.807-.315-.21-.21-.315-.49-.315-.807 0-.315.105-.595.315-.807.21-.21.49-.315.807-.315.315 0 .595.105.807.315.21.21.315.49.315.807 0 .315-.105.595-.315.807-.21.193-.49.315-.807.315zm-.122 1.715c-.928-.875-2.026-1.297-3.323-1.297s-2.448.49-3.323 1.297c-.928.875-1.418 2.026-1.418 3.323s.49 2.448 1.418 3.244c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.928-.796 1.418-1.947 1.418-3.244s-.49-2.448-1.418-3.323z"/>
                </svg>
              </a>
              <a href="#" className="text-light-100 hover:text-dark-300 transition-colors" aria-label="YouTube">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end mb-2">
                <svg className="h-4 w-4 text-dark-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-caption text-dark-500">Croatia</span>
              </div>
              <p className="text-caption text-dark-500 mb-1">
                © 2025 Nike, Inc. All Rights Reserved
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
