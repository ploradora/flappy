import { Bookmark } from "../types";

const STORAGE_KEY = "bookmarks";

export const bookmarkStorage = {
  getAll: (): Bookmark[] => {
    try {
      const bookmarks = localStorage.getItem(STORAGE_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error("Error retrieving bookmarks from localStorage:", error);
      return [];
    }
  },

  save: (bookmarks: Bookmark[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Error saving bookmarks to localStorage:", error);
    }
  },

  delete: (id: string): void => {
    try {
      const bookmarks = localStorage.getItem(STORAGE_KEY);
      const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];
      const filteredBookmarks = parsedBookmarks.filter(
        (bookmark: Bookmark) => bookmark.id !== id
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBookmarks));
    } catch (error) {
      console.error("Error deleting bookmark from localStorage:", error);
    }
  },

  add: (bookmark: Bookmark): void => {
    try {
      const bookmarks = localStorage.getItem(STORAGE_KEY);
      const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];

      // Check if bookmark with same URL already exists (case insensitive)
      const exists = parsedBookmarks.some(
        (existingBookmark: Bookmark) =>
          existingBookmark.url.toLowerCase() === bookmark.url.toLowerCase()
      );

      // Only add if not a duplicate
      if (!exists) {
        parsedBookmarks.push(bookmark);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedBookmarks));
      } else {
        console.log("Bookmark already exists, not adding duplicate");
      }
    } catch (error) {
      console.error("Error adding bookmark to localStorage:", error);
    }
  },
};
