"use client";

import { useEffect, useState, useRef } from "react";
import { Bookmark } from "../../types";
import { BookmarkItem } from "./BookmarkItem";
import { gsap } from "gsap";
import { Pagination } from "./Pagination";

interface BookmarksListProps {
  bookmarks: Bookmark[];
}

const getColumnCount = () => {
  if (window.matchMedia("(min-width: 1280px)").matches) return 14; // xl
  if (window.matchMedia("(min-width: 1024px)").matches) return 10; // lg
  if (window.matchMedia("(min-width: 768px)").matches) return 6; // md
  return 4; // default base
};

export const BookmarksList = ({ bookmarks }: BookmarksListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedBookmarks, setDisplayedBookmarks] = useState<Bookmark[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(4);
  const [itemsPerPage, setItemsPerPage] = useState(columnCount);

  const totalPages = Math.max(1, Math.ceil(bookmarks.length / itemsPerPage));

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const updateColumns = () => {
      const newColumnCount = getColumnCount();
      setColumnCount(newColumnCount);
      setItemsPerPage(newColumnCount);
    };

    updateColumns();
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
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedBookmarks(bookmarks.slice(startIndex, endIndex));
  }, [bookmarks, currentPage, itemsPerPage]);

  // Animate items when they change
  useEffect(() => {
    if (itemsRef.current) {
      const animatedItems = itemsRef.current.querySelectorAll(".bookmark-anim");

      gsap.fromTo(
        animatedItems,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: {
            each: 0.05,
            from: "start",
          },
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

    if (itemsRef.current) {
      const oldItems = itemsRef.current.querySelectorAll(".bookmark-anim");

      gsap.to(oldItems, {
        opacity: 0,
        y: -20 * direction, // animate out upward
        duration: 0.25,
        ease: "power2.in",
        stagger: {
          each: 0.03,
          from: "start", // top-to-bottom
        },
        onComplete: () => {
          setCurrentPage(page);

          // wait for React to render new items
          requestAnimationFrame(() => {
            const newItems =
              itemsRef.current?.querySelectorAll(".bookmark-anim");
            if (newItems) {
              gsap.fromTo(
                newItems,
                { opacity: 0, y: 20 * direction }, // animate in downward
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.35,
                  ease: "power2.out",
                  stagger: {
                    each: 0.04,
                    from: "start", // top-to-bottom again
                  },
                  clearProps: "all",
                }
              );
            }
          });
        },
      });
    } else {
      setCurrentPage(page);
    }
  };

  // Empty state
  // if (bookmarks.length === 0) {
  //   displayedBookmarks.length === 0 && (
  //     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
  //       <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 text-center">
  //         <h3 className="text-base font-medium text-gray-500">
  //           You don't have any links added yet
  //         </h3>
  //         <p className="text-sm text-gray-400 mt-1">
  //           Try adding some links to get started.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="relative flex h-[calc(100%_-_250px)] max-w-[1000px] m-auto">
      {hasMounted && totalPages > 1 && (
        <div className="absolute py-4 self-start top-1/2 transform -translate-y-1/2 -left-14 h-fit">
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      )}

      {hasMounted && (
        <div ref={listRef} className="relative bg-gray-50 mt-4 h-full w-full">
          <div className="relative w-full h-full">
            {/* BACKGROUND GRID */}
            <div
              className="absolute inset-0 z-0 grid w-full h-full gap-1 pointer-events-none 
                grid-cols-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-14"
            >
              {Array.from({ length: columnCount }).map((_, i) => (
                <div
                  key={`grid-bg-${i}`}
                  className="border-2 border-dashed border-gray-200 rounded-md"
                />
              ))}
            </div>

            {/* FOREGROUND GRID */}
            <div
              ref={itemsRef}
              className="relative z-10 grid w-full h-full gap-1
                grid-cols-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-14"
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
                  <div key={`empty-${i}`} />
                );
              })}
            </div>

            {/* EMPTY STATE MESSAGE */}
            {bookmarks.length === 0 && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="rounded-md bg-gray-50 p-4 text-center">
                  <h3 className="text-base font-medium text-gray-500">
                    You don't have any links added yet
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adding some links to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
