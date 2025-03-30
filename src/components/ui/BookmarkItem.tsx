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
  className={`relative h-full flex text-gray-400 hover:text-gray-600 transition-colors bg-orange-100 rounded-md border border-gray-100 hover:bg-blue-50 z-20 ${className}`}
>
  <div className="absolute bottom-44 left-0 right-0 h-full flex items-center">
    <div 
      className="absolute bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap -rotate-90"
    >
      <span className="text-xl tracking-wider truncate block w-[500px]">
        {bookmark.url}
      </span>
    </div>
  </div>
</Link>
  );
};
