import { resetTime, scaleTime } from "../src";

describe("scaleTime", () => {
  afterEach(() => resetTime());

  it("should scale properly calling new Date()", async () => {
    const scalingFactor = 2;
    const start = new Date().getTime();

    scaleTime(scalingFactor);

    let scaledDate = new Date();
    for (let i = 0; i < 1000; i++) {
      // do something that takes non-zero time
      scaledDate = new Date();
    }

    const scaledTime = scaledDate.getTime();

    // compare scaled to actual
    resetTime();
    const actualTime = new Date().getTime();

    expect(actualTime).toBeLessThan(scaledTime);

    const actualDiff = actualTime - start;
    const scaledDiff = scaledTime - start;

    expect(actualDiff).toBeLessThan(scaledDiff);

    const scale = scaledDiff / actualDiff;
    expect(scale).toBeCloseTo(2, 1);
  });

  it("should scale properly calling Date.now()", async () => {
    const scalingFactor = 2;
    const start = Date.now();

    scaleTime(scalingFactor);

    let scaledTime = Date.now();
    for (let i = 0; i < 10000; i++) {
      // do something that takes non-zero time
      scaledTime = Date.now();
    }

    // compare scaled to actual
    resetTime();
    const actualTime = new Date().getTime();

    expect(actualTime).toBeLessThan(scaledTime);

    const actualDiff = actualTime - start;
    const scaledDiff = scaledTime - start;

    expect(actualDiff).toBeLessThan(scaledDiff);

    const scale = scaledDiff / actualDiff;
    expect(scale).toBeCloseTo(2, 1);
  });

  it("should scale setTimeout", (done) => {
    const start = Date.now();

    const scalingFactor = 10;
    scaleTime(scalingFactor);

    setTimeout(() => {
      resetTime();

      const finish = Date.now();
      const diff = finish - start;

      expect(diff).toBeGreaterThan(90);
      expect(diff).toBeLessThan(110);

      done();
    }, 1000);
  });
});
