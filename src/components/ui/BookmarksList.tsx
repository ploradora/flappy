"use client";

import { useEffect, useState, useRef } from "react";
import { Bookmark } from "../../types";
import { BookmarkItem } from "./BookmarkItem";
import { gsap } from "gsap";

interface BookmarksListProps {
  bookmarks: Bookmark[];
}

const getColumnCount = () => {
  if (window.matchMedia("(min-width: 1280px)").matches) return 14; // xl
  if (window.matchMedia("(min-width: 1024px)").matches) return 10; // lg
  if (window.matchMedia("(min-width: 768px)").matches) return 6; // md
  return 4; // default base
};

const ITEMS_PER_PAGE = 10;

export const BookmarksList = ({ bookmarks }: BookmarksListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedBookmarks, setDisplayedBookmarks] = useState<Bookmark[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(4);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(bookmarks.length / ITEMS_PER_PAGE));

  useEffect(() => {
    const updateColumns = () => setColumnCount(getColumnCount());

    updateColumns(); // initial
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);
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
        <div
          ref={itemsRef}
          className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-14 w-full h-full gap-1"
        >
          {Array.from({ length: columnCount }).map((_, i) => {
            const bookmark = displayedBookmarks[i];
            return bookmark ? (
              <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ) : (
              <div
                key={`empty-${i}`}
                className="border-2 border-dashed border-gray-200 rounded-md "
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
