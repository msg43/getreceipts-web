// LeftPane.tsx - Filters and bookmarks panel

import React, { useState, useEffect } from 'react';
import type { Filters, Bookmark } from '@/lib/types';

interface LeftPaneProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  selectedNodeId: string | null;
}

export function LeftPane({ filters, onFiltersChange, selectedNodeId }: LeftPaneProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>(filters.communities || []);

  // Available options (in real app, fetch from DB)
  const availableTags = ['AI', 'consciousness', 'climate', 'philosophy', 'politics', 'economics', 'quantum', 'privacy'];
  const availableCommunities = [
    { id: 1, name: 'Technology', color: '#3B82F6' },
    { id: 2, name: 'Science', color: '#10B981' },
    { id: 3, name: 'Philosophy', color: '#8B5CF6' },
    { id: 4, name: 'Politics', color: '#EF4444' },
    { id: 5, name: 'Economics', color: '#F59E0B' },
  ];

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('graph-bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  // Save bookmarks to localStorage
  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('graph-bookmarks', JSON.stringify(newBookmarks));
  };

  // Add current selection as bookmark
  const addBookmark = () => {
    if (selectedNodeId) {
      const newBookmark: Bookmark = {
        id: selectedNodeId,
        slug: `node-${selectedNodeId}`,
        title: `Node ${selectedNodeId}`,
        timestamp: Date.now(),
      };
      saveBookmarks([...bookmarks, newBookmark]);
    }
  };

  // Remove bookmark
  const removeBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id));
  };

  // Apply filters
  const applyFilters = () => {
    onFiltersChange({
      ...filters,
      search: localSearch,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      communities: selectedCommunities.length > 0 ? selectedCommunities : undefined,
    });
  };

  // Clear filters
  const clearFilters = () => {
    setLocalSearch('');
    setSelectedTags([]);
    setSelectedCommunities([]);
    onFiltersChange({});
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Filters & Bookmarks</h2>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Claims
        </label>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          placeholder="Search by title or content..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTags(prev =>
                  prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Communities */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Community
        </label>
        <div className="space-y-2">
          {availableCommunities.map(community => (
            <label key={community.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCommunities.includes(community.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCommunities([...selectedCommunities, community.id]);
                  } else {
                    setSelectedCommunities(selectedCommunities.filter(id => id !== community.id));
                  }
                }}
                className="mr-2"
              />
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: community.color }}
              />
              <span className="text-sm">{community.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={applyFilters}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Bookmarks */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Bookmarks</h3>
          {selectedNodeId && (
            <button
              onClick={addBookmark}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              + Add Current
            </button>
          )}
        </div>
        <div className="space-y-2">
          {bookmarks.length === 0 ? (
            <p className="text-sm text-gray-500">No bookmarks yet</p>
          ) : (
            bookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="text-sm truncate">{bookmark.title}</span>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}