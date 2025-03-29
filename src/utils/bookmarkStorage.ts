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

  add: (bookmark: Bookmark): void => {
    try {
      const bookmarks = localStorage.getItem(STORAGE_KEY);
      const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];
      parsedBookmarks.push(bookmark);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedBookmarks));
    } catch (error) {
      console.error("Error adding bookmark to localStorage:", error);
    }
  },
};