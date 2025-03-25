'use client'

import { BookmarkForm } from "@/components/ui/BookmarkForm";
import { BookmarksList } from "@/components/ui/BookmarksList";
import { Bookmark } from "@/types";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { pageTransition, showSuccessMessage } from "@/utils/animations";
import { getBookmarks, addBookmark, updateBookmark, deleteBookmark } from "@/app/actions";

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
    <div ref={pageRef} className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="page-title text-3xl font-bold mb-10 text-center text-gray-800">
        <span className="text-blue-600">Bookmark</span> Manager
      </h1>

      {/* Success indicator (initially hidden) */}
      <div
        ref={successIndicatorRef}
        className="success-indicator fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg opacity-0 transform translate-y-[-10px] z-50"
      >
        Bookmark saved successfully!
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

      {/* Bookmarks list with pagination */}
      <BookmarksList
        bookmarks={bookmarks}
        onEdit={handleEditBookmark}
        onDelete={handleDeleteBookmark}
      />
    </div>  
  );
};
