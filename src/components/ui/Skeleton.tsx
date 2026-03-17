// Skeleton loader components for loading states
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-surface-hover rounded ${className}`}
    />
  );
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border-subtle/30 bg-black/40 p-6 flex flex-col gap-3">
      <SkeletonBlock className="h-4 w-1/3 mb-2" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock key={i} className={`h-3 ${i % 2 === 0 ? "w-full" : "w-4/5"}`} />
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-border-subtle/30">
      <SkeletonBlock className="h-5 w-10" />
      <SkeletonBlock className="h-5 flex-1" />
      <SkeletonBlock className="h-5 w-16" />
    </div>
  );
}
