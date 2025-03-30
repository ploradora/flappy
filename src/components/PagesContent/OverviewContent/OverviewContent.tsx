"use client";

import { BookmarkForm } from "@/components/ui/BookmarkForm";
import { BookmarksList } from "@/components/ui/BookmarksList";
import { Bookmark } from "@/types";
import { useEffect, useState, useRef, useMemo } from "react";
import { pageTransition, showSuccessMessage } from "@/utils/animations";
import { getBookmarks, addBookmark } from "@/app/actions";

export const OverviewContent = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const successIndicatorRef = useRef<HTMLDivElement>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const storedBookmarks = getBookmarks();
    setBookmarks(storedBookmarks);

    // Initialize page animations
    if (pageRef.current) {
      pageTransition(pageRef.current);
    }
  }, []);

  // Sort bookmarks by createdAt timestamp (newest first)
  const sortedBookmarks = useMemo(() => {
    return [...bookmarks].sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });
  }, [bookmarks]);

  // Handle adding a new bookmark
  const handleAddBookmark = ({ url }: Omit<Bookmark, "id" | "createdAt">) => {
    const newBookmark = addBookmark({ url });

    // Update local state with the new bookmark
    setBookmarks((prevBookmarks) => {
      // Check if bookmark already exists in state
      if (
        prevBookmarks.some(
          (bookmark) => bookmark.url.toLowerCase() === url.toLowerCase()
        )
      ) {
        return prevBookmarks; // Return unchanged if duplicate
      }
      return [newBookmark, ...prevBookmarks];
    });

    // Show success animation
    if (successIndicatorRef.current) {
      showSuccessMessage(successIndicatorRef.current);
    }
  };

  return (
    <div ref={pageRef} className="relative mx-auto px-4 py-4 h-full">
      <BookmarkForm onSubmit={handleAddBookmark} />
      <BookmarksList bookmarks={sortedBookmarks} />
    </div>
  );
};
