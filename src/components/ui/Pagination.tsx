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

  useEffect(() => {
    if (paginationRef.current) {
      gsap.fromTo(
        paginationRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  // Animate page button hover
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.1,
      backgroundColor: "#3b82f6",
      color: "white",
      duration: 0.2,
    });
  };

  const handleButtonLeave = (
    e: React.MouseEvent<HTMLButtonElement>,
    isActive: boolean
  ) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      backgroundColor: isActive ? "#3b82f6" : "#f9fafb",
      color: isActive ? "white" : "#374151",
      duration: 0.2,
    });
  };

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
      className="flex justify-center items-center mt-8 mb-4 space-x-1"
    >
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center h-10 w-10 rounded-md focus:outline-none ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-blue-500 hover:text-white"
        }`}
        onMouseEnter={currentPage !== 1 ? handleButtonHover : undefined}
        onMouseLeave={(e) => currentPage !== 1 && handleButtonLeave(e, false)}
        aria-label="Previous page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 mx-1">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`h-10 w-10 rounded-md focus:outline-none transition-colors ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
            onMouseEnter={handleButtonHover}
            onMouseLeave={(e) => handleButtonLeave(e, page === currentPage)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center h-10 w-10 rounded-md focus:outline-none ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-blue-500 hover:text-white"
        }`}
        onMouseEnter={
          currentPage !== totalPages ? handleButtonHover : undefined
        }
        onMouseLeave={(e) =>
          currentPage !== totalPages && handleButtonLeave(e, false)
        }
        aria-label="Next page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
