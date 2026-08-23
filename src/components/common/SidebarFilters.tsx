import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  reset: () => void;
  activeCount: number;
  children: React.ReactNode;
}

const SidebarFilters: React.FC<Props> = ({ children, reset, activeCount }) => {
  const { t } = useTranslation();

  return (
    <aside className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm sticky top-16 self-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Filter className="h-4 w-4" /> {t("project.filters.title")}
          {activeCount > 0 && (
            <span className="rounded-full bg-primary text-white text-[10px] px-1.5 py-0.5 font-medium">
              {activeCount}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={reset}
          className="h-7 px-2 text-xs"
        >
          <RotateCcw className="h-3 w-3" /> {t("project.filters.resetButton")}
        </Button>
      </div>

      {children}
    </aside>
  );
};

export default SidebarFilters;
