import type { ReportBuildingPart } from "../utils/buildingPartsHelpers";
import { PART_META } from "../utils/buildingPartsMeta";

export function DragOverlayContent({ part }: { part: ReportBuildingPart }) {
  const meta = PART_META[part.buildingPartType];
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border-2 ${meta.accentBorder} ${meta.accentBg} cursor-grabbing px-4 py-3 shadow-2xl backdrop-blur-sm`}
      style={{ width: 280 }}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.accentBg} ${meta.color}`}
      >
        <meta.icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">{part.name}</p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {part.area.toLocaleString()} m²
        </p>
      </div>
    </div>
  );
}