"use client";

import { useEffect, useState, useRef } from "react";
import { Bookmark } from "../../types";
import { BookmarkItem } from "./BookmarkItem";
import { Pagination } from "./Pagination";
import { gsap } from "gsap";
import { BookmarkListCutout } from "./BookmarkListCutout";

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

export const BookmarksList = ({
  bookmarks,
  onEdit,
  onDelete,
}: BookmarksListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedBookmarks, setDisplayedBookmarks] = useState<Bookmark[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(bookmarks.length / ITEMS_PER_PAGE));

  // Make sure currentPage is valid after bookmarks change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [bookmarks.length, currentPage, totalPages]);

  // Update displayed bookmarks when page or bookmarks change
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedBookmarks(bookmarks.slice(startIndex, endIndex));
  }, [bookmarks, currentPage]);

  // Animate items when they change
  useEffect(() => {
    if (itemsRef.current) {
      const items = itemsRef.current.children;

      gsap.fromTo(
        items,
        { opacity: 0, x: 10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }

    // Animate header
    if (headerRef.current && displayedBookmarks.length > 0) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
    }
  }, [displayedBookmarks]);

  // Handle page changes with animation
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    const direction = page > currentPage ? 1 : -1;

    if (listRef.current) {
      // Create timeline for page transition
      gsap
        .timeline()
        .to(listRef.current, {
          opacity: 0,
          x: -15 * direction,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            setCurrentPage(page);
            gsap.set(listRef.current, { x: 15 * direction });
          },
        })
        .to(listRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.25,
          ease: "power2.out",
          delay: 0.05,
        });
    } else {
      setCurrentPage(page);
    }
  };

  // Empty state
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-lg border border-gray-100 shadow-sm">
        <h3 className="text-xl font-medium text-gray-600">No bookmarks yet</h3>
        <p className="text-gray-500 mt-2 mb-6">
          Add your first bookmark using the form above
        </p>
        <div className="inline-block relative animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100%_-_250px)] max-w-[1000px] m-auto">
      <div ref={listRef} className="relative bg-gray-50 mt-4 h-full">
        <div ref={itemsRef} className="flex h-full gap-2">
          {displayedBookmarks.length > 0 ? (
            displayedBookmarks.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-md border border-gray-100 shadow-sm">
              <h3 className="text-base font-medium text-gray-500">
                No bookmarks found
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Try a different page or add new bookmarks
              </p>
            </div>
          )}
        </div>
        <BookmarkListCutout />
      </div>
      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      /> */}
    </div>
  );
};
