import type { FormattedTimeInfo, TimeInfo } from "../types/TimeInfo";

interface TimeConversion {
    getTimeFromSeconds(secs: number): TimeInfo;
    getFormattedTimeFromSeconds(totalSeconds: number, format: string): FormattedTimeInfo;
}

interface ExpiryTimeConversion {
    getSecondsFromExpiry(expiry: number, shouldRound: boolean): number;
}

interface PrevTimeConversion {
    getSecondsFromPrevTime(prevTime: number, shouldRound: boolean): number;
}

interface CurrentTimeConversion {
    getSecondsFromTimeNow(): number;
}


export default class MTimer implements TimeConversion, ExpiryTimeConversion, PrevTimeConversion, CurrentTimeConversion {
    getTimeFromSeconds(secs: number): TimeInfo {
        const totalSeconds = Math.ceil(secs);
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        return {
            totalSeconds,
            seconds,
            minutes,
            hours,
            days,
        };
    }

    getSecondsFromExpiry(expiry: number, shouldRound: boolean): number {
        const now = new Date().getTime();
        const milliSecondsDistance = expiry - now;
        if (milliSecondsDistance > 0) {
            const val = milliSecondsDistance / 1000;
            return shouldRound ? Math.round(val) : val;
        }
        return 0;
    }

    getSecondsFromPrevTime(prevTime: number, shouldRound: boolean): number {
        const now = new Date().getTime();
        const milliSecondsDistance = now - prevTime;
        if (milliSecondsDistance > 0) {
            const val = milliSecondsDistance / 1000;
            return shouldRound ? Math.round(val) : val;
        }
        return 0;
    }

    getSecondsFromTimeNow(): number {
        const now = new Date();
        const currentTimestamp = now.getTime();
        const offset = (now.getTimezoneOffset() * 60);
        return (currentTimestamp / 1000) - offset;
    }

    getFormattedTimeFromSeconds(totalSeconds: number, format: string): FormattedTimeInfo {
        const { seconds: secondsValue, minutes, hours } = this.getTimeFromSeconds(totalSeconds);
        let ampm = '';
        let hoursValue = hours;

        if (format === '12-hour') {
            ampm = hours >= 12 ? 'pm' : 'am';
            hoursValue = hours % 12;
        }

        return {
            seconds: secondsValue,
            minutes,
            hours: hoursValue,
            ampm,
        };
    }
}