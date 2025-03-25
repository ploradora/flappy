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
  const [title, setTitle] = useState(editBookmark?.title || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Animate form on mount
  useEffect(() => {
    if (formRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        formRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );

      // Animate form elements
      const formElements = formRef.current.querySelectorAll(
        "input, button, label"
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
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
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
        { opacity: 1, y: 0, duration: 0.3 }
      );

      // Shake input if URL is invalid
      if (error.includes("URL") && urlInputRef.current) {
        gsap.to(urlInputRef.current, {
          x: 5,
          duration: 0.1,
          repeat: 5,
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
        scale: 0.95,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
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
      className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100 transition-all hover:shadow-lg"
    >
      <h2 className="text-xl font-bold mb-6 text-blue-600">
        {editBookmark ? "Edit Bookmark" : "Add Bookmark"}
      </h2>

      {error && (
        <div
          ref={errorRef}
          className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="url"
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            URL
          </label>
          <input
            ref={urlInputRef}
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Website Title"
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          } text-sm font-medium`}
        >
          {isSubmitting
            ? editBookmark
              ? "Updating..."
              : "Adding..."
            : editBookmark
            ? "Update"
            : "Add"}
        </button>
      </div>
    </form>
  );
};
