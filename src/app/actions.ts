import { v4 as uuidv4 } from "uuid";
import { Bookmark } from "@/types";
import { bookmarkStorage } from "@/utils/bookmarkStorage";

/**
 * Get all bookmarks sorted by creation date (newest first)
 */
export function getBookmarks(): Bookmark[] {
  const bookmarks = bookmarkStorage.getAll();
  return bookmarks
}

/**
 * Add a new bookmark
 */
export function addBookmark({
  url,
}: Omit<Bookmark, "id" >): Bookmark {
  const newBookmark: Bookmark = {
    id: uuidv4(),
    url
  };

  const bookmarks = bookmarkStorage.getAll();
  const updatedBookmarks = [newBookmark, ...bookmarks];
  // bookmarkStorage.save(updatedBookmarks);

  return newBookmark;
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

  // bookmarkStorage.save(updatedBookmarks);
  return true;
}
