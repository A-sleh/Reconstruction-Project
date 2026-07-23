import { useTranslation } from "react-i18next";
import { Plus, Trash2, Move, MousePointer2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type EditorTool =
  | "add"
  | "remove-vertex"
  | "move-all"
  | "move-single"
  | null;

type Props = {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  onClearAll: () => void;
};

const TOOLBAR_ITEMS: {
  id: EditorTool;
  icon: typeof Plus;
  labelKey: string;
}[] = [
  { id: "add", icon: Plus, labelKey: "landmap.toolAdd" },
  { id: "remove-vertex", icon: X, labelKey: "landmap.toolRemoveVertex" },
  { id: "move-single", icon: MousePointer2, labelKey: "landmap.toolMoveSingle" },
  { id: "move-all", icon: Move, labelKey: "landmap.toolMoveAll" },
];

function ToolButton({
  icon: Icon,
  label,
  active,
  onClick,
  variant,
}: {
  icon: typeof Plus;
  label: string;
  active?: boolean;
  onClick: () => void;
  variant?: "danger";
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className={cn(
        "relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150",
        active
          ? "bg-[#D7FF3D] text-[#131316]"
          : variant === "danger"
            ? "text-[#A1A1AA] hover:text-[#F87171] hover:bg-white/5"
            : "text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-white/5",
      )}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );
}

export default function LandMapToolbar({
  activeTool,
  onToolChange,
  onClearAll,
}: Props) {
  const { t } = useTranslation();

  return (
    <div
      className="absolute top-3 left-[50%] -translate-x-[50%] z-[1000]"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-0.5 bg-[#131316] border border-[#2A2A2E] rounded-lg p-1 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
        {TOOLBAR_ITEMS.map((item) => (
          <ToolButton
            key={item.id}
            icon={item.icon}
            label={t(item.labelKey)}
            active={activeTool === item.id}
            onClick={() => onToolChange(activeTool === item.id ? null : item.id)}
          />
        ))}

        <div className="w-px h-5 bg-[#2A2A2E] mx-0.5" />

        <ToolButton
          icon={Trash2}
          label={t("landmap.toolClearAll")}
          variant="danger"
          onClick={onClearAll}
        />
      </div>
    </div>
  );
}
