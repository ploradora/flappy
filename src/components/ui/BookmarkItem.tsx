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
  className={`relative h-full flex text-gray-400 hover:text-gray-600 transition-colors bg-orange-100 rounded-md border border-gray-100 hover:bg-blue-50 z-20 overflow-hidden ${className}`}
>
  <div className="h-full flex items-end">
    <div 
      className="absolute bottom-66 left-1/2 transform -translate-x-1/2 whitespace-nowrap -rotate-90 "
    >
      <span className="text-xl tracking-wider truncate block w-[500px]">
        {bookmark.url}
      </span>
    </div>
  </div>
</Link>
  );
};
