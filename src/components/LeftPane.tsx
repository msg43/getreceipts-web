// LeftPane.tsx - Filters, show/hide toggles, and bookmarks panel

import React, { useState, useEffect } from 'react';
import type { Filters, Bookmark, Node } from '@/lib/types';

interface LeftPaneProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  selectedNodeId: string | null;
  data?: { nodes: Node[] };
  onNodeSelect?: (nodeId: string | null, node: Node | null) => void;
}

export function LeftPane({ filters, onFiltersChange, selectedNodeId, data, onNodeSelect }: LeftPaneProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>(filters.communities || []);
  
  // Show/Hide states (default to showing all)
  const [showPeople, setShowPeople] = useState(filters.showPeople ?? true);
  const [showSources, setShowSources] = useState(filters.showSources ?? true);
  const [showClaims, setShowClaims] = useState(filters.showClaims ?? true);
  
  // Collapsible states
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [claimsExpanded, setClaimsExpanded] = useState(false);

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
    if (selectedNodeId && data) {
      const selectedNode = data.nodes.find(n => n.id === selectedNodeId);
      if (selectedNode) {
        const newBookmark: Bookmark = {
          id: selectedNodeId,
          slug: selectedNode.slug || `node-${selectedNodeId}`,
          title: selectedNode.title || selectedNode.label || `Node ${selectedNodeId}`,
          timestamp: Date.now(),
        };
        saveBookmarks([...bookmarks, newBookmark]);
      }
    }
  };

  // Remove bookmark
  const removeBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id));
  };

  // Apply filters including show/hide states
  const applyFilters = () => {
    onFiltersChange({
      ...filters,
      search: localSearch,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      communities: selectedCommunities.length > 0 ? selectedCommunities : undefined,
      showPeople,
      showSources,
      showClaims,
    });
  };

  // Clear filters
  const clearFilters = () => {
    setLocalSearch('');
    setSelectedTags([]);
    setSelectedCommunities([]);
    setShowPeople(true);
    setShowSources(true);
    setShowClaims(true);
    onFiltersChange({ limit: filters.limit });
  };

  // Filter nodes by type
  const peopleNodes = data?.nodes.filter(n => n.type === 'person') || [];
  const sourceNodes = data?.nodes.filter(n => n.type === 'source') || [];
  const claimNodes = data?.nodes.filter(n => n.type === 'claim') || [];

  // Update visibility immediately when toggles change
  useEffect(() => {
    onFiltersChange({
      ...filters,
      showPeople,
      showSources,
      showClaims,
    });
  }, [showPeople, showSources, showClaims]);

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Filters & Bookmarks</h2>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search
        </label>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          placeholder="Search by title or content..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bookmarks */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-slate-900">Bookmarks</h3>
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
            <p className="text-sm text-slate-500">No bookmarks yet</p>
          ) : (
            bookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="flex justify-between items-center p-2 bg-slate-50 rounded hover:bg-slate-100 group"
              >
                <span 
                  className="text-sm truncate cursor-pointer flex-1"
                  onClick={() => {
                    const node = data?.nodes.find(n => n.id === bookmark.id);
                    if (node) {
                      onNodeSelect?.(node.id, node);
                    }
                  }}
                >
                  {bookmark.title}
                </span>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-red-500 hover:text-red-600 text-sm ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Show/Hide Controls */}
      <div className="mb-6 pb-6 border-b">
        <h3 className="font-medium text-slate-900 mb-4">Show/Hide</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showPeople}
              onChange={(e) => setShowPeople(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">People</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showSources}
              onChange={(e) => setShowSources(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Sources</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showClaims}
              onChange={(e) => setShowClaims(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Claims</span>
          </label>
        </div>
      </div>

      {/* Collapsible Lists */}
      <div className="space-y-4">
        {/* People List */}
        <div>
          <button
            onClick={() => setPeopleExpanded(!peopleExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-slate-900 hover:text-slate-700"
          >
            <span>People ({peopleNodes.length})</span>
            <svg 
              className={`w-4 h-4 transform transition-transform ${peopleExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {peopleExpanded && (
            <div className="mt-2 max-h-48 overflow-y-auto">
              {peopleNodes.length === 0 ? (
                <p className="text-sm text-slate-500 py-2">No people found</p>
              ) : (
                <div className="space-y-1">
                  {peopleNodes.map(node => (
                    <div
                      key={node.id}
                      className="text-sm text-slate-600 py-1 px-2 hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => onNodeSelect?.(node.id, node)}
                    >
                      {node.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sources List */}
        <div>
          <button
            onClick={() => setSourcesExpanded(!sourcesExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-slate-900 hover:text-slate-700"
          >
            <span>Sources ({sourceNodes.length})</span>
            <svg 
              className={`w-4 h-4 transform transition-transform ${sourcesExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {sourcesExpanded && (
            <div className="mt-2 max-h-48 overflow-y-auto">
              {sourceNodes.length === 0 ? (
                <p className="text-sm text-slate-500 py-2">No sources found</p>
              ) : (
                <div className="space-y-1">
                  {sourceNodes.map(node => (
                    <div
                      key={node.id}
                      className="text-sm text-slate-600 py-1 px-2 hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => onNodeSelect?.(node.id, node)}
                    >
                      {node.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Claims List */}
        <div>
          <button
            onClick={() => setClaimsExpanded(!claimsExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-slate-900 hover:text-slate-700"
          >
            <span>Claims ({claimNodes.length})</span>
            <svg 
              className={`w-4 h-4 transform transition-transform ${claimsExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {claimsExpanded && (
            <div className="mt-2 max-h-48 overflow-y-auto">
              {claimNodes.length === 0 ? (
                <p className="text-sm text-slate-500 py-2">No claims found</p>
              ) : (
                <div className="space-y-1">
                  {claimNodes.map(node => (
                    <div
                      key={node.id}
                      className="text-sm text-slate-600 py-1 px-2 hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => onNodeSelect?.(node.id, node)}
                    >
                      {node.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 pt-6 border-t">
        <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Communities */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
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
      <div className="flex gap-2 mt-6">
        <button
          onClick={applyFilters}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}