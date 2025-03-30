"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { CheckIcon } from "lucide-react";
import { getBookmarks } from "@/app/actions";

export const ResultsContent = () => {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [lastSubmission, setLastSubmission] = useState("");

  useEffect(() => {
    const modifyAllLinks = [...getBookmarks()].sort(
      (a, b) => b.createdAt - a.createdAt
    )[0];

    const latestLink = {
      ...modifyAllLinks,
      formatted: new Date(modifyAllLinks.createdAt).toLocaleString(),
    };

    setLastSubmission(latestLink.url);
  }, []);

  useEffect(() => {
    // Run animations after component mounts
    const animateContent = () => {
      // Main timeline
      const tl = gsap.timeline();

      // Initial slide up animation for the card
      if (cardRef.current) {
        tl.fromTo(
          cardRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
        );
      }

      // Checkmark animation
      if (iconRef.current) {
        tl.fromTo(
          iconRef.current,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        );

        // Additional pulse animation for the icon
        gsap.to(iconRef.current, {
          scale: 1.05,
          repeat: 1,
          yoyo: true,
          duration: 1,
          delay: 1,
          ease: "power1.inOut",
        });
      }

      // Animate the details card with a slight delay
      if (detailsRef.current) {
        tl.fromTo(
          detailsRef.current,
          { y: -5, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=1"
        );
      }
    };

    // Run animations
    animateContent();
  }, [searchParams]);

  return (
    <div
      ref={contentRef}
      className="min-h-full flex items-center justify-center px-2 py-6 bg-gray-100"
    >
      <div ref={cardRef} className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Header section with icon */}
          <div className="bg-blue-500 text-white py-8 text-center relative ">
            <div
              ref={iconRef}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mt-1"
            >
              <svg
                className="w-6 h-6 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <CheckIcon className="w-3.5 h-3.5" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mt-6 mb-2">Thank You!</h1>
          </div>

          {/* Submission details */}
          <div ref={detailsRef} className="px-4 py-6">
            <p className="text-gray-600 text-center">
              Your latest submission was:
            </p>
            <Link
              href={lastSubmission}
              target="_blank"
              className="block text-center text-gray-600 font-bold text-xl pt-2 mb-6 truncate max-w-full overflow-hidden whitespace-nowrap"
            >
              {lastSubmission}
            </Link>
            <div className="text-center">
              <Link
                href="/overview"
                className="overview-link inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Back to Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
