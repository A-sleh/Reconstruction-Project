import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import EngineerStatsBar from "@/features/engineer-verification/components/EngineerStatsBar";
import EngineerVerificationTable from "@/features/engineer-verification/components/EngineerVerificationTable";
import { MOCK_ENGINEER_VERIFICATION_STATS } from "@/features/engineer-verification/mock/engineers";

const EngineerVerification = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <section className="container py-6 space-y-6">
        <header className="space-y-2">
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1.5 w-fit"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("engineerVerification.badge")}
          </Badge>
          <h1 className="text-2xl font-bold">
            {t("engineerVerification.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("engineerVerification.subtitle")}
          </p>
        </header>

        <EngineerStatsBar stats={MOCK_ENGINEER_VERIFICATION_STATS} />

        <div dir={isArabic ? "rtl" : "ltr"}>
          <EngineerVerificationTable />
        </div>
      </section>
    </div>
  );
};

export default EngineerVerification;
