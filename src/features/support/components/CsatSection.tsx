import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/shared/StarRating";

interface CsatSectionProps {
  onSubmit: (rating: number, feedback: string) => void;
}

const CsatSection = ({ onSubmit }: CsatSectionProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating) return;
    onSubmit(rating, feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
        <p className="text-sm font-semibold text-emerald-700">
          {t("support.supportCenter.csat.thanks")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-card">
      <h4 className="text-sm font-semibold text-foreground">
        {t("support.supportCenter.csat.title")}
      </h4>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("support.supportCenter.csat.description")}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {t("support.supportCenter.csat.ratingLabel")}:
        </span>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="mt-3">
        <Textarea
          label={t("support.supportCenter.csat.feedbackPlaceholder")}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-20"
        />
      </div>

      <Button
        className="mt-3"
        onClick={handleSubmit}
        disabled={!rating}
      >
        {t("support.supportCenter.csat.submit")}
      </Button>
    </div>
  );
};

export default CsatSection;
