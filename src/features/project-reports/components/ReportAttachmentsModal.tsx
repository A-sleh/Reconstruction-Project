import { FileText, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import type { ProjectAttachment } from "../api/types";

interface Props {
  attachments: ProjectAttachment[];
  reportTitle: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ReportAttachmentsModal = ({ attachments, reportTitle }: Props) => {
  const { t } = useTranslation();

  return (
    <PopuupLayout
      openKey={`attachments-${reportTitle}`}
      openButton={
        <button
          type="button"
          title={t("projectReports.actions.attachments", "View attachments")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-accent"
        >
          <span className="flex items-center gap-1 text-xs font-medium tabular-nums">
            <FileText className="h-4 w-4" />
            {attachments.length}
          </span>
        </button>
      }
      title={t("projectReports.attachments.title", "Attachments")}
      subTitle={reportTitle}
    >
      <div className="max-h-80 space-y-2 overflow-y-auto px-1 py-2">
        {attachments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("projectReports.attachments.empty", "No attachments.")}
          </p>
        ) : (
          attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between rounded-xl border border-gray-300 p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {att.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(att.fileSize)}
                  </p>
                </div>
              </div>
              <a
                href={att.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))
        )}
      </div>
    </PopuupLayout>
  );
};

export default ReportAttachmentsModal;
