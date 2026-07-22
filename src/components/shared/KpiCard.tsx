import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "bg-primary/10 text-primary",
  isLoading = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  isLoading?: boolean;
}) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {isLoading ? (
              <>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-2 h-7 w-24" />
                {hint && <Skeleton className="mt-1 h-3 w-16" />}
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-bold">{value}</p>
                {hint && (
                  <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
                )}
              </>
            )}
          </div>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
          >
            {isLoading ? (
              <Skeleton className="h-5 w-5 rounded-full" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
