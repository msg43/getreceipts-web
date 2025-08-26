// keyboard.ts - Keyboard shortcut utilities

export const KEYBOARD_SHORTCUTS = {
  NEXT_NODE: 'j',
  PREV_NODE: 'k',
  SEARCH: '/',
  CLEAR_SELECTION: 'Escape',
  TOGGLE_MODE: 'm',
  ZOOM_IN: '+',
  ZOOM_OUT: '-',
  RESET_VIEW: '0',
};

export function setupKeyboardShortcuts(handlers: {
  onNextNode?: () => void;
  onPrevNode?: () => void;
  onSearch?: () => void;
  onClearSelection?: () => void;
  onToggleMode?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
}) {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case KEYBOARD_SHORTCUTS.NEXT_NODE:
        event.preventDefault();
        handlers.onNextNode?.();
        break;
      case KEYBOARD_SHORTCUTS.PREV_NODE:
        event.preventDefault();
        handlers.onPrevNode?.();
        break;
      case KEYBOARD_SHORTCUTS.SEARCH:
        event.preventDefault();
        handlers.onSearch?.();
        break;
      case KEYBOARD_SHORTCUTS.CLEAR_SELECTION:
        event.preventDefault();
        handlers.onClearSelection?.();
        break;
      case KEYBOARD_SHORTCUTS.TOGGLE_MODE:
        event.preventDefault();
        handlers.onToggleMode?.();
        break;
      case KEYBOARD_SHORTCUTS.ZOOM_IN:
        event.preventDefault();
        handlers.onZoomIn?.();
        break;
      case KEYBOARD_SHORTCUTS.ZOOM_OUT:
        event.preventDefault();
        handlers.onZoomOut?.();
        break;
      case KEYBOARD_SHORTCUTS.RESET_VIEW:
        event.preventDefault();
        handlers.onResetView?.();
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}