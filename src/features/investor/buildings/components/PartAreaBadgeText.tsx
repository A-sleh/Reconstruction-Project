export function PartAreaBadgeText({ area }: { area: number }) {
  return (
    <div className="shrink-0 text-right">
      <span className="text-lg font-bold tabular-nums text-foreground">
        {area.toLocaleString()}
      </span>
      <span className="ml-0.5 text-xs font-medium text-muted-foreground">
        m²
      </span>
    </div>
  );
}