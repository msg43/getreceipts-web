// Graph3DWrapper.tsx - Client-only wrapper for Graph3D to prevent SSR issues

'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { GraphData, Node } from '@/lib/types';
import { isMobileDevice, isLowPowerDevice } from '@/lib/mobile-utils';

// Dynamically import Graph3D with SSR disabled
const Graph3D = dynamic(
  () => import('./Graph3D').then(mod => ({ default: mod.Graph3D })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <div>Loading 3D Graph...</div>
        </div>
      </div>
    )
  }
);

interface Graph3DWrapperProps {
  data: GraphData;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null, node: Node | null) => void;
}

export function Graph3DWrapper(props: Graph3DWrapperProps) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check device capabilities
    const isMobile = isMobileDevice();
    const isLowPower = isLowPowerDevice();
    
    // Skip 3D on low power devices
    if (isLowPower) {
      console.warn('Low power device detected, recommending 2D mode');
      setHasError(true);
      setErrorMessage('For better performance on this device, please use 2D mode');
      return;
    }
    
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error('WebGL not supported');
        setHasError(true);
        setErrorMessage(isMobile ? 
          '3D graphics not supported on this mobile device. Try switching to 2D mode.' : 
          'WebGL not supported by your browser'
        );
      } else if (isMobile) {
        // On mobile, warn about potential performance issues
        console.warn('3D mode on mobile may have performance issues');
      }
    } catch (error) {
      console.error('Error checking WebGL support:', error);
      setHasError(true);
      setErrorMessage('Error initializing graphics');
    }
  }, []);

  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">Initializing...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-full w-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">3D Graphics Error</p>
          <p className="text-sm mt-2">{errorMessage}</p>
          <p className="text-sm text-gray-400 mt-1">Try switching to 2D mode using the toggle</p>
        </div>
      </div>
    );
  }

  // Add error boundary logic
  try {
    return <Graph3D {...props} />;
  } catch (error) {
    console.error('Graph3D rendering error:', error);
    return (
      <div className="h-full w-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">Graph Rendering Error</p>
          <p className="text-sm mt-2">Failed to load 3D visualization</p>
          <p className="text-sm text-gray-400 mt-1">Try switching to 2D mode</p>
        </div>
      </div>
    );
  }
}