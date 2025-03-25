"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the overview page
    router.replace("/overview");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Redirecting...
        </h2>
        <p className="text-gray-600 mb-6">Taking you to the bookmark manager</p>
        <div className="animate-pulse">
          <div className="flex justify-center items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animation-delay-200"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animation-delay-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
