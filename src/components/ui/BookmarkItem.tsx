"use client";

import { useRef } from "react";
import { Bookmark } from "../../types";
import { gsap } from "gsap";
import Link from "next/link";

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


  const handleDelete = () => {
    if (itemRef.current) {
      // Animate out before deleting
      gsap.to(itemRef.current, {
        opacity: 0,
        x: -20,
        height: 0,
        marginBottom: 0,
        padding: 0,
        duration: 0.25,
        onComplete: () => onDelete(bookmark.id),
      });
    } else {
      onDelete(bookmark.id);
    }
  };

  return (
    <div
      ref={itemRef}
      className="bg-white px-3 py-2 rounded-md shadow-sm border border-gray-100 mb- transition-all hover:bg-orange-50"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-grow min-w-0 pr-3">
          <div className="flex-grow min-w-0">
            <div className="text-xs text-gray-500 flex items-center">
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
        </div>

        <div className="flex space-x-1 shrink-0">
          <button
            onClick={() => onEdit(bookmark)}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-blue-50"
            aria-label="Edit bookmark"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
            aria-label="Delete bookmark"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
