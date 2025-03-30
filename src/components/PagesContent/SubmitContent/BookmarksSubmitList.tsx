"use client";

import { getBookmarks } from "@/app/actions";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Bookmark } from "@/types";
import { ArrowLeft, LoaderCircle } from "lucide-react";
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

    const highlightBookmark = bookmarkUrl === submittedUrl;
    return highlightBookmark;
  };

  return (
    <div className="flex-1 border-r h-[calc(100vh_-_52px)] bg-zinc-800 border-zinc-800 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2 ml-6">
            Your Have {bookmarks.length} Bookmarks
          </h2>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-xs">
            <LoaderCircle className="animate-spin text-gray-100" />
          </div>
        </div>
      ) : (
        <div className="relative flex-1 overflow-y-auto scrollbar-thin">
          <div className="flex flex-col gap-1 p-4 w-full">
            {bookmarks.map((bookmark) => {
              const isActive = isActiveBookmark(bookmark.url);
              return (
                <Link
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-[52px] w-full p-4 transition-colors cursor-pointer rounded-md z-20 group ${
                    isActive
                      ? "bg-green-700 text-white hover:bg-green-800"
                      : submittedUrl
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-100 hover:bg-orange-400"
                  }`}
                >
                  <p className={`text-xl font-bold tracking-tighter text-gray-500 truncate group-hover:text-gray-800 ${isActive ? "text-white group-hover:text-white" : submittedUrl ? "text-gray-100 group-hover:text-gray-800" : ""}`}>
                    {bookmark.url}
                  </p>
                </Link>
              );
            })}
          </div>
          <div className="absolute inset-0 z-0 flex flex-col w-full gap-1 pointer-events-none p-4 overflow-y-auto">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`grid-bg-${i}`}
                className="border-2 border-dashed border-zinc-700 rounded-md h-[52px] shrink-0"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
