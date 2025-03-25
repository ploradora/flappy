"use client";

import { BookmarkForm } from "@/components/ui/BookmarkForm";
import { BookmarksList } from "@/components/ui/BookmarksList";
import { Bookmark } from "@/types";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { pageTransition, showSuccessMessage } from "@/utils/animations";
import {
  getBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
} from "@/app/actions";
import Link from "next/link";

export const OverviewContent = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const successIndicatorRef = useRef<HTMLDivElement>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

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
  const handleAddBookmark = ({
    url,
    title,
  }: Omit<Bookmark, "id" | "createdAt" | "description">) => {
    const newBookmark = addBookmark({ url, title });

    // Update local state
    setBookmarks((prevBookmarks) => [newBookmark, ...prevBookmarks]);

    // Show success animation
    if (successIndicatorRef.current) {
      showSuccessMessage(successIndicatorRef.current);
    }
  };

  // Handle editing a bookmark
  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);

    // Scroll to form with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle updating a bookmark
  const handleUpdateBookmark = ({
    url,
    title,
  }: Omit<Bookmark, "id" | "createdAt" | "description">) => {
    if (!editingBookmark) return;

    const updatedBookmark = updateBookmark(editingBookmark.id, { url, title });
    if (updatedBookmark) {
      // Update local state
      setBookmarks((prevBookmarks) =>
        prevBookmarks.map((bookmark) =>
          bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
        )
      );
    }

    setEditingBookmark(null);

    // Show success animation
    if (successIndicatorRef.current) {
      showSuccessMessage(successIndicatorRef.current);
    }
  };

  // Handle deleting a bookmark
  const handleDeleteBookmark = (id: string) => {
    const success = deleteBookmark(id);

    if (success) {
      // Update local state
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark.id !== id)
      );

      // If currently editing this bookmark, cancel editing
      if (editingBookmark?.id === id) {
        setEditingBookmark(null);
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBookmark(null);
  };

  return (
    <div
      ref={pageRef}
      className="container relative mx-auto px-4 py-8 max-w-[670px]"
    >
      {/* Success indicator (initially hidden) */}
      <div
        ref={successIndicatorRef}
        className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-5 py-3 rounded-full shadow-md opacity-0 z-50 flex items-center border border-gray-100"
      >
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Bookmark saved
      </div>

      {/* Bookmark form */}
      {editingBookmark ? (
        <BookmarkForm
          editBookmark={editingBookmark}
          onSubmit={handleUpdateBookmark}
          onCancel={handleCancelEdit}
        />
      ) : (
        <BookmarkForm onSubmit={handleAddBookmark} />
      )}

      <div className="flex justify-center mb-8 w-full gap-4 px-6 py-6">
        <Link
          href="/submit"
          className="flex items-center justify-center px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-full"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="8"
              y1="12"
              x2="16"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Check URL
        </Link>
        <Link
          href="/results"
          className="flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 12L11 15L16 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          View Results
        </Link>
      </div>

      {/* Bookmarks list with pagination */}
      <BookmarksList
        bookmarks={bookmarks}
        onEdit={handleEditBookmark}
        onDelete={handleDeleteBookmark}
      />
    </div>
  );
};
