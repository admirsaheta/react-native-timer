export interface TimeInfo {
  totalSeconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

export interface FormattedTimeInfo {
  seconds: number;
  minutes: number;
  hours: number;
  ampm: string;
}
