import { useTranslation } from "react-i18next";
import { Star, MessageSquareText } from "lucide-react";
import type { PublicEngineerReview } from "../api/types";
import EmptyState from "@/components/common/EmptyState";

interface Props {
  averageRating: number;
  totalReviews: number;
  reviews: PublicEngineerReview[];
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

const ReviewsSection = ({ averageRating, totalReviews, reviews, distribution }: Props) => {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === "ar" ? "ar-SY" : "en-US";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {t("engineerProfile.reviews.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("engineerProfile.reviews.subtitle")}
          </p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="rounded-lg border border-gray-300 bg-white shadow-card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-4xl font-bold text-foreground">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.round(averageRating)
                          ? "fill-current text-gold"
                          : "text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("engineerProfile.reviews.totalReviews", { count: totalReviews })}
                </p>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = distribution[star as 1 | 2 | 3 | 4 | 5];
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-10 shrink-0">
                        {star} ★
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-primary/20">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-6 text-end shrink-0">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-gray-300 bg-white shadow-sm p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-bold shrink-0">
                    {review.authorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {review.authorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.round(review.rating)
                          ? "fill-current text-gold"
                          : "text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={MessageSquareText}
          message={t("engineerProfile.reviews.noReviewsYet")}
        />
      )}
    </section>
  );
};

export default ReviewsSection;
