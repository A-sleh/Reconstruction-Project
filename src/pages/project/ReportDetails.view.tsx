import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "@/components/shared/Loader";
import ReportDetails from "@/features/project-reports/components/ReportDetails";
import { MOCK_PROJECT_REPORTS } from "@/features/project-reports/mock/mockReports";

const ReportDetailsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reportId } = useParams<{ projectId: string; reportId: string }>();

  const report = MOCK_PROJECT_REPORTS.find((r) => r.id === reportId);

  if (!report) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-destructive/50" />
        <p className="text-sm text-muted-foreground">
          {t("projectReports.details.notFound", "Report not found.")}
        </p>
      </div>
    );
  }

  return (
    <ReportDetails
      report={report}
      onBack={() => navigate(-1)}
    />
  );
};

export default ReportDetailsView;
