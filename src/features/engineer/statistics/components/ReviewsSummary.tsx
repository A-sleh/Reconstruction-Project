import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import StarRating from "@/components/shared/StarRating";
import { formatDate } from "@/lib/helpers";
import type { EngineerStatistics } from "../api/types";

interface ReviewsSummaryProps {
  stats: EngineerStatistics;
}

const ReviewsSummary = ({ stats }: ReviewsSummaryProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { rating, reviewsCount } = stats.kpi;
  const reviews = stats.reviews;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("engineerStatistics.reviews.title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("engineerStatistics.reviews.subtitle")}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold text-foreground">
              {rating.toFixed(1)}
            </span>
            <StarRating value={rating} disabled />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("engineerStatistics.reviews.basedOn", { count: reviewsCount })}
          </p>
        </div>

        {reviews.length === 0 ? (
          <EmptyState message={t("engineerStatistics.reviews.empty")} />
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-muted/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {review.authorName}
                  </p>
                  <StarRating value={review.rating} disabled className="[&_button]:h-7 [&_button]:w-7 [&_svg]:size-4" />
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {review.comment}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(review.createdAt, isArabic)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSummary;
