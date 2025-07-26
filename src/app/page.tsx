import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-light-100">
      <Navbar />
      
      <section className="relative bg-gradient-to-br from-orange to-red overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-body-medium font-body-medium text-light-100 mb-4">
                Just Do It
              </p>
              <h1 className="text-heading-3 md:text-heading-2 lg:text-heading-1 font-heading-1 text-light-100 mb-6">
                Style That Moves
                <br />
                With You.
              </h1>
              <p className="text-lead font-lead text-light-100/90 mb-8 max-w-lg mx-auto lg:mx-0">
                Get your style, find your comfort. Embrace what differentiates you from the rest.
              </p>
              <button className="bg-light-100 text-dark-900 px-8 py-3 rounded-full text-body-medium font-body-medium hover:bg-light-200 transition-colors">
                Shop Now
              </button>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-orange/20 to-red/20 rounded-2xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-6xl lg:text-8xl font-bold text-light-100/20">
                    AIR
                  </div>
                  <div className="text-4xl lg:text-6xl font-bold text-light-100 -mt-4">
                    JORDAN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-heading-3 md:text-heading-2 font-heading-2 text-dark-900 mb-4">
              Best of the Best
            </h2>
            <p className="text-lead font-lead text-dark-700 max-w-2xl mx-auto">
              Discover our most popular products that combine style, comfort, and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="relative bg-light-200 rounded-2xl p-8 mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-light-300 to-light-200"></div>
                <div className="relative text-center">
                  <div className="text-4xl font-bold text-dark-500 mb-2">NIKE</div>
                  <div className="text-lg text-dark-700">Air Max 270</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-body-medium font-body-medium text-dark-900 mb-1">
                  Nike Air Max 270
                </h3>
                <p className="text-body text-dark-700 mb-2">Men&apos;s Shoes</p>
                <p className="text-body-medium font-body-medium text-dark-900">$150</p>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative bg-light-200 rounded-2xl p-8 mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green/20 to-light-200"></div>
                <div className="relative text-center">
                  <div className="text-4xl font-bold text-dark-500 mb-2">NIKE</div>
                  <div className="text-lg text-dark-700">React Infinity</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-body-medium font-body-medium text-dark-900 mb-1">
                  Nike React Infinity Run
                </h3>
                <p className="text-body text-dark-700 mb-2">Men&apos;s Running Shoe</p>
                <p className="text-body-medium font-body-medium text-dark-900">$160</p>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative bg-light-200 rounded-2xl p-8 mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/20 to-light-200"></div>
                <div className="relative text-center">
                  <div className="text-4xl font-bold text-dark-500 mb-2">NIKE</div>
                  <div className="text-lg text-dark-700">Air Force 1</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-body-medium font-body-medium text-dark-900 mb-1">
                  Nike Air Force 1 &apos;07
                </h3>
                <p className="text-body text-dark-700 mb-2">Men&apos;s Shoe</p>
                <p className="text-body-medium font-body-medium text-dark-900">$90</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-900 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-red to-orange rounded-2xl p-8 lg:p-12">
                <div className="text-center text-light-100">
                  <div className="text-6xl lg:text-8xl font-bold mb-4">REACT</div>
                  <div className="text-2xl lg:text-3xl font-medium">PRESTO</div>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-heading-3 md:text-heading-2 font-heading-2 text-light-100 mb-6">
                NIKE REACT
                <br />
                PRESTO BY YOU
              </h2>
              <p className="text-lead font-lead text-dark-500 mb-8">
                Customize your own pair with our exclusive design tools. Make it uniquely yours with colors and patterns that match your style.
              </p>
              <button className="bg-light-100 text-dark-900 px-8 py-3 rounded-full text-body-medium font-body-medium hover:bg-light-200 transition-colors">
                Customize
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
