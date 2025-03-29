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

  const totalPages = Math.max(1, Math.ceil(bookmarks.length / ITEMS_PER_PAGE));

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
      const animatedSpans = itemsRef.current.querySelectorAll(".bookmark-anim");

      gsap.fromTo(
        animatedSpans,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }

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
    displayedBookmarks.length === 0 && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 text-center">
          <h3 className="text-base font-medium text-gray-500">
            You don't have any links added yet
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Try adding some links to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100%_-_250px)] max-w-[1000px] m-auto">
      {hasMounted && (
        <div ref={listRef} className="relative bg-gray-50 mt-4 h-full">
          <div
            ref={itemsRef}
            className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-14 w-full h-full gap-1"
          >
            {Array.from({ length: columnCount }).map((_, i) => {
              const bookmark = displayedBookmarks[i];
              return bookmark ? (
                <BookmarkItem
                  key={bookmark.id}
                  bookmark={bookmark}
                  className="bookmark-anim"
                />
              ) : (
                <div
                  key={`empty-${i}`}
                  className="border-2 border-dashed border-gray-200 rounded-md"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
