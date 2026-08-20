import { describe, expect, it } from "vitest";

import {
  formatMetricValue,
  parseMetricDisplay,
  roundMetricValue,
} from "../../src/features/publicSite/shared/AnimatedStatValue/AnimatedStatValue.jsx";

describe("animated stat values", () => {
  it("preserves compact metric decimal precision", () => {
    const parsed = parseMetricDisplay("1.3M+");

    expect(parsed).toEqual({
      prefix: "",
      n: 1.3,
      suffix: "M+",
      decimalPlaces: 1,
    });
    expect(roundMetricValue(parsed.n, parsed.decimalPlaces)).toBe(1.3);
    expect(formatMetricValue(parsed.n, parsed.decimalPlaces)).toBe("1.3");
  });

  it("keeps whole-number metrics whole", () => {
    const parsed = parseMetricDisplay("457K");

    expect(parsed.decimalPlaces).toBe(0);
    expect(formatMetricValue(parsed.n, parsed.decimalPlaces)).toBe("457");
  });
});
