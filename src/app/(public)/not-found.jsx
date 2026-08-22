import Link from "next/link";

export default function PublicNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ggg-bg px-ggg py-20 text-center text-ggg-text">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-ggg-accent">
        404 — Resource not found
      </p>
      <h1 className="mt-5 font-bebas text-[clamp(64px,14vw,120px)] font-bold uppercase leading-[0.88] text-white [font-synthesis:weight_style]">
        Lost in the <span className="text-ggg-accent">jungle</span>
      </h1>
      <p className="mt-7 max-w-[560px] text-base font-normal leading-[1.7] text-ggg-muted">
        That page does not exist. Return to the studio overview or browse the games catalog.
      </p>
      <nav aria-label="404 recovery" className="mt-9 flex flex-wrap justify-center gap-3">
        <Link className="bg-ggg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white" href="/">
          Home
        </Link>
        <Link className="border border-ggg-border px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white" href="/games">
          Games
        </Link>
      </nav>
    </main>
  );
}
