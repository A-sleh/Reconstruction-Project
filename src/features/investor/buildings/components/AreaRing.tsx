/** Circular usage gauge (child area vs part area). */
export function AreaRing({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const overflow = used > total;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-10 w-10 shrink-0">
        <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/80"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${overflow ? "text-destructive" : "text-primary"}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums text-foreground">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="flex flex-col">
        <span
          className={`text-xs font-bold tabular-nums ${overflow ? "text-destructive" : "text-foreground"}`}
        >
          {used.toLocaleString()} / {total.toLocaleString()} m²
        </span>
      </div>
    </div>
  );
}
