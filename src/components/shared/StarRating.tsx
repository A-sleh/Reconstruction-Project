import { Star } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
}

const StarRating = ({
  value,
  onChange,
  max = 5,
  disabled = false,
  className,
}: StarRatingProps) => {
  const { t } = useTranslation();
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const shownValue = hoverValue ?? value ?? 0;

  const handleClick = (star: number) => {
    if (disabled || !onChange) return;
    onChange(value === star ? undefined : star);
  };

  return (
    <div
      role="radiogroup"
      aria-label={t("common.starRating", "Star rating")}
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const interactive = !disabled && !!onChange;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={t("common.starCount", "{{count}} stars", {
              count: star,
            })}
            title={t("common.starCount", "{{count}} stars", { count: star })}
            disabled={disabled}
            onMouseEnter={() => interactive && setHoverValue(star)}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleClick(star);
            }}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              interactive && "cursor-pointer",
              disabled && "cursor-default",
            )}
          >
            <Star
              className={cn(
                "size-6 transition-smooth",
                shownValue >= star
                  ? "fill-gold text-gold"
                  : "fill-transparent text-muted-foreground",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
