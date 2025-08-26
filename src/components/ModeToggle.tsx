// ModeToggle.tsx - Toggle between 2D and 3D graph modes

import React from 'react';
import type { GraphMode } from '@/lib/types';

interface ModeToggleProps {
  mode: GraphMode;
  onModeChange: (mode: GraphMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-1 flex gap-1 z-10">
      <button
        onClick={() => onModeChange('2D')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          mode === '2D'
            ? 'bg-blue-500 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
        aria-label="Switch to 2D view"
      >
        2D
      </button>
      <button
        onClick={() => onModeChange('3D')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          mode === '3D'
            ? 'bg-blue-500 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
        aria-label="Switch to 3D view"
      >
        3D
      </button>
    </div>
  );
}