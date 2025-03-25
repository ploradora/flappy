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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We're redirecting you to the bookmark manager in a few seconds.
        </p>
        <div className="flex justify-center space-x-3 mb-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.replace("/overview")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go to homepage
          </button>
        </div>
        <div className="animate-pulse flex justify-center mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full mx-1"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full mx-1 animation-delay-200"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full mx-1 animation-delay-500"></div>
        </div>
      </div>
    </div>
  );
}
