'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBookmarks } from '@/lib/useBookmarks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark } from '@/lib/types';

export default function BookmarksPage() {
  const { 
    bookmarks, 
    removeBookmark, 
    clearAllBookmarks, 
    getBookmarksByType,
    exportBookmarks,
    importBookmarks,
    downloadAsJSON,
    downloadBookmarkMD,
    downloadAllAsMarkdown,
    totalCount 
  } = useBookmarks();
  
  const [selectedType, setSelectedType] = useState<Bookmark['type'] | 'all'>('all');
  const [showImportExport, setShowImportExport] = useState(false);
  const [importText, setImportText] = useState('');

  const filteredBookmarks = selectedType === 'all' 
    ? bookmarks 
    : getBookmarksByType(selectedType);

  const typeColors = {
    claim: 'bg-blue-100 text-blue-800',
    tag: 'bg-green-100 text-green-800',
    person: 'bg-purple-100 text-purple-800',
    episode: 'bg-orange-100 text-orange-800',
  };

  const typeIcons = {
    claim: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    tag: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    person: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    episode: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 12.464l-9.192 9.192M12 2.25L2.464 11.786M21.75 12L12.214 21.536" />
      </svg>
    ),
  };

  const handleImport = () => {
    if (importBookmarks(importText)) {
      setImportText('');
      setShowImportExport(false);
      alert('Bookmarks imported successfully!');
    } else {
      alert('Invalid bookmark data. Please check the format.');
    }
  };

  const handleExport = () => {
    const exported = exportBookmarks();
    navigator.clipboard.writeText(exported);
    alert('Bookmarks copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookmarks</h1>
            <p className="text-slate-600">
              {totalCount} bookmark{totalCount !== 1 ? 's' : ''} saved
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImportExport(!showImportExport)}
              className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Import/Export
            </button>
            
            {totalCount > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all bookmarks?')) {
                    clearAllBookmarks();
                  }
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Import/Export Panel */}
        {showImportExport && (
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Import/Export Bookmarks</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Export Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <button
                      onClick={handleExport}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      📋 Copy JSON to Clipboard
                    </button>
                    <p className="text-xs text-slate-500">Copy all bookmarks as JSON text</p>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={downloadAsJSON}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      📄 Download JSON File
                    </button>
                    <p className="text-xs text-slate-500">Download as .json file</p>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={downloadAllAsMarkdown}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      disabled={totalCount === 0}
                    >
                      📝 Download All as Markdown
                    </button>
                    <p className="text-xs text-slate-500">Individual .md files with YAML frontmatter</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Import Bookmarks</h4>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste exported bookmark JSON here..."
                  className="w-full p-3 border rounded-md h-32 text-sm"
                />
                <div className="mt-2">
                  <button
                    onClick={handleImport}
                    disabled={!importText.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-slate-300 transition-colors mr-2"
                  >
                    Import Bookmarks
                  </button>
                  <span className="text-sm text-slate-500">This will merge with existing bookmarks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-gray-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({totalCount})
          </button>
          
          {(['claim', 'tag', 'person', 'episode'] as const).map(type => {
            const count = getBookmarksByType(type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  selectedType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type}s ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No bookmarks yet</h3>
          <p className="text-slate-500 mb-4">
            {selectedType === 'all' 
              ? 'Start bookmarking pages to see them here'
              : `No ${selectedType} bookmarks found`
            }
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Explore Content
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks
            .sort((a, b) => b.timestamp - a.timestamp) // Most recent first
            .map((bookmark) => (
              <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${typeColors[bookmark.type]} text-xs px-2 py-1 flex items-center gap-1`}>
                          {typeIcons[bookmark.type]}
                          {bookmark.type}
                        </Badge>
                      </div>
                      
                      <Link
                        href={bookmark.url}
                        className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors block"
                      >
                        {bookmark.title}
                      </Link>
                      
                      {bookmark.description && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {bookmark.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => downloadBookmarkMD(bookmark)}
                        className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                        title="Download as Markdown"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove bookmark"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      Saved {new Date(bookmark.timestamp).toLocaleDateString()}
                    </span>
                    
                    <Link
                      href={bookmark.url}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Visit →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
