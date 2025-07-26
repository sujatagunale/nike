import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-light-100">
      <Navbar />
      
      <section className="relative bg-light-100 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-body text-dark-700 uppercase tracking-wide">
                  Men&apos;s Shoe
                </p>
                <h1 className="text-heading-1 lg:text-5xl xl:text-6xl font-jost font-bold leading-tight text-dark-900">
                  New Jordan 6 Rings
                </h1>
                <p className="text-body text-dark-700 max-w-md">
                  The Jordan 6 Rings Men&apos;s Shoe celebrates a legendary career with classic design lines and detailing for streamlined hoops style.
                </p>
              </div>
              <button className="bg-dark-900 text-light-100 px-8 py-3 text-body-medium font-body-medium hover:bg-dark-700 transition-colors">
                Go to collection
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 transform rotate-12 rounded-3xl opacity-20"></div>
              <div className="relative text-right">
                <h2 className="text-heading-1 lg:text-8xl xl:text-9xl font-jost font-bold text-yellow-500 opacity-80">
                  AIR
                </h2>
                <h2 className="text-heading-1 lg:text-6xl xl:text-7xl font-jost font-bold -mt-8 text-dark-900">
                  JORDAN
                </h2>
                <p className="text-body-medium text-yellow-600 font-body-medium mt-2">
                  6 RINGS
                </p>
              </div>
              <div className="mt-8 aspect-square bg-light-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-heading-3 font-jost font-bold text-dark-500 mb-2">
                    JORDAN
                  </div>
                  <div className="text-body text-dark-700">6 Rings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-light-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-heading-2 font-jost font-bold text-dark-900">
              Top Picks
            </h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-light-200 hover:bg-light-300 transition-colors">
                <svg className="h-5 w-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-light-200 hover:bg-light-300 transition-colors">
                <svg className="h-5 w-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-light-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-light-300 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-heading-3 font-jost font-bold text-dark-500 mb-2">
                    NIKE
                  </div>
                  <div className="text-body text-dark-700">Kyrie 5</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-body-medium font-body-medium text-dark-900 mb-1">
                  Kyrie 5 x Friends
                </h3>
                <p className="text-body text-dark-700 mb-2">£184.95</p>
              </div>
            </div>

            <div className="bg-light-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-blue-100 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-heading-3 font-jost font-bold text-dark-500 mb-2">
                    NIKE
                  </div>
                  <div className="text-body text-dark-700">Air Max 720</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-body-medium font-body-medium text-dark-900 mb-1">
                  Nike Air Max 720
                </h3>
                <p className="text-body text-dark-700 mb-2">£164.95</p>
              </div>
            </div>

            <div className="bg-light-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-red-100 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-heading-3 font-jost font-bold text-dark-500 mb-2">
                    NIKE
                  </div>
                  <div className="text-body text-dark-700">Zoom Pegasus</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-body-medium font-body-medium text-dark-900 mb-1">
                  Nike Zoom Pegasus 35 Turbo BRS
                </h3>
                <p className="text-body text-dark-700 mb-2">£139.95</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-light-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-heading-2 font-jost font-bold text-dark-900 mb-12">
            Trending Now
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-3xl p-8 lg:p-12 text-light-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-heading-2 font-jost font-bold mb-4">
                  REACT PRESTO
                </h3>
                <p className="text-body mb-6">
                  Nike React foam is the Nike React Presto&apos;s magic.
                </p>
                <button className="bg-dark-900 text-light-100 px-6 py-2 text-body-medium font-body-medium hover:bg-dark-700 transition-colors">
                  Shop
                </button>
              </div>
              <div className="absolute right-4 bottom-4 w-32 h-32 bg-light-200 rounded-xl opacity-20"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl p-6 text-light-100 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-body-large font-body-medium mb-2">
                    Summer Must-Haves:
                  </h4>
                  <h3 className="text-heading-3 font-jost font-bold">
                    Air Max Dia
                  </h3>
                </div>
                <div className="absolute right-2 bottom-2 w-16 h-16 bg-light-200 rounded-lg opacity-20"></div>
              </div>

              <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-6 text-light-100 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-heading-3 font-jost font-bold mb-2">
                    Air Jordan 11 Retro Low LE
                  </h3>
                </div>
                <div className="absolute right-2 bottom-2 w-16 h-16 bg-light-200 rounded-lg opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-light-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-yellow-400 to-orange-500 transform skew-x-12 origin-top-right"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-body text-dark-700 uppercase tracking-wide">
                Create your design
              </p>
              <h2 className="text-heading-1 lg:text-5xl font-jost font-bold text-dark-900">
                NIKE REACT PRESTO BY YOU
              </h2>
              <p className="text-body text-dark-700 max-w-md">
                Take advantage of brand new, proprietary cushioning technology with a fresh pair of Nike React shoes.
              </p>
              <button className="bg-dark-900 text-light-100 px-8 py-3 text-body-medium font-body-medium hover:bg-dark-700 transition-colors">
                Create
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-light-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-heading-3 font-jost font-bold text-dark-500 mb-2">
                    NIKE
                  </div>
                  <div className="text-body text-dark-700">React Presto</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
