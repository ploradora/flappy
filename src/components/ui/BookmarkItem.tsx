"use client";

import { useRef } from "react";
import { Bookmark } from "../../types";
import Link from "next/link";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

export const BookmarkItem = ({ bookmark }: BookmarkItemProps) => {
  const itemRef = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={itemRef}
      href={bookmark.url}
      target="_blank"
      className="h-full min-w-16 max-w-18 flex-1 flex items-end pb-10 justify-stretch text-gray-400 hover:text-gray-600 transition-colors bg-orange-100 rounded-md border border-gray-100 hover:bg-orange-50 z-20"
    >
      <span className="-rotate-90 w-full whitespace-nowrap text-xl tracking-wider">
        {bookmark.url.replace(/^https?:\/\//, "")}
      </span>
    </Link>
  );
};
