"use client";

import { BookmarkForm } from "@/components/ui/BookmarkForm";
import { BookmarksList } from "@/components/ui/BookmarksList";
import { Bookmark } from "@/types";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
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

      gsap.fromTo(
        ".page-title",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, []);

  // Handle adding a new bookmark
  const handleAddBookmark = ({ url }: Omit<Bookmark, "id" | "createdAt">) => {
    const newBookmark = addBookmark({ url });

    // Update local state with the new bookmark that now has id and createdAt
    setBookmarks((prevBookmarks) => [newBookmark, ...prevBookmarks]);

    // Show success animation
    if (successIndicatorRef.current) {
      showSuccessMessage(successIndicatorRef.current);
    }
  };

  return (
    <div ref={pageRef} className="relative mx-auto px-4 py-4 h-full">
      {/* Success indicator (initially hidden) */}
      <div
        ref={successIndicatorRef}
        className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-5 py-3 rounded-full shadow-md opacity-0 z-50 flex items-center border border-gray-100"
      >
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Bookmark saved
      </div>

      {/* Bookmark form */}
      <BookmarkForm onSubmit={handleAddBookmark} />

      {/* Bookmarks list */}
      <BookmarksList bookmarks={bookmarks} />
    </div>
  );
};
