import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "i18next";
import {
  ReportController,
  QUERY_KEYS,
  MUTATION_KEYS,
} from ".";
import type {
  CreateProgressReportPayload,
  CreateAchievementReportPayload,
  CreateNeedsAndRequestsReportPayload,
} from "./types";

// ==========================================
// 1. API Fetchers (private)
// ==========================================

const createProgressReport = async (
  payload: CreateProgressReportPayload,
) => {
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
        i18n.t("projectReports.create.form.success", "Report created successfully"),
      );
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
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
        i18n.t("projectReports.create.form.success", "Report created successfully"),
      );
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
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
        i18n.t("projectReports.create.form.success", "Report created successfully"),
      );
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        i18n.t("projectReports.create.form.error", "Failed to create report");
      errorToast(message);
    },
  });
};
