import { useTranslation } from "react-i18next";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  totalLabel?: string;
  total?: number;
  className?: string;
}

export default function LoadMoreButton({
  onLoadMore,
  isLoading = false,
  hasMore = false,
  totalLabel,
  total,
  className,
}: LoadMoreButtonProps) {
  const { t } = useTranslation();

  if (!hasMore && total === undefined) return null;

  return (
    <div className={cn("py-4 space-y-3", className)}>
      {total !== undefined && (
        <p className="text-center text-xs text-muted-foreground">
          {totalLabel ?? t("common.totalItems", { count: total })}
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className={cn(
              "group relative inline-flex items-center gap-2 px-3 py-1.5",
              "text-sm font-medium rounded-full",
              "bg-primary/10 text-primary border border-primary/20",
              "hover:bg-primary/20 hover:border-primary/30",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-[12px]">{t("common.loading")}</span>
              </>
            ) : (
              <>
                <span className="text-[12px]">{t("common.loadMore")}</span>
                <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
