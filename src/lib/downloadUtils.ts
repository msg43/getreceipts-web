// downloadUtils.ts - Utilities for downloading bookmarks as files

import { Bookmark } from '@/lib/types';

/**
 * Downloads a file with the given content and filename
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the object URL
  URL.revokeObjectURL(url);
}

/**
 * Sanitizes a filename by removing/replacing invalid characters
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 200); // Limit length
}

/**
 * Generates YAML frontmatter for a bookmark
 */
export function generateYAMLFrontmatter(bookmark: Bookmark): string {
  const now = new Date().toISOString();
  const savedDate = new Date(bookmark.timestamp).toISOString();
  
  const frontmatter = {
    title: bookmark.title,
    type: bookmark.type,
    slug: bookmark.slug,
    url: bookmark.url,
    bookmarked_at: savedDate,
    exported_at: now,
    source: 'GetReceipts.org',
    ...(bookmark.description && { description: bookmark.description }),
    ...(bookmark.metadata && Object.keys(bookmark.metadata).length > 0 && {
      metadata: bookmark.metadata
    })
  };

  // Convert to YAML format
  const yamlLines = ['---'];
  
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    
    if (typeof value === 'string') {
      // Escape quotes and handle multiline strings
      const escapedValue = value.includes('\n') 
        ? `|\n  ${value.split('\n').join('\n  ')}`
        : `"${value.replace(/"/g, '\\"')}"`;
      yamlLines.push(`${key}: ${escapedValue}`);
    } else if (typeof value === 'object') {
      yamlLines.push(`${key}:`);
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (typeof subValue === 'string') {
          yamlLines.push(`  ${subKey}: "${String(subValue).replace(/"/g, '\\"')}"`);
        } else {
          yamlLines.push(`  ${subKey}: ${subValue}`);
        }
      });
    } else {
      yamlLines.push(`${key}: ${value}`);
    }
  });
  
  yamlLines.push('---');
  return yamlLines.join('\n');
}

/**
 * Generates Markdown content for a bookmark
 */
export function generateMarkdownContent(bookmark: Bookmark): string {
  const yamlFrontmatter = generateYAMLFrontmatter(bookmark);
  
  const content = [
    yamlFrontmatter,
    '',
    `# ${bookmark.title}`,
    '',
    '## Bookmark Details',
    '',
    `**Type:** ${bookmark.type}`,
    `**URL:** [${bookmark.url}](${bookmark.url})`,
    `**Saved:** ${new Date(bookmark.timestamp).toLocaleString()}`,
    ''
  ];

  if (bookmark.description) {
    content.push('## Description', '', bookmark.description, '');
  }

  // Add metadata if available
  if (bookmark.metadata && Object.keys(bookmark.metadata).length > 0) {
    content.push('## Additional Information', '');
    Object.entries(bookmark.metadata).forEach(([key, value]) => {
      content.push(`**${key}:** ${value}`);
    });
    content.push('');
  }

  content.push(
    '---',
    '',
    '*This bookmark was exported from GetReceipts.org*'
  );

  return content.join('\n');
}

/**
 * Downloads all bookmarks as a JSON file
 */
export function downloadBookmarksAsJSON(bookmarks: Bookmark[]) {
  const content = JSON.stringify(bookmarks, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `getreceipts_bookmarks_${timestamp}.json`;
  
  downloadFile(content, filename, 'application/json');
}

/**
 * Downloads a single bookmark as a Markdown file
 */
export function downloadBookmarkAsMarkdown(bookmark: Bookmark) {
  const content = generateMarkdownContent(bookmark);
  const sanitizedTitle = sanitizeFilename(bookmark.title);
  const filename = `${sanitizedTitle}_bookmark.md`;
  
  downloadFile(content, filename, 'text/markdown');
}

/**
 * Downloads all bookmarks as individual Markdown files in a zip
 * Note: This would require a zip library like JSZip
 */
export async function downloadBookmarksAsMarkdownZip(bookmarks: Bookmark[]) {
  // For now, we'll download them one by one
  // In a production app, you might want to use JSZip to create a zip file
  bookmarks.forEach((bookmark, index) => {
    setTimeout(() => {
      downloadBookmarkAsMarkdown(bookmark);
    }, index * 500); // Stagger downloads to avoid browser blocking
  });
}
