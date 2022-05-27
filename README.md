# scaled-time

Speed up - or slowwww down - time in JavaScript.

## Installation

```
npm install scaled-time --save-dev
```

## Environment Support

So far, scaled-time has only been tested in Node via Jest. It probably works in other places, and probably doesn't work in a bunch of places, too.

## Usage

It's strongly discouraged to use this in production code. The use case is for speeding up tests that are dependent on `new Date()` or `Date.now()` and `setTimeout()`.

It also doesn't try to be super precise, but it should be useful in its primary objective.

```
import { resetTime, scaleTime } from "../src";

describe("some tests", () => {
  // HIGHLY RECOMMENDED: return stuff to native JS after each test
  afterEach(() => resetTime());

  it("should scale time via Date", () => {
    const start = new Date().getTime();

    // begin speeding up time by 2x from this point forward
    scaleTime(2);

    // ... one second later in real-life
    const oneSecondLater = new Date().getTime();
    // oneSecondLater - start === ~2000

    // ... another half second later in real-life
    const oneAndAHalfSecondsAfterStart = Date.now();
    // oneAndAHalfSecondsAfterStart - start === ~3000

    // returns to normal after we reset everything
    resetTime();
    const backToReality = Date.now();
    // backToReality - start === ~1500
  });

  // we also expect setTimeout to run faster by roughly our scaling factor
  it("should scale time via setTimeout", (done) => {
    const start = Date.now();

    scaleTime(10);

    const simulatedMilliseconds = 1000;
    const realLifeMilliseconds = 100;

    setTimeout(() => {
      resetTime();

      const finish = Date.now();
      const diff = finish - start;

      // the precision is far from perfect, but it's close enough to help in many cases
      // you can see we're expecting an actual real-world difference of 100ms, despite running setTimeout for 1,000ms
      expect(diff).toBeGreaterThan(realLifeMilliseconds * 0.9);
      expect(diff).toBeLessThan(realLifeMilliseconds * 1.1);

      done();
    }, simulatedMilliseconds);
  });
});
```

## Contributions
Contributions are welcome!

## Future Plans
- Other JS native timer functions (eg. `setInterval`)
- Tests for slowing time down (theoretically should work, but haven't tested, yet)
- Tests for all variations of timer function method signatures (for now have only tested basic `setTimeout` signature)
