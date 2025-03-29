"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bookmark } from "../../types";
import { gsap } from "gsap";

interface BookmarkFormProps {
  editBookmark?: Bookmark;
  onSubmit: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
  onCancel?: () => void;
}

export const BookmarkForm = ({
  editBookmark,
  onSubmit,
  onCancel,
}: BookmarkFormProps) => {
  const [url, setUrl] = useState(editBookmark?.url || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successIconRef = useRef<HTMLDivElement>(null);

  // Animate form on mount
  // useEffect(() => {
  //   if (formRef.current) {
  //     const tl = gsap.timeline();

  //     tl.fromTo(
  //       formRef.current,
  //       { y: -20, opacity: 0 },
  //       { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
  //     );

  //     // Animate form elements
  //     const formElements = formRef.current.querySelectorAll(
  //       "input, button, label, .input-group"
  //     );
  //     tl.fromTo(
  //       formElements,
  //       { y: 10, opacity: 0 },
  //       { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
  //       "-=0.3"
  //     );
  //   }
  // }, []);

  // Handle edit bookmark changes
  useEffect(() => {
    if (editBookmark) {
      setUrl(editBookmark.url);

      // Highlight form when editing
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { boxShadow: "0 0 0 3px rgba(59, 130, 246, 0)" },
          {
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
            duration: 0.5,
            repeat: 1,
            yoyo: true,
          }
        );
      }
    }
  }, [editBookmark]);

  // Animate error message
  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );

      // Shake input if URL is invalid
      if (error.includes("URL") && urlInputRef.current) {
        gsap.to(urlInputRef.current, {
          x: 5,
          duration: 0.1,
          repeat: 3,
          yoyo: true,
        });
      }
    }
  }, [error]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate URL
    if (!validateUrl(url)) {
      setError("Please enter a valid URL including http:// or https://");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Animate submit button
    const submitButton = formRef.current?.querySelector(
      "button[type='submit']"
    );
    if (submitButton) {
      gsap.to(submitButton, {
        scale: 0.97,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    // Show success animation if there's no error
    if (successIconRef.current) {
      gsap.fromTo(
        successIconRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Hide after animation completes
            gsap.to(successIconRef.current, {
              opacity: 0,
              delay: 1,
              duration: 0.3,
            });
          },
        }
      );
    }

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    onSubmit({ url });
    setIsSubmitting(false);

    // Only clear the form if not editing
    if (!editBookmark) {
      setUrl("");

      // Focus back on URL input after adding
      urlInputRef.current?.focus();
    }
  };

  return (
    <>
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-2 border border-gray-100 transition-all hover:shadow-lg relative overflow-hidden"
    >
      <div
        ref={successIconRef}
        className="absolute top-4 right-4 opacity-0 pointer-events-none"
      >
        <div className="bg-green-100 text-green-500 p-2 rounded-full">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-600 mb-4 text-center">
        <p>Add Bookmark</p>
      </h2>

      
      <div className="space-y-5">
        <div className="input-group flex items-center gap-2">
            <input
              ref={urlInputRef}
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-6 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 bg-gray-50 hover:bg-white focus:bg-white"
              required
            />
            <div className="flex justify-between">
              {editBookmark && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cancel
              </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`p-3 flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center`}
          >
            {isSubmitting ? (
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
            ) :  (
              <svg
                className="w-5 h-5 "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
          </button>
        </div>
      </div>
      </div>
    </form>

    {error && (
        <div
          ref={errorRef}
          className="bg-yellow-50 border-1 text-sm border-yellow-400 text-yellow-700 pl-4 py-2 rounded-md mb-2 flex items-center"
        >
          <svg
            className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

    <div className="bg-orange-400 px-6 py-1 rounded-md w-fit">
      arrow
    </div>
    </>

  );
};
