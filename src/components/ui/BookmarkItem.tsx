"use client";

import { useRef } from "react";
import { Bookmark } from "../../types";
import { gsap } from "gsap";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

export const BookmarkItem = ({
  bookmark,
  onEdit,
  onDelete,
}: BookmarkItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    if (itemRef.current) {
      // Animate out before deleting
      gsap.to(itemRef.current, {
        opacity: 0,
        x: -20,
        height: 0,
        marginBottom: 0,
        padding: 0,
        duration: 0.3,
        onComplete: () => onDelete(bookmark.id),
      });
    } else {
      onDelete(bookmark.id);
    }
  };

  // Handle hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -3,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      duration: 0.3,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      duration: 0.3,
    });
  };

  return (
    <div
      ref={itemRef}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-100 mb-3 transition-all"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-center">
        <div className="flex-grow min-w-0 pr-3">
          <h3 className="text-base font-medium mb-0.5 text-blue-600 hover:text-blue-800 transition-colors truncate">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              title={bookmark.title}
            >
              {bookmark.title}
            </a>
          </h3>
          <div className="text-xs text-gray-500 flex items-center">
            <span className="inline-block mr-2">
              {formatDate(bookmark.createdAt)}
            </span>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors truncate"
              title={bookmark.url}
            >
              {bookmark.url.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>

        <div className="flex space-x-1 shrink-0">
          <button
            onClick={() => onEdit(bookmark)}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-blue-50"
            aria-label="Edit bookmark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
            aria-label="Delete bookmark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
