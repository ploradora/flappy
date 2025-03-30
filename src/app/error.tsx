"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error
    console.error("Application error:", error);

    // Auto-redirect to overview page after 3 seconds
    const redirectTimeout = setTimeout(() => {
      router.replace("/overview");
    }, 3000);

    return () => clearTimeout(redirectTimeout);
  }, [error, router]);

  return (
    <div className="relative min-h-screen bg-zinc-800 px-4">
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center p-8 max-w-md bg-zinc-900 rounded-lg shadow-md border border-orange-900">
        <h2 className="text-2xl font-bold mb-2 text-gray-100">
          Something went wrong
        </h2>
        <p className="text-gray-300 text-sm mb-6 w-[300px] mx-auto">
          We're redirecting you to the bookmark manager in a few seconds.
        </p>
        <div className="flex justify-center space-x-3 mb-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-zinc-500 text-white rounded-md mb-3 hover:bg-orange-500 transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
        <div className="animate-pulse flex justify-center mt-8">
          <div className="w-2 h-2 bg-orange-500 rounded-full mx-1"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full mx-1 animation-delay-200"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full mx-1 animation-delay-500"></div>
        </div>
      </div>
    </div>
  );
}
