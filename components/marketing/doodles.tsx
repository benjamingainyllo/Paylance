/**
 * Hand-drawn marks.
 *
 * Deliberately irregular paths — a perfect bezier reads as an icon, which is
 * the opposite of the point. These are decoration, so every one is hidden
 * from assistive tech.
 */

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 18" fill="none" className={className} aria-hidden>
      <path
        d="M2 12c8-9 16 4 24-2s14-9 22-3 13 9 21 4 15-8 24-3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowCurve({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" fill="none" className={className} aria-hidden>
      <path
        d="M6 6c14 22 24 36 46 44"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M36 54c8 0 13-1 16-4M52 50c0 6-1 10-3 13"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 30" fill="none" className={className} aria-hidden>
      <path
        d="M15 2c1.5 8 4.5 11 13 13-8.5 2-11.5 5-13 13-1.5-8-4.5-11-13-13 8.5-2 11.5-5 13-13Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Underline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 12" fill="none" className={className} aria-hidden>
      <path
        d="M3 8c34-5 68-6 101-4s62 5 93 1"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Circled({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" fill="none" className={className} aria-hidden>
      <path
        d="M62 5C31 3 6 15 5 33s26 33 58 32 55-13 54-31C116 18 92 6 62 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
