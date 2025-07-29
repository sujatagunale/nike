import { Jost } from "next/font/google";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${jost.className} min-h-screen flex`}>
      <div className="hidden lg:flex lg:w-1/2 bg-dark-900 text-light-100 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-light-100"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <h1 className="font-jost text-heading-2 font-bold mb-4">
            One Platform to Streamline
            <br />
            All Product Analytics
          </h1>
          <p className="font-jost text-body text-dark-500 mb-8">
            Your revenue are set to grow by 20% next month. Your revenue
            is increase by next month with our campaign tools.
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-light-100 rounded-full"></div>
            <div className="w-2 h-2 bg-dark-500 rounded-full"></div>
            <div className="w-2 h-2 bg-dark-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-light-100 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
