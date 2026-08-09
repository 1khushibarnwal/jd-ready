export default function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-background py-24">
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute h-10 w-10 animate-spin rounded-full border-2 border-border border-t-ink" />
      </span>
      <p className="text-sm text-ink-secondary">{label}</p>
    </div>
  );
}
