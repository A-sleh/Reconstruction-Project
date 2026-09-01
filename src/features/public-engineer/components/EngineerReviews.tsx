import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";
import StarRating from "@/components/shared/StarRating";
import type { PublicEngineerProfile } from "@/features/engineer/profile/api/types";
import { formatDate } from "@/lib/helpers";

export default function EngineerReviews({
  engineer,
}: {
  engineer: PublicEngineerProfile;
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">
        {t("publicEngineer.reviews.title")}
      </h2>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-5xl font-bold text-foreground">
            {engineer.rating.toFixed(1)}
            <Star className="h-7 w-7 fill-gold text-gold" />
          </span>
          <StarRating value={Math.round(engineer.rating)} disabled />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("publicEngineer.reviews.basedOn", { count: engineer.reviewsCount })}
        </p>
      </div>

      {engineer.reviews.length === 0 ? (
        <EmptyState message={t("publicEngineer.reviews.empty")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {engineer.reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.authorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt, isArabic)}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} disabled />
              </div>
              {review.comment && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
