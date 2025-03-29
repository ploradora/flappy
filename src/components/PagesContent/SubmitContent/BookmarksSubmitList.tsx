"use client";

import { getBookmarks } from "@/app/actions";
import { Globe, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Bookmark } from "@/types";

// Create a custom event for URL check submission
export const URL_CHECK_EVENT = "url-check-submission";

// Client component to avoid hydration issues
export const BookmarksSubmitList = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [submittedUrl, setSubmittedUrl] = useState(""); // Track submitted URL separately

  // Get bookmarks on client side only
  useEffect(() => {
    // Create function to get latest bookmarks
    const refreshBookmarks = () => {
      setBookmarks(getBookmarks());
    };

    // Initial load
    refreshBookmarks();

  }, []);

  // Listen for URL submission events instead of tracking input directly
  useEffect(() => {
    const handleUrlSubmission = (e: CustomEvent) => {
      setSubmittedUrl(e.detail.url);
    };

    // Add event listener with type assertion
    window.addEventListener(
      URL_CHECK_EVENT,
      handleUrlSubmission as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        URL_CHECK_EVENT,
        handleUrlSubmission as EventListener
      );
    };
  }, []);

  // Determine if a bookmark matches the submitted URL
  const isActiveBookmark = (bookmarkUrl: string) => {
    if (!submittedUrl || !bookmarkUrl) return false;

    // Normalize URLs for comparison (remove http/https, lowercase)
    const normalizedInput = submittedUrl
      .toLowerCase()
      .replace(/^https?:\/\//, "");
    const normalizedBookmark = bookmarkUrl
      .toLowerCase()
      .replace(/^https?:\/\//, "");

    return (
      normalizedBookmark.includes(normalizedInput) ||
      normalizedInput.includes(normalizedBookmark)
    );
  };

  return (
    <div className="flex-1 border-r h-[calc(100vh_-_52px)] bg-white border-gray-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Globe size={18} className="text-blue-500" />
          Your Have
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {bookmarks.length}
          </span>
          Bookmarks
        </h2>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-xs">
            <p className="text-gray-500 mb-2">
              You don't have any bookmarks yet
            </p>
            <p className="text-sm text-gray-400">
              Add your first bookmark from the Overview page
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="flex flex-col gap-1 p-4 w-full">
            {bookmarks.map((bookmark) => {
              const isActive = isActiveBookmark(bookmark.url);
              return (
                <Link
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full p-4 transition-colors cursor-pointer rounded-md ${
                    isActive
                      ? "bg-green-200"
                      : submittedUrl
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-orange-200 hover:bg-orange-100"
                  }`}
                >
                  <p className="text-sm text-gray-500 truncate">
                    {bookmark.url}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};