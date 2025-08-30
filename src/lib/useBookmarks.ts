import { useState, useEffect } from 'react';
import { Bookmark } from '@/lib/types';
import { 
  downloadBookmarksAsJSON, 
  downloadBookmarkAsMarkdown, 
  downloadBookmarksAsMarkdownZip 
} from '@/lib/downloadUtils';

const BOOKMARKS_STORAGE_KEY = 'getreceipts-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (saved) {
        const parsedBookmarks = JSON.parse(saved);
        // Validate and migrate old bookmarks if needed
        const validBookmarks = parsedBookmarks.map((bookmark: Record<string, unknown>) => ({
          ...bookmark,
          type: bookmark.type || 'claim', // Default old bookmarks to 'claim'
          url: bookmark.url || `/claim/${bookmark.slug}`, // Generate URL if missing
        }));
        setBookmarks(validBookmarks);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarks([]);
    }
  }, []);

  // Save bookmarks to localStorage
  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    try {
      setBookmarks(newBookmarks);
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  // Add a new bookmark
  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `${bookmark.type}-${bookmark.slug}-${Date.now()}`,
      timestamp: Date.now(),
    };

    // Check if bookmark already exists (same type and slug)
    const existingIndex = bookmarks.findIndex(
      b => b.type === bookmark.type && b.slug === bookmark.slug
    );

    if (existingIndex >= 0) {
      // Update existing bookmark
      const updatedBookmarks = [...bookmarks];
      updatedBookmarks[existingIndex] = newBookmark;
      saveBookmarks(updatedBookmarks);
    } else {
      // Add new bookmark
      saveBookmarks([...bookmarks, newBookmark]);
    }
  };

  // Remove a bookmark by ID
  const removeBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id));
  };

  // Remove bookmark by type and slug
  const removeBookmarkByTypeAndSlug = (type: Bookmark['type'], slug: string) => {
    saveBookmarks(bookmarks.filter(b => !(b.type === type && b.slug === slug)));
  };

  // Check if a page is bookmarked
  const isBookmarked = (type: Bookmark['type'], slug: string): boolean => {
    return bookmarks.some(b => b.type === type && b.slug === slug);
  };

  // Get bookmark by type and slug
  const getBookmark = (type: Bookmark['type'], slug: string): Bookmark | undefined => {
    return bookmarks.find(b => b.type === type && b.slug === slug);
  };

  // Get bookmarks by type
  const getBookmarksByType = (type: Bookmark['type']): Bookmark[] => {
    return bookmarks.filter(b => b.type === type);
  };

  // Clear all bookmarks
  const clearAllBookmarks = () => {
    saveBookmarks([]);
  };

  // Export bookmarks as JSON string (for clipboard)
  const exportBookmarks = (): string => {
    return JSON.stringify(bookmarks, null, 2);
  };

  // Import bookmarks from JSON
  const importBookmarks = (jsonString: string): boolean => {
    try {
      const importedBookmarks = JSON.parse(jsonString);
      if (Array.isArray(importedBookmarks)) {
        saveBookmarks(importedBookmarks);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Download bookmarks as JSON file
  const downloadAsJSON = () => {
    downloadBookmarksAsJSON(bookmarks);
  };

  // Download a single bookmark as Markdown
  const downloadBookmarkMD = (bookmark: Bookmark) => {
    downloadBookmarkAsMarkdown(bookmark);
  };

  // Download all bookmarks as individual Markdown files
  const downloadAllAsMarkdown = () => {
    downloadBookmarksAsMarkdownZip(bookmarks);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    removeBookmarkByTypeAndSlug,
    isBookmarked,
    getBookmark,
    getBookmarksByType,
    clearAllBookmarks,
    exportBookmarks,
    importBookmarks,
    downloadAsJSON,
    downloadBookmarkMD,
    downloadAllAsMarkdown,
    totalCount: bookmarks.length,
  };
}
