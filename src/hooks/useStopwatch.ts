import { useState, useCallback } from 'react';
import Timer from '../utils/MTimer';
import { type TimeInfo } from '../types/TimeInfo';
import useInterval from './useInterval';

interface UseStopwatchOptions {
  autoStart?: boolean;
  offsetTimestamp?: number;
}

interface UseStopwatchResult extends TimeInfo {
  start: () => void;
  pause: () => void;
  reset: (offset?: number, newAutoStart?: boolean) => void;
  isRunning: boolean;
}

export default function useStopwatch({
  autoStart = false,
  offsetTimestamp = 0,
}: UseStopwatchOptions = {}): UseStopwatchResult {
  const [passedSeconds, setPassedSeconds] = useState<number>(
    Timer.getSecondsFromExpiry(offsetTimestamp, true) || 0
  );
  const [prevTime, setPrevTime] = useState<Date>(new Date());
  const [seconds, setSeconds] = useState<number>(
    passedSeconds + Timer.getSecondsFromPrevTime(prevTime.getTime(), true)
  );
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);

  useInterval(
    () => {
      setSeconds(
        passedSeconds + Timer.getSecondsFromPrevTime(prevTime.getTime(), true)
      );
    },
    isRunning ? 1000 : null
  );

  const start = useCallback(() => {
    const newPrevTime = new Date();
    setPrevTime(newPrevTime);
    setIsRunning(true);
    setSeconds(
      passedSeconds + Timer.getSecondsFromPrevTime(newPrevTime.getTime(), true)
    );
  }, [passedSeconds]);

  const pause = useCallback(() => {
    setPassedSeconds(seconds);
    setIsRunning(false);
  }, [seconds]);

  const reset = useCallback((offset = 0, newAutoStart = true) => {
    const newPassedSeconds = Timer.getSecondsFromExpiry(offset, true) || 0;
    const newPrevTime = new Date();
    setPrevTime(newPrevTime);
    setPassedSeconds(newPassedSeconds);
    setIsRunning(newAutoStart);
    setSeconds(
      newPassedSeconds +
        Timer.getSecondsFromPrevTime(newPrevTime.getTime(), true)
    );
  }, []);

  return {
    ...Timer.getTimeFromSeconds(seconds),
    start,
    pause,
    reset,
    isRunning,
  };
}
