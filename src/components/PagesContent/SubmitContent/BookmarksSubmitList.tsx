import { getBookmarks } from "@/app/actions";
import { Globe, Clock } from "lucide-react";
import Link from "next/link";

export const BookmarksSubmitList = () => {
  const bookmarks = getBookmarks();

  // Format date in a simple way
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 border-r bg-white border-gray-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Globe size={18} className="text-blue-500" />
          Your Have
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {bookmarks.length}
          </span>
          Bookmarks
        </h2>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-xs">
            <p className="text-gray-500 mb-2">
              You don't have any bookmarks yet
            </p>
            <p className="text-sm text-gray-400">
              Add your first bookmark from the Overview page
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="gap-1 p-4 w-full">
            {bookmarks.map((bookmark) => (
              <Link
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 hover:bg-gray-100 transition-colors cursor-pointer bg-orange-200"
              >
                <p className="text-sm text-gray-500 truncate mb-2">
                  {bookmark.url}
                </p>

                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={14} className="mr-1" />
                  {formatDate(bookmark.createdAt)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .bookmarks-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .bookmarks-scrollbar::-webkit-scrollbar-track {
          background-color: #f1f1f1;
        }
        .bookmarks-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        .bookmarks-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
    </div>
  );
};
