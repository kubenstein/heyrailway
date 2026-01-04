import { useState, useEffect, ReactNode, Suspense } from 'react';

interface DelayedSuspenseProps {
  children: ReactNode;
  fallback: ReactNode;
  delay?: number;
}

export default function DelayedSuspense({ children, fallback, delay = 200 }: DelayedSuspenseProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return <Suspense fallback={showFallback ? fallback : null}>{children}</Suspense>;
}
