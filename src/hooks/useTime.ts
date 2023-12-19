import { useState } from 'react';
import Time from '../utils/MTimer';
import useInterval from './useInterval';

const useTime = ({ format }: { format: string }) => {
  const [seconds, setSeconds] = useState(Time.getSecondsFromTimeNow());

  useInterval(() => {
    setSeconds(Time.getSecondsFromTimeNow());
  }, 1000);

  return {
    ...Time.getFormattedTimeFromSeconds(seconds, format),
  };
};

export default useTime;
