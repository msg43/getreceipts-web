'use client';

import { useState } from 'react';
import { useBookmarks } from '@/lib/useBookmarks';
import { Bookmark } from '@/lib/types';

interface BookmarkButtonProps {
  type: Bookmark['type'];
  slug: string;
  title: string;
  url: string;
  description?: string;
  metadata?: Bookmark['metadata'];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'full';
}

export function BookmarkButton({
  type,
  slug,
  title,
  url,
  description,
  metadata,
  className = '',
  size = 'md',
  variant = 'icon'
}: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmarkByTypeAndSlug } = useBookmarks();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const bookmarked = isBookmarked(type, slug);

  const handleClick = () => {
    setIsAnimating(true);
    
    if (bookmarked) {
      removeBookmarkByTypeAndSlug(type, slug);
    } else {
      addBookmark({
        type,
        slug,
        title,
        url,
        description,
        metadata,
      });
    }

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 200);
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'p-1.5';
      case 'lg': return 'p-3';
      default: return 'p-2';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-base';
      default: return 'text-sm';
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`
          ${getButtonSize()}
          rounded-full transition-all duration-200
          ${bookmarked 
            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
            : 'bg-gray-100 text-slate-500 hover:bg-slate-200'
          }
          ${isAnimating ? 'scale-110' : 'scale-100'}
          ${className}
        `}
        title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <svg 
          className={`${getIconSize()} transition-colors`} 
          fill={bookmarked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
          />
        </svg>
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        className={`
          ${getTextSize()} font-medium transition-colors duration-200
          ${bookmarked 
            ? 'text-yellow-600 hover:text-yellow-700' 
            : 'text-slate-500 hover:text-slate-700'
          }
          ${className}
        `}
      >
        {bookmarked ? 'Bookmarked' : 'Bookmark'}
      </button>
    );
  }

  // variant === 'full'
  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 ${getButtonSize()} ${getTextSize()}
        rounded-md border transition-all duration-200
        ${bookmarked 
          ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' 
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }
        ${isAnimating ? 'scale-105' : 'scale-100'}
        ${className}
      `}
    >
      <svg 
        className={getIconSize()} 
        fill={bookmarked ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
        />
      </svg>
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
