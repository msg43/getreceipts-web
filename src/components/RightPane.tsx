// RightPane.tsx - Node details panel

import React from 'react';
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

      {/* Content */}
      {selectedNode.content && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Content</h3>
          <p className="text-slate-600">{selectedNode.content}</p>
        </div>
      )}

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
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                >
                  {tag}
                </span>
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
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          View Full Claim
        </button>
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