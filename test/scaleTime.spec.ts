import { realTime, resetTime, scaleTime } from "../src";

describe("scaleTime", () => {
  afterEach(() => resetTime());

  it("should scale properly", async () => {
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

    expect(actualDiff).toBeLessThan(scaledDiff)

    const scale = scaledDiff / actualDiff;
    expect(scale).toBeCloseTo(2, 1);
  });
});
