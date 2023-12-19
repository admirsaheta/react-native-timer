interface ExpiryTimestampValidation {
  expiryTimestamp(expiryTimestamp: any): boolean;
}

interface OnExpireValidation {
  onExpire(onExpire: any): boolean;
}

class MValidate implements ExpiryTimestampValidation, OnExpireValidation {
  expiryTimestamp(expiryTimestamp: any): boolean {
    const isValid = new Date(expiryTimestamp).getTime() > 0;
    if (!isValid) {
      console.warn(
        'react-native-timer: { useTimer } Invalid expiryTimestamp settings',
        expiryTimestamp
      );
    }
    return isValid;
  }

  onExpire(onExpire: any): boolean {
    const isValid = onExpire && typeof onExpire === 'function';
    if (onExpire && !isValid) {
      console.warn(
        'react-native-timer: { useTimer } Invalid onExpire settings function',
        onExpire
      );
    }
    return isValid;
  }
}

const Validator = new MValidate();
export default Validator;
