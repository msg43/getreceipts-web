// mobile-utils.ts - Utilities for mobile device detection and optimization

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for navigator.hardwareConcurrency (number of CPU cores)
  const cores = navigator.hardwareConcurrency || 1;
  
  // Check for memory if available
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  
  // Consider it low power if:
  // - Less than 4 CPU cores
  // - Less than 4GB memory (if available)
  // - Known low-power devices
  const isLowPower = cores < 4 || (memory && memory < 4);
  
  const isKnownLowPower = /Android.*(?:Go|Lite)|iPhone [5-7]|iPad [1-5]/i.test(navigator.userAgent);
  
  return isLowPower || isKnownLowPower;
}

export function getOptimalGraphMode(): '2D' | '3D' {
  if (isMobileDevice() || isLowPowerDevice()) {
    return '2D';
  }
  return '3D';
}

export function shouldReduceAnimations(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for user preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Reduce animations on mobile or low power devices
  return prefersReducedMotion || isMobileDevice() || isLowPowerDevice();
}

export function getOptimalTimeout(): number {
  // Longer timeouts for mobile devices due to potentially slower connections
  return isMobileDevice() ? 15000 : 10000;
}

export function addMobileOptimizations(): void {
  if (typeof window === 'undefined') return;
  
  // Prevent pinch zoom on specific elements
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });
  
  // Improve touch scrolling
  document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
  
  // Prevent iOS bounce
  document.addEventListener('touchmove', (e) => {
    if ((e.target as HTMLElement).closest('.scrollable')) {
      return; // Allow scrolling in designated areas
    }
    // Prevent default for other areas
  }, { passive: false });
}
