"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function parseMetricDisplay(target) {
  const s = String(target).trim();
  const m = s.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)([^\d]*)$/);
  if (!m) return null;
  const [, prefix, numPart, suffix] = m;
  const normalizedNumber = numPart.replace(/,/g, "");
  const n = parseFloat(normalizedNumber);
  if (!Number.isFinite(n)) return null;
  const decimalPlaces = normalizedNumber.split(".")[1]?.length || 0;
  return { prefix: prefix || "", n, suffix: suffix ?? "", decimalPlaces };
}

export function roundMetricValue(value, decimalPlaces = 0) {
  const factor = 10 ** decimalPlaces;
  return Math.round(value * factor) / factor;
}

export function formatMetricValue(value, decimalPlaces = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

function useCountUp(endValue, decimalPlaces = 0, duration = 1600) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);

  const run = useCallback(() => {
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setVal(roundMetricValue(endValue * eased, decimalPlaces));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [decimalPlaces, endValue, duration]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return [val, run];
}

export default function AnimatedStatValue({ value }) {
  const parsed = parseMetricDisplay(value);
  const ref = useRef(null);
  const ran = useRef(false);
  const [displayVal, run] = useCountUp(
    parsed?.n ?? 0,
    parsed?.decimalPlaces ?? 0,
    1600
  );

  useEffect(() => {
    if (!parsed) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ran.current) {
          ran.current = true;
          run();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [parsed, run]);

  if (!parsed) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {parsed.prefix}
      {formatMetricValue(displayVal, parsed.decimalPlaces)}
      {parsed.suffix}
    </span>
  );
}
