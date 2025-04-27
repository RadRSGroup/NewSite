import React, { useEffect, useRef } from 'react';

interface CanvasContainerProps {
  id?: string;
}

/**
 * CanvasContainer component - creates a container for Three.js particles
 * This is needed to provide a mount point for Three.js to render its canvas
 */
export default function CanvasContainer({ id = 'canvas-container' }: CanvasContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This component just provides a container element
    // The actual particle effect is handled by the legacy scripts loaded in layout.tsx
    
    // If needed, we could initialize Three.js here in the future
    // For now, we're letting the legacy scripts handle it
    
    return () => {
      // Cleanup if needed when component unmounts
    };
  }, []);

  return (
    <div
      id={id}
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        transform: 'perspective(5000px) rotateX(25deg) scale(1.0)',
        transformStyle: 'preserve-3d',
      }}
    />
  );
} 