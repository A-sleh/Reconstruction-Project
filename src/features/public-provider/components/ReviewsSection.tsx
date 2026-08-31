import { Star, User } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";
import StarRating from "@/components/shared/StarRating";
import { formatDate } from "@/lib/helpers";
import type { PublicProviderProfile } from "../api/types";

interface ReviewsSectionProps {
  provider: PublicProviderProfile;
}

export default function ReviewsSection({ provider }: ReviewsSectionProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const average = provider.reviewsCount
    ? Math.round((provider.rating + Number.EPSILON) * 10) / 10
    : 0;

  if (!provider.reviews?.length)
    return <EmptyState message={t("publicProvider.reviews.empty")} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-foreground">{average}</span>
            <Star className="mb-1.5 h-7 w-7 fill-gold text-gold" />
          </div>
          <StarRating value={Math.round(provider.rating)} disabled className="mt-2" />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("publicProvider.reviews.basedOn", {
            count: provider.reviewsCount,
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {provider.reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {review.authorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt, isArabic)}
                  </p>
                </div>
              </div>
              <StarRating value={review.rating} disabled className="[&>button]:h-6 [&>button]:w-6 [&>button]svg:size-4" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {review.comment}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
