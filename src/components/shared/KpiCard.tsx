import { Card, CardContent } from "@/components/ui/card";

export default function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "bg-primary/10 text-primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
            {hint && (
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            )}
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
