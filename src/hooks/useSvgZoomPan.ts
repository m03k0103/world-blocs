import { useState, useRef, useCallback } from 'react';

export interface SvgZoomPanOptions {
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  zoomStep?: number;
}

export function useSvgZoomPan({
  minZoom = 0.8,
  maxZoom = 8,
  initialZoom = 1,
  zoomStep = 1.3,
}: SvgZoomPanOptions = {}) {
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // 左クリックのみ
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.2 : 0.83;
      setZoom((prev) => Math.min(Math.max(prev * factor, minZoom), maxZoom));
    },
    [minZoom, maxZoom]
  );

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * zoomStep, maxZoom));
  }, [zoomStep, maxZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / zoomStep, minZoom));
  }, [zoomStep, minZoom]);

  const handleReset = useCallback(() => {
    setZoom(initialZoom);
    setPan({ x: 0, y: 0 });
  }, [initialZoom]);

  return {
    zoom,
    pan,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    handleReset,
  };
}
