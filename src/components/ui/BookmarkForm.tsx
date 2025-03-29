"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bookmark } from "../../types";
import { gsap } from "gsap";
import { Ban, ChevronDown, Loader, Send } from "lucide-react";
import { arrowShowForm } from "@/utils/animations";
import { addBookmark } from "@/app/actions";
import { NavButtons } from "./NavButtons";

interface BookmarkFormProps {
  onSubmit: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
}

export const BookmarkForm = ({ onSubmit }: BookmarkFormProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const arrowDownRef = useRef<SVGSVGElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successIconRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!hasMounted && formRef.current) {
      gsap.set(formRef.current, { opacity: 0, display: "none" });
      setHasMounted(true);
    }
  }, [hasMounted]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // const handleToggleForm = () => {
  //   setIsOpen(!isOpen);
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
            gsap.to(successIconRef.current, {
              opacity: 0,
              delay: 1,
              duration: 0.3,
            });
          },
        }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Let the parent component handle the actual bookmark addition
    onSubmit({ url });
    setIsSubmitting(false);
    setUrl("");
    urlInputRef.current?.focus();
  };

  return (
    <div className="max-w-[450px] m-auto flex flex-col justify-center">
      <div>
        <form
          // ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white p-2 rounded-lg shadow-md mb-2 border border-gray-100 transition-all hover:shadow-lg relative overflow-hidden"
        >
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
        <div
          className="relative w-20 h-8 cursor-pointer m-auto"
          // onClick={handleToggleForm}
        >
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
