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
    const bookmarks = bookmarkStorage.getAll();
    bookmarks.push(bookmark);
    bookmarkStorage.save(bookmarks);
  },

  update: (updatedBookmark: Bookmark): void => {
    const bookmarks = bookmarkStorage.getAll();
    const updatedBookmarks = bookmarks.map((bookmark) =>
      bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
    );
    bookmarkStorage.save(updatedBookmarks);
  },

  delete: (id: string): void => {
    const bookmarks = bookmarkStorage.getAll();
    const filteredBookmarks = bookmarks.filter(
      (bookmark) => bookmark.id !== id
    );
    bookmarkStorage.save(filteredBookmarks);
  },

  clear: (): void => {
    bookmarkStorage.save([]);
  },
};
