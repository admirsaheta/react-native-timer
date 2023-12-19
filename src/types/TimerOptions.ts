export interface UseTimerOptions {
  expiryTimestamp?: number;
  onExpire?: () => void;
  autoStart?: boolean;
}
