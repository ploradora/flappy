"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowLeft, CheckCircle } from "lucide-react";

export const ResultsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [submissionData, setSubmissionData] = useState({
    url: "",
    title: "",
  });

  useEffect(() => {
    // Get URL parameters if available
    const url = searchParams.get("url") || "";
    const title = searchParams.get("title") || "";

    setSubmissionData({ url, title });

    // Run animations after component mounts
    const animateContent = () => {
      // Main timeline
      const tl = gsap.timeline();

      // Initial slide up animation for the card
      if (cardRef.current) {
        tl.fromTo(
          cardRef.current,
          { y: 50, opacity: 0 },
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
          "-=0.3"
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
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );
      }

      // Animate the link with a bounce effect
      const link = contentRef.current?.querySelector(".overview-link");
      if (link) {
        tl.fromTo(
          link,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.1"
        );
      }
    };

    // Run animations
    animateContent();
  }, [searchParams]);

  return (
    <div
      ref={contentRef}
      className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white"
    >
      <div ref={cardRef} className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
          {/* Header section with icon */}
          <div className="bg-blue-500 text-white px-8 py-10 text-center relative">
            <h1 className="text-3xl font-bold mt-6 mb-2">Thank You!</h1>
            <p className="text-blue-100 text-lg">
              Your submission has been received successfully
            </p>
          </div>

          {/* Submission details */}
          <div className="px-8 py-8">
            <div className="text-center">
              <Link
                href="/overview"
                className="overview-link inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Overview
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Thank you for using our bookmark manager. We've received your
          submission.
        </p>
      </div>
    </div>
  );
};
