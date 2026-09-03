import i18n from "i18next";
import z from "zod";

import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ReportType } from "../api/types";
import { MUTATION_KEYS, QUERY_KEYS, ReportController } from "./";
import type {
  CreateAchievementReportPayload,
  CreateNeedsAndRequestsReportPayload,
  CreateProgressReportPayload,
} from "./types";

export const reportFormSchema = z.object({
  projectId: z.number(),
  title: z
    .string()
    .min(1, {
      message: i18n.t(
        "projectReports.create.validation.title_required",
        "Title is required",
      ),
    })
    .max(200, {
      message: i18n.t(
        "projectReports.create.validation.title_too_long",
        "Title must be 200 characters or less",
      ),
    }),
  description: z
    .string()
    .min(1, {
      message: i18n.t(
        "projectReports.create.validation.description_required",
        "Description is required",
      ),
    }),
  content: z
    .string()
    .min(1, {
      message: i18n.t(
        "projectReports.create.validation.content_required",
        "Content is required",
      ),
    }),
  reportDate: z
    .string()
    .min(1, {
      message: i18n.t(
        "projectReports.create.validation.date_required",
        "Report date is required",
      ),
    }),
  type: z.enum(["Progress", "Achievement", "NeedsAndRequests"]),
  attachments: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .default([]),
  buildingParts: z
    .array(
      z.object({
        name: z.string(),
        area: z.number(),
        buildingPartType: z.string(),
        parentBuildingPartId: z.number().optional(),
      }),
    )
    .default([]),
  needsItems: z
    .array(
      z.object({
        itemType: z.enum(["Resource", "Service"]),
        id: z.number(),
        name: z.string(),
        unit: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
    )
    .default([]),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;

export const REPORT_TYPE_I18N_KEY: Record<ReportType, string> = {
  Progress: "progress",
  Achievement: "achievement",
  NeedsAndRequests: "needsAndRequests",
};

// ==========================================
// 1. API Fetchers (private)
// ==========================================

const createProgressReport = async (payload: CreateProgressReportPayload) => {
  const { data } = await ApiInstance.post(
    `/${ReportController.CreateProgress}`,
    payload,
  );
  return data;
};

const createAchievementReport = async (
  payload: CreateAchievementReportPayload,
) => {
  const { data } = await ApiInstance.post(
    `/${ReportController.CreateAchievement}`,
    payload,
  );
  return data;
};

const createNeedsAndRequestsReport = async (
  payload: CreateNeedsAndRequestsReportPayload,
) => {
  const { data } = await ApiInstance.post(
    `/${ReportController.CreateNeedsAndRequests}`,
    payload,
  );
  return data;
};

// ==========================================
// 2. Custom Mutation Hooks
// ==========================================

export const useCreateProgressReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.reports.createProgress(),
    mutationFn: createProgressReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
      successToast(
        i18n.t(
          "projectReports.create.form.success",
          "Report created successfully",
        ),
      );
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
    }) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        i18n.t("projectReports.create.form.error", "Failed to create report");
      errorToast(message);
    },
  });
};

export const useCreateAchievementReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.reports.createAchievement(),
    mutationFn: createAchievementReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
      successToast(
        i18n.t(
          "projectReports.create.form.success",
          "Report created successfully",
        ),
      );
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
    }) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        i18n.t("projectReports.create.form.error", "Failed to create report");
      errorToast(message);
    },
  });
};

export const useCreateNeedsAndRequestsReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.reports.createNeedsAndRequests(),
    mutationFn: createNeedsAndRequestsReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
      successToast(
        i18n.t(
          "projectReports.create.form.success",
          "Report created successfully",
        ),
      );
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
    }) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        i18n.t("projectReports.create.form.error", "Failed to create report");
      errorToast(message);
    },
  });
};
