"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { getBookmarks } from "@/app/actions";
import { Ban } from "lucide-react";
import { BookmarksSubmitList, URL_CHECK_EVENT } from "./BookmarksSubmitList";

export const SubmitContent = () => {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const congratsRef = useRef<HTMLDivElement>(null);

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

  // Animate congratulations message when it appears
  useEffect(() => {
    if (showCongrats && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(0.5)",
          onComplete: () => {
            // Auto-hide the success message after 5 seconds
            gsap.to(successRef.current, {
              opacity: 0,
              y: 10,
              delay: 2,
              duration: 0.5,
              onComplete: () => setShowCongrats(false),
            });
          },
        }
      );
    }
  }, [showCongrats]);

  const handleClearInput = () => {
    setUrl("");
    setError("");

    // Reset highlighting by dispatching event with empty URL
    window.dispatchEvent(
      new CustomEvent(URL_CHECK_EVENT, {
        detail: { url: "" },
      })
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Normalize the URL for better comparison
    const normalizedUrl = url.toLowerCase().trim();

    const allBookmarks = getBookmarks();
    const checkUrl = allBookmarks.some((bookmark) => {
      // Normalize bookmark URL for comparison
      const bookmarkUrl = bookmark.url.toLowerCase();
      return (
        bookmarkUrl.includes(normalizedUrl) ||
        normalizedUrl.includes(bookmarkUrl)
      );
    });

    // Dispatch custom event for URL submission
    window.dispatchEvent(
      new CustomEvent(URL_CHECK_EVENT, {
        detail: { url: normalizedUrl },
      })
    );

    if (checkUrl) {
      setShowCongrats(true);
      setError("");
      return;
    }

    setError("URL not found in your bookmarks");
  };

  return (
    <div className="flex w-full h-full">
      <BookmarksSubmitList />

      <div className="flex-1 grid place-items-center bg-white">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Check Your URL
          </h1>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-100 w-[350px]"
          >
            <div className="mb-4">
              <input
                ref={inputRef}
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-2"
                disabled={isSubmitting}
              />
              {error && (
                <div
                  ref={errorRef}
                  className="bg-yellow-50 border-1 text-sm border-yellow-400 text-yellow-700 pl-4 py-2 gap-2 rounded-md mb-2 flex items-center"
                >
                  <Ban size={18} />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearInput}
                className="flex-1 px-5 py-2 border border-gray-200 text-gray-500 rounded-md hover:bg-gray-100 text-sm cursor-pointer"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all border border-glue-500 cursor-pointer ${
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
      </div>

      {/* Congrats Message */}
      {showCongrats && (
        <div
          ref={successRef}
          className="fixed bottom-8 right-8 bg-green-100 text-green-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 border border-green-200"
        >
          <div className="h-8 w-8 rounded-full bg-green-500 text-white grid place-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium">Success!</div>
            <div className="text-sm">URL found in your bookmarks</div>
          </div>
        </div>
      )}
    </div>
  );
};
