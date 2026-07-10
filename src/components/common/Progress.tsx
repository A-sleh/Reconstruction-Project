import { cn } from "@/lib/utils";

interface ProgressProps {
  rate: number;
  labelDirection?: "above" | "side";
  className?: string;
}

const Progress = ({ rate, labelDirection = "above", className }: ProgressProps) => {
  const clamped = Math.min(Math.max(rate, 0), 100);

  const percentColor =
    clamped >= 100
      ? "text-emerald-600"
      : clamped >= 50
        ? "text-amber-600"
        : "text-gray-500";

  const barColor =
    clamped >= 100
      ? "bg-emerald-500"
      : clamped >= 50
        ? "bg-amber-400"
        : "bg-gray-300";

  const isHorizontal = labelDirection === "side";

  return (
    <div
      className={cn(
        isHorizontal
          ? "flex items-center gap-2"
          : "flex flex-col items-center gap-1.5",
        className,
      )}
    >
      <span className={cn("text-xs font-semibold tabular-nums", percentColor)}>
        {clamped}%
      </span>
      <div className="w-full max-w-40 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            barColor,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
