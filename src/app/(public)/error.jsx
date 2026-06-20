"use client";

import { useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";

export default function PublicError({ error, reset }) {
  useEffect(() => {
    posthog.captureException(error);
    posthog.capture("error_page_viewed", { message: error?.message });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ggg-bg px-ggg text-center">
      <h2 className="m-0 font-bebas text-5xl font-bold uppercase tracking-[0.005em] text-white sm:text-6xl">
        Something <span className="text-ggg-accent">broke</span>
      </h2>
      <p className="max-w-md text-ggg-body-sm text-ggg-muted">
        We couldn&rsquo;t load the page. Try again, or head home.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => { posthog.capture("error_retry_clicked"); reset(); }}
          className="rounded-none bg-ggg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-[0.04em] text-white transition-colors hover:brightness-110"
        >
          Retry
        </button>
        <Link
          href="/"
          className="rounded-none border border-ggg-border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.04em] text-ggg-muted transition-colors hover:border-ggg-border-strong hover:text-white"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
