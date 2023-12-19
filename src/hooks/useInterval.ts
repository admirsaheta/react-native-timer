import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay: number | null) => {
  const callbackRef = useRef<() => void>();
  useEffect(() => {
    callbackRef.current = callback;
  });
  useEffect(() => {
    if (!delay) return () => {};
    const interval = setInterval(() => {
      callbackRef.current && callbackRef.current();
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);
};

export default useInterval;
