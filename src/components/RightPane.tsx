// RightPane.tsx - Node details panel

import React from 'react';
import Link from 'next/link';
import type { Node } from '@/lib/types';

interface RightPaneProps {
  selectedNode: Node | null;
  onClose: () => void;
}

export function RightPane({ selectedNode, onClose }: RightPaneProps) {
  if (!selectedNode) {
    return (
      <div className="h-full bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
        <p className="text-slate-500 text-center">
          Select a node to view details
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-slate-900 pr-8">
          {selectedNode.title}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close details"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Claim Detail Box - Highlighted */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Claim Details</h3>
        
        {/* Content */}
        {selectedNode.content && (
          <div className="mb-4">
            <p className="text-slate-700 leading-relaxed">{selectedNode.content}</p>
          </div>
        )}



        {/* People */}
        {selectedNode.people && selectedNode.people.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              People
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedNode.people.map((person, index) => (
                <a
                  key={index}
                  href={`/people/${encodeURIComponent(person.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''))}`}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm transition-colors cursor-pointer hover:shadow-sm border border-blue-200 hover:border-blue-300"
                  onClick={(e) => {
                    console.log('People link clicked:', person, e);
                  }}
                >
                  {person}
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Episode */}
        {selectedNode.episode && selectedNode.episodeSlug && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Episode
            </h4>
            <a
              href={`/episode/${selectedNode.episodeSlug}`}
              className="inline-flex items-center px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-sm transition-colors cursor-pointer hover:shadow-sm border border-green-200 hover:border-green-300"
              onClick={(e) => {
                console.log('Episode link clicked:', selectedNode.episodeSlug, e);
              }}
            >
              {selectedNode.episode}
              <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        {/* Community */}
        {selectedNode.community !== undefined && (
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">Community</h3>
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: selectedNode.color }}
              />
              <span className="text-sm text-slate-600">
                {getCommunityName(selectedNode.community)}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {selectedNode.tags && selectedNode.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {selectedNode.tags.map(tag => (
                <a
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-xs transition-colors cursor-pointer hover:shadow-sm border border-blue-200 hover:border-blue-300"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Created Date */}
        {selectedNode.createdAt && (
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">Created</h3>
            <p className="text-sm text-slate-600">
              {new Date(selectedNode.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Node ID */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-1">ID</h3>
          <p className="text-xs text-slate-500 font-mono break-all">{selectedNode.id}</p>
        </div>

        {/* Additional Metadata */}
        {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Additional Info</h3>
            <div className="bg-slate-50 rounded p-3">
              <pre className="text-xs text-slate-600 overflow-x-auto">
                {JSON.stringify(selectedNode.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 pt-6 border-t">
        <a 
          href={`/claim/${selectedNode.slug}`}
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center cursor-pointer"
        >
          View Full Claim
        </a>
      </div>
    </div>
  );
}

// Helper function to get community name
function getCommunityName(id: number): string {
  const communities: Record<number, string> = {
    1: 'Technology',
    2: 'Science',
    3: 'Philosophy',
    4: 'Politics',
    5: 'Economics',
  };
  return communities[id] || `Community ${id}`;
}