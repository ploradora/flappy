import { Bookmark } from "../types";

const STORAGE_KEY = "bookmarks";

export const bookmarkStorage = {
  getAll: (): Bookmark[] => {
    try {
      const bookmarks = localStorage.getItem(STORAGE_KEY);
      const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];

      // Sort by createdAt in descending order (newest first)
      // Handle bookmarks that might not have createdAt yet
      return parsedBookmarks.sort((a: Bookmark, b: Bookmark) => {
        const timeA = a.createdAt || 0;
        const timeB = b.createdAt || 0;
        return timeB - timeA;
      });
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

  add: (bookmark: Bookmark): void => {
    try {
      const bookmarks = localStorage.getItem(STORAGE_KEY);
      const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];
      parsedBookmarks.unshift(bookmark);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedBookmarks));
    } catch (error) {
      console.error("Error adding bookmark to localStorage:", error);
    }
  },
};
