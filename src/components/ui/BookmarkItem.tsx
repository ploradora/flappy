"use client";

import { useRef } from "react";
import { Bookmark } from "../../types";
import Link from "next/link";

interface BookmarkItemProps {
  bookmark: Bookmark;
  className?: string;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  bookmark,
  className = "",
}) => {
  const itemRef = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={itemRef}
      href={bookmark.url}
      target="_blank"
      className={`h-full flex justify-center items-center text-gray-400 hover:text-gray-600 transition-colors bg-orange-100 rounded-md border border-gray-100 hover:bg-blue-50 z-20 ${className}`}
    >
      <div className="-rotate-90 mt-20 flex items-center justify-center ">
        <span className="text-xl tracking-wider whitespace-nowrap">
          {bookmark.url.replace(/^https?:\/\//, "")}
        </span>
      </div>
    </Link>
  );
};
