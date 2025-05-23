import { v4 as uuidv4 } from "uuid";
import { Bookmark } from "@/types";
import { bookmarkStorage } from "@/utils/bookmarkStorage";

export function getBookmarks(): Bookmark[] {
  const bookmarks = bookmarkStorage.getAll();
  return bookmarks;
}

export function addBookmark({
  url,
}: Omit<Bookmark, "id" | "createdAt">): Bookmark {
  const newBookmark: Bookmark = {
    id: uuidv4(),
    url,
    createdAt: Date.now(),
  };

  bookmarkStorage.add(newBookmark);
  return newBookmark;
}

export function deleteBookmark(id: string) {
  bookmarkStorage.delete(id);
}
