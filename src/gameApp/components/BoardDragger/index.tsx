import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Point } from '../../lib/types';

interface BoardDraggerProps {
  boardEl: React.RefObject<HTMLElement | null>;
  onBoardMove: (delta: Point) => void;
  currentScale: number;
  onScaleChange: (newScale: number) => void;
}

export default function BoardDragger({ boardEl, onBoardMove, currentScale, onScaleChange }: BoardDraggerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef<Point>({ x: 0, y: 0 });
  const lastPos = useRef<Point>({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onBoardMove({ x: deltaX, y: deltaY });
    },
    [isDragging, onBoardMove]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  const onMouseDown = useCallback((e: MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(5, currentScale * zoomFactor));
      onScaleChange(newScale);
    },
    [currentScale, onScaleChange]
  );

  useEffect(() => {
    const el = boardEl.current?.parentElement;
    if (!el) return;

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('wheel', onWheel);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('wheel', onWheel);
    };
  }, [boardEl, onMouseDown, onWheel]);

  return null;
}
