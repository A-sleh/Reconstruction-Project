import { Calendar } from "lucide-react";

export default function DateField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="flex w-full flex-col sm:max-w-xs">
      <label className="mb-0.5 flex items-center gap-1 text-[11px] text-muted-foreground md:text-sm">
        <Calendar className="h-4 w-4" />
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-200/40 px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}
