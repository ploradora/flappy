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

export const bookmarkForm = {
  openCloseForm: (isOpen: boolean) => {
    localStorage.setItem("showForm", JSON.stringify(isOpen));
  },
  getState: (): boolean => {
    try {
      const stored = localStorage.getItem("showForm");
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  },
  toggle: () => {
    const current = bookmarkForm.getState();
    bookmarkForm.openCloseForm(!current);
  },
};
