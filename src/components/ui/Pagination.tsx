import { useEffect, useRef, useState } from "react";
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
  const [selectedPage, setSelectedPage] = useState(currentPage);

  useEffect(() => {
    // Sync when parent updates
    setSelectedPage(currentPage);
  }, [currentPage]);

  const handlePageClick = (page: number) => {
    setSelectedPage(page); // Update instantly for UI
    onPageChange(page); // Let parent do the real page update
  };

  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (selectedPage <= 3) {
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (selectedPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = selectedPage - 1; i <= selectedPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div
      ref={paginationRef}
      className="flex flex-col justify-start items-center space-y-2 p-2"
    >
      <button
        onClick={() =>
          selectedPage > 1 && handlePageClick(selectedPage - 1)
        }
        disabled={selectedPage === 1}
        className={`flex items-center justify-center h-8 w-8 rounded-md focus:outline-none cursor-pointer ${
          selectedPage === 1
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

      <div className="w-full h-px bg-zinc-600 mb-2 mt-1"/>

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
            onClick={() =>
              typeof page === "number" && handlePageClick(page)
            }
            className={`h-8 w-8 rounded-md focus:outline-none transition-colors text-sm cursor-pointer flex items-center justify-center ${
              page === selectedPage
                ? "bg-zinc-500 text-white border border-zinc-500 font-medium hover:bg-gray-400"
                : "text-gray-300 hover:bg-zinc-700 hover:text-gray-200"
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === selectedPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

<div className="w-full h-px bg-zinc-600 mt-2 mb-1"/>  

      <button
        onClick={() =>
          selectedPage < totalPages && handlePageClick(selectedPage + 1)
        }
        disabled={selectedPage === totalPages}
        className={`flex items-center justify-center h-8 w-8 rounded-md focus:outline-none cursor-pointer ${
          selectedPage === totalPages
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
