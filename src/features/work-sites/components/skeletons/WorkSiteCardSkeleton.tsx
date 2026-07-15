export function WorkSiteCardSkeleton() {
  return (
    <div className="block h-full w-full rounded-xl p-6 shadow-sm border border-gray-300 bg-white border-border/50 bg-card animate-pulse">
      {/* Top Section: Status Badge & Arrow Placeholder */}
      <div className="flex items-center justify-between">
        {/* Status Badge Skeleton */}
        <div className="h-6 w-20 rounded-full bg-muted" />
        {/* Arrow Circle Skeleton */}
        <div className="h-10 w-10 rounded-full bg-muted" />
      </div>

      {/* Middle Section: Logo and Title */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-end gap-4">
          {/* Logo Skeleton */}
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="flex-1 min-w-0">
            {/* Title Skeleton */}
            <div className="mt-3 h-5 w-32 rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Meta Info Lines */}
      <div className="mt-5 space-y-3">
        {/* Address Line Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-muted" /> {/* Icon */}
          <div className="h-4 w-3/4 rounded bg-muted" /> {/* Text */}
        </div>
        {/* Category Line Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-muted" /> {/* Icon */}
          <div className="h-4 w-1/2 rounded bg-muted" /> {/* Text */}
        </div>
      </div>
    </div>
  );
}
