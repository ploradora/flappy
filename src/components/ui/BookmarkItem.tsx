"use client";

import { useRef, useState } from "react";
import { Bookmark } from "../../types";
import Link from "next/link";
import gsap from "gsap";
import { Pencil, Trash } from "lucide-react";
import { deleteBookmark } from "@/app/actions";

interface BookmarkItemProps {
  bookmark: Bookmark;
  className?: string;
  onDelete: (id: string) => void;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  bookmark,
  className = "",
  onDelete,
}) => {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const linkButtonsRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteBookmark(bookmark.id);
    onDelete(bookmark.id);
  };

  return (
    <div
      className="relative group hover:bg-orange-400 rounded-t-md"
      onMouseEnter={() => {
        gsap.to(linkButtonsRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.1,
          ease: "power3.out",
        });
      }}
      onMouseLeave={() => {
        gsap.to(linkButtonsRef.current, {
          y: -20, // slide down slightly before fading
          opacity: 0,
          duration: 0.1,
          ease: "power2.inOut",
        });
      }}
    >
      <Link
        ref={itemRef}
        href={bookmark.url}
        target="_blank"
        className={`relative h-full flex text-gray-600 hover:text-gray-600 transition-colors bg-gray-100 rounded-t-md border border-gray-100 hover:bg-orange-400 hover:border-orange-400 z-20 overflow-hidden group-hover:bg-orange-400 ${className} ${
          isHovered ? "bg-orange-400 border-orange-400" : ""
        }`}
      >
        <div className="h-full flex items-end">
          <div className="absolute bottom-66 left-1/2 transform -translate-x-1/2 whitespace-nowrap -rotate-90">
            <span className="text-3xl font-bold tracking-tighter truncate block w-[500px] text-gray-500 transition-colors duration-200 group-hover:text-gray-800">
              {bookmark.url}
            </span>
          </div>
        </div>
      </Link>

      {/* Hover-revealed buttons BELOW the link */}
      <div
        ref={linkButtonsRef}
        className="absolute w-full pt-1 left-0 flex opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full flex items-center rounded-b-md">
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex-1 rounded-bl-md px-2 py-1 text-xs text-gray-800 bg-orange-300 hover:bg-orange-400 cursor-pointer"
          >
            <Pencil size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={handleDelete}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex-1 rounded-br-md px-2 py-1 text-xs text-gray-800 bg-orange-300 hover:bg-orange-400 cursor-pointer"
          >
            <Trash size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
