// Uses fixed brand colors (not CSS theme variables) so the logo stays
// visually consistent in both light and dark mode — matching the favicon,
// which is also fixed-color. --ink/--surface swap meaning between themes,
// so using them here previously caused the logo to invert in dark mode.
export default function Logo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="JDReady logo"
    >
      <rect width="40" height="40" rx="10" fill="#1B2559" />
      {/* Document body with a folded top-right corner */}
      <path d="M12 8H24L28 12V32H12V8Z" fill="#FFFFFF" />
      <path d="M24 8L28 12H24V8Z" fill="#B8860B" />
      {/* Checkmark — "approved" / readiness signal */}
      <path
        d="M15 21L19 25L27 15"
        stroke="#B8860B"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
