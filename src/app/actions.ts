import { v4 as uuidv4 } from "uuid";
import { Bookmark } from "@/types";
import { bookmarkStorage } from "@/utils/bookmarkStorage";

/**
 * Get all bookmarks sorted by creation date (newest first)
 */
export function getBookmarks(): Bookmark[] {
  const bookmarks = bookmarkStorage.getAll();
  return bookmarks.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Add a new bookmark
 */
export function addBookmark({
  url,
  title,
}: Omit<Bookmark, "id" | "createdAt" | "description">): Bookmark {
  const newBookmark: Bookmark = {
    id: uuidv4(),
    url,
    title,
    description: "",
    createdAt: Date.now(),
  };

  const bookmarks = bookmarkStorage.getAll();
  const updatedBookmarks = [newBookmark, ...bookmarks];
  bookmarkStorage.save(updatedBookmarks);

  return newBookmark;
}

/**
 * Update an existing bookmark
 */
export function updateBookmark(
  bookmarkId: string,
  { url, title }: Omit<Bookmark, "id" | "createdAt" | "description">
): Bookmark | null {
  const bookmarks = bookmarkStorage.getAll();
  const existingBookmark = bookmarks.find((b) => b.id === bookmarkId);

  if (!existingBookmark) {
    return null;
  }

  const updatedBookmark: Bookmark = {
    ...existingBookmark,
    url,
    title,
    description: "",
  };

  const updatedBookmarks = bookmarks.map((bookmark) =>
    bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
  );

  bookmarkStorage.save(updatedBookmarks);
  return updatedBookmark;
}

/**
 * Delete a bookmark by ID
 */
export function deleteBookmark(id: string): boolean {
  const bookmarks = bookmarkStorage.getAll();
  const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);

  // If lengths are the same, bookmark wasn't found
  if (bookmarks.length === updatedBookmarks.length) {
    return false;
  }

  bookmarkStorage.save(updatedBookmarks);
  return true;
}
