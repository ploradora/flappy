"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { getBookmarks } from "@/app/actions";

export const SubmitContent = () => {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationResult, setValidationResult] = useState("");

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animate form on mount
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  // Validate URL
  const validateUrl = (urlToCheck: string): boolean => {
    try {
      new URL(urlToCheck);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Check if URL already exists in bookmarks
  const urlAlreadyExists = (urlToCheck: string): boolean => {
    const bookmarks = getBookmarks();
    return bookmarks.some(
      (bookmark) => bookmark.url.toLowerCase() === urlToCheck.toLowerCase()
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setValidationResult("");

    if (!url) {
      setError("Please enter a URL");
      shakeElement(inputRef.current);
      return;
    }

    // Add http:// if missing
    let formattedUrl = url;
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
      setUrl(formattedUrl);
    }

    setIsSubmitting(true);

    // Validate URL
    if (!validateUrl(formattedUrl)) {
      setError("Please enter a valid URL");
      setIsSubmitting(false);
      shakeElement(inputRef.current);
      return;
    }

    // Check if URL already exists
    const exists = urlAlreadyExists(formattedUrl);

    try {
      // Determine the result of validation
      if (exists) {
        setValidationResult(`Found it! This URL is saved in your list.`);
      } else {
        setValidationResult(
          `Looks like this URL isn’t on your list. Want to double-check it?`
        );
      }

      // Show success animation regardless
      setSuccess(true);

      // Animate success and the result message
      if (successRef.current) {
        gsap.fromTo(
          successRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          }
        );
      }
    } catch (e) {
      setError("An error occurred. Please try again.");
      shakeElement(errorRef.current);
    }

    setIsSubmitting(false);
  };

  // Animation for error shake
  const shakeElement = (element: HTMLElement | null) => {
    if (!element) return;

    gsap.fromTo(
      element,
      { x: 0 },
      {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
      }
    );

    // Also animate in the error message if it exists
    if (errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  };

  if (success) {
    const isExisting = validationResult.includes("already exists");

    return (
      <div
        ref={successRef}
        className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md text-center"
      >
        <div
          className={`mb-4 ${isExisting ? "text-blue-500" : "text-green-500"}`}
        >
          {isExisting ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">URL Validated</h2>
        <p className="text-gray-600 mb-6">{validationResult}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push("/overview")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            View All URLs
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setUrl("");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Check Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        <span className="text-blue-600">Check</span> Your URL
      </h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
      >
        {error && (
          <div
            ref={errorRef}
            className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded mb-6 text-sm"
          >
            {error}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="url"
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            Enter URL
          </label>
          <input
            ref={inputRef}
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push("/overview")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            } text-sm font-medium`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Checking...
              </span>
            ) : (
              "Check URL"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
