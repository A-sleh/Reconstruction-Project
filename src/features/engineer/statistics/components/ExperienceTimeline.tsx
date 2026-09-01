import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/helpers";
import type { EngineerStatistics } from "../api/types";

interface ExperienceTimelineProps {
  stats: EngineerStatistics;
}

const ExperienceTimeline = ({ stats }: ExperienceTimelineProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div>
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">
              {t("engineerStatistics.experience.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("engineerStatistics.experience.subtitle")}
            </p>
          </CardHeader>
          <div className="relative ml-3 border-l-2 border-border pl-6 space-y-6">
            {stats.experience.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white" />
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {exp.jobTitle}
                  </p>
                  {exp.isCurrent && (
                    <Badge className="bg-primary/10 text-primary">
                      {t("engineerStatistics.experience.current")}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {exp.company} · {exp.location}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(exp.startDate, isArabic)} →{" "}
                  {exp.endDate
                    ? formatDate(exp.endDate, isArabic)
                    : formatDate(new Date(), isArabic)}
                </p>
                {exp.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">
              {t("engineerStatistics.skills.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("engineerStatistics.skills.subtitle")}
            </p>
          </CardHeader>

          <div className="flex flex-wrap gap-2">
            {stats.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          {stats.certifications.length > 0 && (
            <div className="mt-4 space-y-2">
              {stats.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {cert.name}
                  </span>
                  <span className="text-muted-foreground">
                    {cert.issuer} · {cert.year}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceTimeline;
