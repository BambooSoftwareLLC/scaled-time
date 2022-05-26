const realDate = global.Date;
let referenceDate: Date | null = null;
let internalScalingFactor: number = 1;

const buildDate = (date?: any) => {
  if (date) {
    return new realDate(date);
  } else if (referenceDate) {
    // get real milliseconds since reference date
    const actualMilliseconds = new realDate().getTime();
    const referenceMilliseconds = referenceDate.getTime();
    const actualMillisecondsDiff = actualMilliseconds - referenceMilliseconds;

    // scale milliseconds by scaling factor
    const scaledMilliseconds = actualMillisecondsDiff * internalScalingFactor;

    // add scaled milliseconds to reference date
    return new realDate(referenceMilliseconds + scaledMilliseconds);
  } else {
    return new realDate();
  }
};

declare global {
  interface DateConstructor {
    new (...args: number[]): Date;
  }
}

export function scaleTime(scalingFactor: number) {
  resetTime();

  // start with current date as a reference
  referenceDate = new Date();

  // when getting a NEW date or now time, scale it by the provided factor from the reference date
  internalScalingFactor = scalingFactor;

  const newDate = function (...args: number[]) {
    if (args.length > 0) {
      return new realDate(...args);
    }

    return new.target ? buildDate() : buildDate().toString();
  };

  newDate.now = () => buildDate().getTime();
  newDate.UTC = realDate.UTC;
  newDate.parse = realDate.parse;
  newDate.prototype = realDate.prototype;

  global.Date = newDate as any;

  // TODO: how to also advance timers?
  // TODO: Look into Jest mock timers and do something similar? Or re-use what they have?
}

export function realTime(): Date {
  return new realDate();
}

export function resetTime() {
  global.Date = realDate;
}
