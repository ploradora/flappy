"use client";

import { getBookmarks } from "@/app/actions";
import { Globe, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Bookmark } from "@/types";

// Client component to avoid hydration issues
export const BookmarksSubmitList = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");

  // Get bookmarks on client side only
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  // Monitor current URL for highlighting
  useEffect(() => {
    const updateCurrentUrl = () => {
      // Get the last part of a URL path for simpler matching
      const urlInput = document.getElementById("url") as HTMLInputElement;
      if (urlInput) {
        setCurrentUrl(urlInput.value);
      }
    };

    // Initial check
    updateCurrentUrl();

    // Check on input changes in the bookmark form
    const urlInput = document.getElementById("url") as HTMLInputElement;
    if (urlInput) {
      urlInput.addEventListener("input", updateCurrentUrl);
      return () => urlInput.removeEventListener("input", updateCurrentUrl);
    }
  }, []);

  // Format date in a consistent way to avoid hydration issues
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Unknown date";

    // Use fixed date format that won't change between server/client
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Determine if a bookmark matches the current URL input
  const isActiveBookmark = (bookmarkUrl: string) => {
    if (!currentUrl || !bookmarkUrl) return false;
    return bookmarkUrl.includes(currentUrl) || currentUrl.includes(bookmarkUrl);
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
                  className={`w-full p-4 transition-colors cursor-pointer ${
                    isActive
                      ? "bg-bookmark-active"
                      : currentUrl
                      ? "bg-bookmark-inactive"
                      : "bg-orange-200 hover:bg-orange-100"
                  }`}
                >
                  <p className="text-sm text-gray-500 truncate mb-2">
                    {bookmark.url}
                  </p>

                  <div className="flex items-center text-xs text-gray-400">
                    <Clock size={14} className="mr-1" />
                    {formatDate(bookmark.createdAt)}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
