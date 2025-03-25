"use client";

import { useRef } from "react";
import { Bookmark } from "../../types";
import { gsap } from "gsap";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
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

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get initial letter and generate a color based on the title
  const getInitial = (title: string): string => {
    return title.charAt(0).toUpperCase();
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
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full bg-blue-400 ${
              bookmark.title
            } text-white flex items-center justify-center font-medium mr-3 text-lg shadow-sm`}
          >
            {getInitial(bookmark.title)}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-base font-medium mb-0.5 text-blue-600 hover:text-blue-800 transition-colors truncate">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                title={bookmark.title}
                className="flex items-center"
              >
                {bookmark.title}
                <ExternalLink className="ml-1 h-3 w-3 inline-block text-gray-400" />
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
        </div>

        <div className="flex space-x-1 shrink-0">
          <button
            onClick={() => onEdit(bookmark)}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-blue-50"
            aria-label="Edit bookmark"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
            aria-label="Delete bookmark"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
