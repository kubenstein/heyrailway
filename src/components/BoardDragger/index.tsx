import React, { useState, useRef, useEffect } from 'react';
import { Point } from '../../lib/types';
import styles from './BoardDragger.module.css';

interface BoardDraggerProps {
  onBoardMove: (delta: Point) => void;
  currentScale: number;
  onScaleChange: (newScale: number) => void;
}

export default function BoardDragger({
  onBoardMove,
  currentScale,
  onScaleChange,
}: BoardDraggerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef<Point>({ x: 0, y: 0 });
  const lastPos = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onBoardMove({ x: deltaX, y: deltaY });
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onBoardMove]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, currentScale * zoomFactor));
    onScaleChange(newScale);
  };

  return (
    <div
      className={styles.boardDrag}
      onMouseDown={onMouseDown}
      onWheel={onWheel}
    />
  );
}
