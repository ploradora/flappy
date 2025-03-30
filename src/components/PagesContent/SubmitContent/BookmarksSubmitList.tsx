"use client";

import { getBookmarks } from "@/app/actions";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Bookmark } from "@/types";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { gsap } from "gsap";

// Create a custom event for URL check submission
export const URL_CHECK_EVENT = "url-check-submission";

// Client component to avoid hydration issues
export const BookmarksSubmitList = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [submittedUrl, setSubmittedUrl] = useState(""); // Track submitted URL separately
  const bookmarksListRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bookmarkItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Get bookmarks on client side only
  useEffect(() => {
    // Create function to get latest bookmarks
    const refreshBookmarks = () => {
      const allBookmarks = getBookmarks();
      // Sort bookmarks by createdAt, newest first
      const sortedBookmarks = [...allBookmarks].sort(
        (a, b) => b.createdAt - a.createdAt
      );
      setBookmarks(sortedBookmarks);
    };

    // Initial load
    refreshBookmarks();
  }, []);

  // Animate bookmark items when they mount or change
  useEffect(() => {
    if (bookmarks.length > 0 && bookmarksListRef.current) {
      const bookmarkItems =
        bookmarksListRef.current.querySelectorAll(".bookmark-item");

      gsap.fromTo(
        bookmarkItems,
        {
          opacity: 0,
          y: -15,
        },
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
  }, [bookmarks]);

  // Function to set ref for each bookmark item
  const setBookmarkItemRef = (
    element: HTMLAnchorElement | null,
    url: string
  ) => {
    if (element) {
      bookmarkItemRefs.current.set(url, element);
    }
  };

  // Clear refs when bookmarks change
  useEffect(() => {
    // Clear the map when bookmarks change to prevent stale references
    bookmarkItemRefs.current.clear();
  }, [bookmarks]);

  // Scroll to the matched bookmark when submittedUrl changes
  useEffect(() => {
    // Clear any previously highlighted items first
    const allBookmarkItems = document.querySelectorAll(".bookmark-item");
    if (allBookmarkItems.length > 0) {
      gsap.to(allBookmarkItems, {
        backgroundColor: "#f3f4f6", // gray-100 equivalent, default color
        color: "#6b7280", // gray-500 equivalent
        duration: 0.1,
        ease: "power2.out",
      });
    }

    // Only proceed with highlighting and scrolling if there's a valid submitted URL
    if (
      submittedUrl &&
      bookmarkItemRefs.current.has(submittedUrl) &&
      scrollContainerRef.current
    ) {
      const element = bookmarkItemRefs.current.get(submittedUrl);

      if (element) {
        // First highlight with animation
        gsap.to(element, {
          backgroundColor: "#047857", // green-700 equivalent
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            // Scroll the element into view with animation
            const container = scrollContainerRef.current;
            if (container) {
              const elementTop = element.offsetTop;
              const containerScrollTop = container.scrollTop;
              const containerHeight = container.offsetHeight;
              const elementHeight = element.offsetHeight;

              // Calculate target scroll position to center the element
              const scrollTarget =
                elementTop - containerHeight / 2 + elementHeight / 2;

              // Animate the scroll
              gsap.to(container, {
                scrollTop: scrollTarget,
                duration: 0.4,
                ease: "power2.inOut",
              });
            }
          },
        });
      }
    }
  }, [submittedUrl]);

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
    return bookmarkUrl === submittedUrl;
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
        <div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto scrollbar-thin"
        >
          <div
            ref={bookmarksListRef}
            className="flex flex-col gap-1 p-4 w-full"
          >
            {bookmarks.map((bookmark) => {
              const isActive = isActiveBookmark(bookmark.url);
              return (
                <Link
                  key={bookmark.id}
                  href={bookmark.url}
                  ref={(el) => setBookmarkItemRef(el, bookmark.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-[52px] w-full p-4 transition-colors cursor-pointer rounded-md z-20 group bookmark-item ${
                    isActive
                      ? "bg-green-700 text-white hover:bg-green-800"
                      : "bg-gray-100 hover:bg-orange-400"
                  }`}
                >
                  <p
                    className={`text-xl font-bold tracking-tighter truncate group-hover:text-gray-800 ${
                      isActive
                        ? "text-white group-hover:text-white"
                        : "text-gray-500"
                    }`}
                  >
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
