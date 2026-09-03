import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/Badge";

import {
  isContainer,
  type ReportBuildingPart,
  sumAreas,
} from "../utils/buildingPartsHelpers";
import { PART_META } from "../utils/buildingPartsMeta";
import { AreaRing } from "./AreaRing";

const BuildingPartsReadonlyTree = ({
  tree,
}: {
  tree: ReportBuildingPart[];
}) => {
  if (tree.length === 0) return null;
  return (
    <div className="space-y-2">
      {tree.map((part) => (
        <ReadonlyCard key={part.id} part={part} />
      ))}
    </div>
  );
};

export default BuildingPartsReadonlyTree;

function ReadonlyCard({
  part,
  depth = 0,
}: {
  part: ReportBuildingPart;
  depth?: number;
}) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const meta = PART_META[part.buildingPartType];
  const children = part.subParts;
  const container = isContainer(part.buildingPartType);
  const childArea = sumAreas(children);

  return (
    <div
      className={`rounded-xl border ${meta.accentBorder} bg-white`}
      style={{ marginInlineStart: depth > 0 ? depth * 18 : 0 }}
    >
      <div className={`flex items-center gap-3 px-4 py-2.5`}>
        {container ? (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground hover:bg-muted"
          >
            <motion.div animate={{ rotate: collapsed ? -90 : 0 }}>
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.div>
          </button>
        ) : (
          <div className="h-6 w-6 shrink-0" />
        )}

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.accentBg} ${meta.color}`}
        >
          {meta.icon && <meta.icon className="h-4 w-4" />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {part.name}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {children.length}{" "}
            {t(
              "projectReports.create.achievement.subPartsCount",
              "sub-part(s)",
              {
                count: children.length,
              },
            )}
          </p>
        </div>

        <Badge
          variant="outline"
          className={`border text-[10px] font-semibold ${meta.accentBorder} ${meta.accentBg} ${meta.color} px-2 py-0`}
        >
          {t(
            `projectReports.create.achievement.types.${part.buildingPartType}`,
            meta.label,
          )}
        </Badge>

        <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
          {part.area.toLocaleString()}{" "}
          <span className="text-[10px] font-medium text-muted-foreground">
            m²
          </span>
        </span>
      </div>

      {container && children.length > 0 && (
        <div className="px-4 pb-2">
          <AreaRing used={childArea} total={part.area} />
        </div>
      )}

      <AnimatePresence initial={false}>
        {container && !collapsed && children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-dashed border-border/40"
          >
            <div className="space-y-1 p-2">
              {children.map((child) => (
                <ReadonlyCard key={child.id} part={child} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
