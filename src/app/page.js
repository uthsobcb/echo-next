import Image from "next/image";
import LandingPage from "@/app/landing/landing"
export default function Home() {
  return (
    <LandingPage />
    // <div className="flex items-center justify-center min-h-screen">
    //   <div className="text-center">
    //     <h1 className="text-4xl font-bold text-gray-800 mb-4">
    //       Coming Soon
    //     </h1>
    //     <p className="text-gray-600 mb-8">
    //       We're working hard to bring you something amazing. Stay tuned!
    //     </p>
    //     <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
    //       <input
    //         type="email"
    //         placeholder="Enter your email"
    //         className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none w-64"
    //       />
    //       <button
    //         type="submit"
    //         className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-300"
    //       >
    //         Notify Me
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
}
