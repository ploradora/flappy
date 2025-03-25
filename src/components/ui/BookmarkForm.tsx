"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bookmark } from "../../types";
import { gsap } from "gsap";
import {
  Plus,
  Link2,
  CheckCircle,
  AlertCircle,
  Globe,
  MessageSquare,
  X,
  Check,
  Loader2,
  FileEdit,
} from "lucide-react";

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
  const [title, setTitle] = useState(editBookmark?.title || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successIconRef = useRef<HTMLDivElement>(null);

  // Animate form on mount
  useEffect(() => {
    if (formRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        formRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );

      // Animate form elements
      const formElements = formRef.current.querySelectorAll(
        "input, button, label, .input-group"
      );
      tl.fromTo(
        formElements,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
        "-=0.3"
      );
    }
  }, []);

  // Handle edit bookmark changes
  useEffect(() => {
    if (editBookmark) {
      setUrl(editBookmark.url);
      setTitle(editBookmark.title);

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

    if (!title.trim()) {
      setError("Title is required");
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

    onSubmit({ url, title, description: "" });
    setIsSubmitting(false);

    // Only clear the form if not editing
    if (!editBookmark) {
      setUrl("");
      setTitle("");

      // Focus back on URL input after adding
      urlInputRef.current?.focus();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100 transition-all hover:shadow-lg relative overflow-hidden"
    >
      <div
        ref={successIconRef}
        className="absolute top-4 right-4 opacity-0 pointer-events-none"
      >
        <div className="bg-green-100 text-green-500 p-2 rounded-full">
          <Check className="w-5 h-5" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-blue-600 flex items-center">
        {editBookmark ? (
          <>
            <FileEdit className="h-5 w-5 mr-2" />
            Edit Bookmark
          </>
        ) : (
          <>
            <Plus className="h-5 w-5 mr-2" />
            Add Bookmark
          </>
        )}
      </h2>

      {error && (
        <div
          ref={errorRef}
          className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded mb-6 flex items-start"
        >
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-5">
        <div className="input-group">
          <label
            htmlFor="url"
            className="block text-gray-700 font-medium mb-2 text-sm flex items-center"
          >
            <Link2 className="h-4 w-4 mr-1 text-blue-500" />
            URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={urlInputRef}
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 bg-gray-50 hover:bg-white focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2 text-sm flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
            Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Website Title"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 bg-gray-50 hover:bg-white focus:bg-white"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium shadow-sm"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-1.5" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center px-5 py-2.5 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 hover:shadow transition-all ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          } text-sm font-medium`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2 text-white" />
              {editBookmark ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              {editBookmark ? "Update" : "Add"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};
