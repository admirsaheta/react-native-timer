import { useState, useCallback, useEffect } from 'react';
import Timer from '../utils/MTimer';
import Validator from '../utils/MValidator';
import useInterval from './useInterval';
import { type UseTimerOptions } from '../types/TimerOptions';
import type { TimeInfo } from '../types/TimeInfo';

const DEFAULT_DELAY: number = 1000;

interface UseTimerResult extends TimeInfo {
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: (newExpiryTimestamp: number, newAutoStart?: boolean) => void;
  isRunning: boolean;
}

const getDelayFromExpiryTimestamp = (
  expiryTimestamp: number | undefined
): number | null => {
  if (!expiryTimestamp || !Validator.expiryTimestamp(expiryTimestamp)) {
    return null;
  }
  const seconds = Timer.getSecondsFromExpiry(expiryTimestamp, false);
  const extraMiliSeconds = Math.floor(seconds - Math.floor(seconds));
  return extraMiliSeconds > 0 ? extraMiliSeconds * 1000 : DEFAULT_DELAY;
};

export const useTimer = ({
  expiryTimestamp: expiry,
  onExpire,
  autoStart = true,
}: UseTimerOptions = {}): UseTimerResult => {
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | undefined>(
    expiry
  );
  const [seconds, setSeconds] = useState<number>(
    expiry ? Timer.getSecondsFromExpiry(expiry, true) : 0
  );
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [didStart, setDidStart] = useState<boolean>(autoStart);
  const [delay, setDelay] = useState<number | null>(
    getDelayFromExpiryTimestamp(expiryTimestamp)
  );

  useEffect(() => {
    if (expiry !== undefined) {
      setDelay(getDelayFromExpiryTimestamp(expiry));
      setDidStart(autoStart);
      setIsRunning(autoStart);
      setExpiryTimestamp(expiry);
      setSeconds(Timer.getSecondsFromExpiry(expiry, false));
    }
  }, [expiry, autoStart]);

  const handleExpire = useCallback(() => {
    if (Validator.onExpire(onExpire)) {
      onExpire && onExpire();
    }
    setIsRunning(false);
    setDelay(null);
  }, [onExpire]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const restart = useCallback(
    (newExpiryTimestamp: number, newAutoStart = true) => {
      setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp));
      setDidStart(newAutoStart);
      setIsRunning(newAutoStart);
      setExpiryTimestamp(newExpiryTimestamp);
      setSeconds(Timer.getSecondsFromExpiry(newExpiryTimestamp, true));
    },
    []
  );

  const resume = useCallback(() => {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + seconds * 1000);
    restart(time.getTime());
  }, [seconds, restart]);

  const start = useCallback(() => {
    if (didStart) {
      setSeconds(Timer.getSecondsFromExpiry(expiryTimestamp || 0, true));
      setIsRunning(true);
    } else {
      resume();
    }
  }, [expiryTimestamp, didStart, resume]);

  useInterval(
    () => {
      if (delay !== DEFAULT_DELAY) {
        setDelay(DEFAULT_DELAY);
      }
      const secondsValue = Timer.getSecondsFromExpiry(
        expiryTimestamp || 0,
        true
      );
      setSeconds(secondsValue);
      if (secondsValue <= 0) {
        handleExpire();
      }
    },
    isRunning ? delay : null
  );

  return {
    ...Timer.getTimeFromSeconds(seconds),
    start,
    pause,
    resume,
    restart,
    isRunning,
  };
};

export default useTimer;
