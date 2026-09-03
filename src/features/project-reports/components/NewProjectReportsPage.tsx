import { type ReactNode, useMemo, useRef, useState } from "react";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  PackageSearch,
} from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormWizard, {
  type FormWizardStep,
} from "@/components/common/FormWizard";
import { useUploadFile } from "@/features/attachment/api/actions";
import type { AttachmentListHandle } from "@/features/attachment/components/AttachmentList";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import AchievementBuildingPartsStep from "../../investor/buildings/components/AchievementBuildingParts";
import { flattenBuildingParts } from "../../investor/buildings/utils/buildingPartsHelpers";
import {
  REPORT_TYPE_I18N_KEY,
  reportFormSchema,
  type ReportFormValues,
  useCreateAchievementReport,
  useCreateNeedsAndRequestsReport,
  useCreateProgressReport,
} from "../api/actions";
import type { ReportType } from "../api/types";
import BaseRerpotInfo from "./BaseRerpotInfo";
import NeedsAndRequestsStep from "./NeedsAndRequestsStep";
import ReportSummaryStep from "./ReportSummaryStep";

const REPORT_TYPE_OPTIONS: {
  value: ReportType;
  icon: ReactNode;
  color: string;
  softBg: string;
}[] = [
  {
    value: "Progress",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-teal-600",
    softBg: "bg-teal-500/10",
  },
  {
    value: "Achievement",
    icon: <Building2 className="h-5 w-5" />,
    color: "text-blue-600",
    softBg: "bg-blue-500/10",
  },
  {
    value: "NeedsAndRequests",
    icon: <PackageSearch className="h-5 w-5" />,
    color: "text-violet-600",
    softBg: "bg-violet-500/10",
  },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const NewProjectReportsPage = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();

  const [reportType, setReportType] = useState<ReportType>("Progress");
  const [wizardStep, setWizardStep] = useState(0);

  const methods = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      projectId,
      title: "",
      description: "",
      content: "",
      reportDate: todayISO(),
      type: "Progress",
      attachments: [],
      buildingParts: [],
      needsItems: [],
    },
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const { control, handleSubmit, reset } = methods;
  const {
    fields: attachmentFields,
    append: appendAttachment,
    remove: removeAttachment,
  } = useFieldArray({ control, name: "attachments" });

  const attachmentRef = useRef<AttachmentListHandle>(null);
  const { mutate: uploadFile } = useUploadFile();

  const onUpload = (file: File) => {
    uploadFile(file, {
      onSuccess: (res) =>
        appendAttachment({
          id: Number(res.fileId),
          name: res.name,
          description: "",
        }),
    });
  };

  const onRemove = (idx: number) => removeAttachment(idx);

  const { mutate: createProgress, isPending: isProgress } =
    useCreateProgressReport();
  const { mutate: createAchievement, isPending: isAchievement } =
    useCreateAchievementReport();
  const { mutate: createNeeds, isPending: isNeeds } =
    useCreateNeedsAndRequestsReport();
  const isPending = isProgress || isAchievement || isNeeds;

  const steps: FormWizardStep[] = useMemo(() => {
    const base: FormWizardStep = {
      key: "baseInfo",
      label: t("projectReports.create.steps.baseInfo", "Base Information"),
      fields: ["title", "description", "content"],
    };
    const summary: FormWizardStep = {
      key: "summary",
      label: t("projectReports.create.steps.summary", "Summary"),
      fields: [],
    };
    if (reportType === "Progress") return [base, summary];
    if (reportType === "Achievement") {
      return [
        base,
        {
          key: "achievement",
          label: t(
            "projectReports.create.steps.achievement",
            "Achievement Parts",
          ),
          fields: [],
        },
        summary,
      ];
    }
    return [
      base,
      {
        key: "needs",
        label: t("projectReports.create.steps.needs", "Needs & Requests"),
        fields: [],
      },
      summary,
    ];
  }, [reportType, t]);

  const resetForm = () => {
    reset();
    setWizardStep(0);
  };

  const handleTypeChange = (type: ReportType) => {
    setReportType(type);
    setWizardStep(0);
    if (type !== "Achievement") {
      methods.setValue("buildingParts", []);
    }
    if (type !== "NeedsAndRequests") {
      methods.setValue("needsItems", []);
    }
    methods.setValue("type", type, { shouldValidate: true });
  };

  const onSubmit = (data: ReportFormValues) => {
    const attachments = (data.attachments ?? [])
      .filter((a) => a && a.id)
      .map((a) => ({ id: a.id, description: a.description ?? "" }));

    const base = {
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      content: data.content,
      reportDate: data.reportDate,
      attachments,
      type: data.type,
    };

    if (data.type === "Progress") {
      createProgress(base, {
        onSuccess: () => resetForm,
      });
      return;
    }

    if (data.type === "Achievement") {
      const buildingParts = flattenBuildingParts(data.buildingParts ?? []);
      createAchievement(
        { ...base, buildingParts },
        {
          onSuccess: () => resetForm,
        },
      );
      return;
    }

    const resources = (data.needsItems ?? [])
      .filter((n) => n.itemType === "Resource")
      .map((n) => ({
        resourceId: n.id,
        totalQuantity: n.quantity,
        status: "pending",
      }));
    const services = (data.needsItems ?? [])
      .filter((n) => n.itemType === "Service")
      .map((n) => ({
        serviceId: n.id,
        totalQuantity: n.quantity,
        status: "pending",
      }));
    createNeeds(
      { ...base, resourceNeeds: resources, serviceNeeds: services },
      {
        onSuccess: () => resetForm,
      },
    );
  };

  const renderStep = (step: number) => {
    if (step === 0) {
      return (
        <BaseRerpotInfo
          attachmentRef={attachmentRef}
          attachmentFields={attachmentFields}
          onUpload={onUpload}
          onRemove={onRemove}
        />
      );
    }

    if (reportType === "Progress") {
      return (
        <ReportSummaryStep
          reportType={reportType}
          attachmentsCount={attachmentFields.length}
          onModify={setWizardStep}
        />
      );
    }

    if (reportType === "Achievement") {
      if (step === 1) return <AchievementBuildingPartsStep />;
      return (
        <ReportSummaryStep
          reportType={reportType}
          attachmentsCount={attachmentFields.length}
          onModify={setWizardStep}
        />
      );
    }

    // NeedsAndRequests
    if (step === 1) return <NeedsAndRequestsStep />;
    return (
      <ReportSummaryStep
        reportType={reportType}
        attachmentsCount={attachmentFields.length}
        onModify={setWizardStep}
      />
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("projectReports.create.title", "Create New Report")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(
              "projectReports.create.subTitle",
              "Document progress, achievements, or needs and requests for this project.",
            )}
          </p>
        </div>

        {/* Report type selector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("projectReports.create.reportType.label", "Report Type")}
          </span>
          <div className="flex flex-wrap gap-2">
            {REPORT_TYPE_OPTIONS.map((opt) => {
              const selected = reportType === opt.value;
              return (
                <div key={opt.value} className="group relative">
                  <button
                    type="button"
                    onClick={() => handleTypeChange(opt.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all",
                      selected
                        ? `${opt.softBg} ${opt.color} ring-2 ring-offset-1 ring-primary/20`
                        : "border-border/60 text-muted-foreground hover:border-border",
                    )}
                  >
                    {opt.icon}
                    {t(
                      `projectReports.create.reportType.${REPORT_TYPE_I18N_KEY[opt.value]}`,
                    )}
                  </button>
                  {/* Hover tooltip */}
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-56 -translate-x-1/2 rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground shadow-lg group-hover:block"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <p>
                        {t(
                          `projectReports.create.reportType.${REPORT_TYPE_I18N_KEY[opt.value]}Hint`,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wizard */}
      <FormProvider {...methods}>
        <FormWizard
          key={reportType}
          steps={steps}
          onSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          submitLabel={
            isPending
              ? t("common.loading", "Saving...")
              : t("projectReports.create.submit", "Create Report")
          }
          nextLabel={t("projectReports.create.next", "Next")}
          backLabel={t("projectReports.create.back", "Back")}
          cancelLabel={t("projectReports.create.cancel", "Cancel")}
          onCancel={() => {
            reset();
            setWizardStep(0);
          }}
          step={wizardStep}
          onStepChange={setWizardStep}
          className="rounded-lg border border-border bg-white"
        >
          {renderStep}
        </FormWizard>
      </FormProvider>
    </div>
  );
};

export default NewProjectReportsPage;
