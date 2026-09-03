import { type ReactNode } from "react";

import {
  Building2,
  CheckCircle2,
  FileText,
  PackageSearch,
  Pencil,
  Wrench,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";

import BuildingPartsReadonlyTree from "../../investor/buildings/components/BuildingPartsReadonlyTree";
import type { ReportBuildingPart } from "../../investor/buildings/utils/buildingPartsHelpers";
import { REPORT_TYPE_I18N_KEY } from "../api/actions";
import type { ReportType } from "../api/types";
import type { NeedSelectionItem } from "./NeedsAndRequestsStep";

interface ReportSummaryStepProps {
  reportType: ReportType;
  attachmentsCount: number;
  onModify: (step: number) => void;
}

const TYPE_META: Record<
  ReportType,
  { color: string; softBg: string; icon: ReactNode }
> = {
  Progress: {
    color: "text-teal-600",
    softBg: "bg-teal-500/10",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  Achievement: {
    color: "text-blue-600",
    softBg: "bg-blue-500/10",
    icon: <Building2 className="h-4 w-4" />,
  },
  NeedsAndRequests: {
    color: "text-violet-600",
    softBg: "bg-violet-500/10",
    icon: <PackageSearch className="h-4 w-4" />,
  },
};

const ReportSummaryStep = ({
  reportType,
  attachmentsCount,
  onModify,
}: ReportSummaryStepProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();

  const title = watch("title") ?? "";
  const description = watch("description") ?? "";
  const reportDate = watch("reportDate") ?? "";
  const buildingParts: ReportBuildingPart[] = watch("buildingParts") ?? [];
  const needsItems: NeedSelectionItem[] = watch("needsItems") ?? [];

  const typeMeta = TYPE_META[reportType];
  const resources = needsItems.filter((n) => n.itemType === "Resource");
  const services = needsItems.filter((n) => n.itemType === "Service");

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-foreground">
          {t("projectReports.create.summary.title", "Report Summary")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t(
            "projectReports.create.summary.subTitle",
            "Review your report before submitting.",
          )}
        </p>
      </div>

      {/* Report type badge */}
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-5 py-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${typeMeta.softBg} ${typeMeta.color}`}
        >
          {typeMeta.icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {t("projectReports.create.summary.reportType", "Report Type")}
          </p>
          <p className={`text-base font-bold ${typeMeta.color}`}>
            {t(
              `projectReports.create.reportType.${REPORT_TYPE_I18N_KEY[reportType]}`,
            )}
          </p>
        </div>
      </div>

      {/* Base info */}
      <SummarySection
        title={t("projectReports.create.summary.baseInfo", "Base Information")}
        onModify={() => onModify(0)}
      >
        <Row
          label={t("projectReports.create.summary.titleValue", "Title")}
          value={title || "—"}
        />
        <Row
          label={t(
            "projectReports.create.summary.descriptionValue",
            "Description",
          )}
          value={description || "—"}
        />
        <Row
          label={t("projectReports.create.summary.dateValue", "Date")}
          value={reportDate || "—"}
        />
        <Row
          label={t("projectReports.create.summary.attachments", "Attachments")}
          value={
            attachmentsCount > 0
              ? String(attachmentsCount)
              : t(
                  "projectReports.create.summary.noAttachments",
                  "No attachments",
                )
          }
        />
      </SummarySection>

      {/* Achievement parts */}
      {reportType === "Achievement" && (
        <SummarySection
          title={t(
            "projectReports.create.summary.buildingParts",
            "Building Parts",
          )}
          onModify={() => onModify(1)}
        >
          {buildingParts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t(
                "projectReports.create.summary.noBuildingParts",
                "No building parts",
              )}
            </p>
          ) : (
            <BuildingPartsReadonlyTree tree={buildingParts} />
          )}
        </SummarySection>
      )}

      {/* Needs & requests */}
      {reportType === "NeedsAndRequests" && (
        <SummarySection
          title={t(
            "projectReports.create.summary.resourceNeeds",
            "Resource Needs",
          )}
          onModify={() => onModify(1)}
        >
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t(
                "projectReports.create.summary.noNeeds",
                "No resource or service needs",
              )}
            </p>
          ) : (
            <ul className="space-y-2">
              {resources.map((r) => (
                <NeedRow key={r.id} item={r} />
              ))}
              {services.map((s) => (
                <NeedRow key={s.id} item={s} />
              ))}
            </ul>
          )}
        </SummarySection>
      )}
    </div>
  );
};

export default ReportSummaryStep;

function SummarySection({
  title,
  children,
  onModify,
}: {
  title: string;
  children: ReactNode;
  onModify: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-border/60 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-bold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          {title}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-primary hover:text-primary"
          onClick={onModify}
        >
          <Pencil className="h-3.5 w-3.5" />
          {t("projectReports.create.summary.modify", "Modify")}
        </Button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function NeedRow({ item }: { item: NeedSelectionItem }) {
  return (
    <li className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-2">
        {item.itemType === "Resource" ? (
          <Wrench className="h-3.5 w-3.5 text-blue-600" />
        ) : (
          <PackageSearch className="h-3.5 w-3.5 text-violet-600" />
        )}
        <span className="text-sm font-medium text-foreground">{item.name}</span>
        <span className="text-[10px] text-muted-foreground">({item.unit})</span>
      </div>
      <Badge variant="outline" className="text-[10px] tabular-nums">
        × {item.quantity} · {(item.price * item.quantity).toLocaleString()}
      </Badge>
    </li>
  );
}
