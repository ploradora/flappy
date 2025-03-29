"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const paginationRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (paginationRef.current) {
  //     gsap.fromTo(
  //       paginationRef.current,
  //       { opacity: 0, y: 20 },
  //       { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
  //     );
  //   }
  // }, []);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first and last page
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      ref={paginationRef}
      className="flex flex-col justify-start items-center space-y-2 p-2"
    >
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center h-8 w-8 rounded-md focus:outline-none cursor-pointer ${
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        }`}
        aria-label="Previous page"
      >
        <svg
          className="h-4 w-4 rotate-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="w-full h-px bg-gray-100 my-1"></div>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 py-1 text-sm text-gray-400 h-8 flex items-center"
          >
            ⋯
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`h-8 w-8 rounded-md focus:outline-none transition-colors text-sm cursor-pointer flex items-center justify-center ${
              page === currentPage
                ? "bg-blue-50 text-blue-600 border border-blue-200 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <div className="w-full h-px bg-gray-100 my-1"></div>

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center h-8 w-8 rounded-md focus:outline-none cursor-pointer ${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        }`}
        aria-label="Next page"
      >
        <svg
          className="h-4 w-4 rotate-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
};
