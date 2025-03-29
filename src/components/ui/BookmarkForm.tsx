"use client";

import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { Bookmark } from "../../types";
import { gsap } from "gsap";
import { ArrowBigDown, Ban, ChevronDown, Loader, Send } from "lucide-react";
import { arrowShowForm } from "@/utils/animations";

interface BookmarkFormProps {
  editBookmark?: Bookmark;
  onSubmit: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
  onCancel?: () => void;
}

export const BookmarkForm = ({ editBookmark, onSubmit }: BookmarkFormProps) => {
  const [url, setUrl] = useState(editBookmark?.url || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const arrowDownRef = useRef<SVGSVGElement | null>(null);
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

  // Animate arrow form
  useEffect(() => {
    if (arrowDownRef.current) {
      arrowShowForm(arrowDownRef.current);
    }
  }, []);

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
    <div className="max-w-[500px] m-auto flex flex-col justify-center">
      <div className="">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white p-2 rounded-lg shadow-md mb-2 border border-gray-100 transition-all hover:shadow-lg relative overflow-hidden"
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`h-[46px] w-[46px] bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center cursor-pointer`}
                >
                  {isSubmitting ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Send size={19} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {error && (
          <div
            ref={errorRef}
            className="bg-yellow-50 border-1 text-sm border-yellow-400 text-yellow-700 pl-4 py-2 gap-2 rounded-md mb-2 flex items-center"
          >
            <Ban size={18} />
            <span>{error}</span>
          </div>
        )}
        <div className="relative w-20 h-8 cursor-pointer m-auto">
          <ChevronDown
            ref={arrowDownRef}
            size={35}
            strokeWidth={2.5}
            color="orange"
            className="arrowShowForm absolute inset-0 m-auto"
          />
        </div>
      </div>
    </div>
  );
};
