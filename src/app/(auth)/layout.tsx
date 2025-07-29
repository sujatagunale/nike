import { Jost } from "next/font/google";
import Image from "next/image";

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
        <div className="max-w-lg text-center">
          <div className="mb-8 flex justify-center">
            <Image src="/logo.svg" alt="logo" width={124} height={124} />
          </div>
          <h1 className="font-jost text-heading-2 font-bold mb-4">
            Move with Purpose <br /> Move with Nike
          </h1>
          <p className="font-jost text-body text-dark-500 mb-8">
            Get the gear, the goals, and the support to push forward. <br />
            This is your first step.
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-light-100 rounded-full"></div>
            <div className="w-2 h-2 bg-dark-500 rounded-full"></div>
            <div className="w-2 h-2 bg-dark-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-light-100 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
