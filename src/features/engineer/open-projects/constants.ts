import { EngineeringDiscipline, ProjectScale } from "./api/types";

export const CLOSING_SOON_WINDOW_DAYS = 14;
export const LATEST_POSTED_WINDOW_DAYS = 30;

export const DISCIPLINE_META: Record<
  EngineeringDiscipline,
  { tKey: string; shortKey: string }
> = {
  [EngineeringDiscipline.Structural]: {
    tKey: "openProjects.disciplines.structural",
    shortKey: "openProjects.disciplines.structuralShort",
  },
  [EngineeringDiscipline.Civil]: {
    tKey: "openProjects.disciplines.civil",
    shortKey: "openProjects.disciplines.civilShort",
  },
  [EngineeringDiscipline.Architectural]: {
    tKey: "openProjects.disciplines.architectural",
    shortKey: "openProjects.disciplines.architecturalShort",
  },
  [EngineeringDiscipline.Electrical]: {
    tKey: "openProjects.disciplines.electrical",
    shortKey: "openProjects.disciplines.electricalShort",
  },
  [EngineeringDiscipline.Mechanical]: {
    tKey: "openProjects.disciplines.mechanical",
    shortKey: "openProjects.disciplines.mechanicalShort",
  },
  [EngineeringDiscipline.Geotechnical]: {
    tKey: "openProjects.disciplines.geotechnical",
    shortKey: "openProjects.disciplines.geotechnicalShort",
  },
  [EngineeringDiscipline.Surveying]: {
    tKey: "openProjects.disciplines.surveying",
    shortKey: "openProjects.disciplines.surveyingShort",
  },
  [EngineeringDiscipline.ProjectManagement]: {
    tKey: "openProjects.disciplines.projectManagement",
    shortKey: "openProjects.disciplines.projectManagementShort",
  },
};

export const SCALE_META: Record<
  ProjectScale,
  { tKey: string; color: string }
> = {
  [ProjectScale.Small]: {
    tKey: "openProjects.scales.small",
    color: "bg-sky-100 text-sky-700 border-sky-200",
  },
  [ProjectScale.Mid]: {
    tKey: "openProjects.scales.mid",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  [ProjectScale.Enterprise]: {
    tKey: "openProjects.scales.enterprise",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
};

export const SECTION_KEYS = [
  "all",
  "latest",
  "closing-soon",
  "enterprise",
  "mid",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const MAX_DURATION_WEEKS = 104;

export const DEADLINE_OPTIONS = [
  { value: 0, tKey: "openProjects.filters.deadlineAny" },
  { value: 7, tKey: "openProjects.filters.deadlineWeek" },
  { value: 14, tKey: "openProjects.filters.deadlineTwoWeeks" },
  { value: 30, tKey: "openProjects.filters.deadlineMonth" },
];

export function daysUntil(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isWithinDays(iso: string, days: number): boolean {
  const remaining = daysUntil(iso);
  return remaining >= 0 && remaining <= days;
}

export function daysSince(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  const diffMs = now.getTime() - target.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function durationLabel(weeks: number): string {
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(weeks / 4);
  const remainingWeeks = weeks % 4;
  if (remainingWeeks === 0) return `${months}mo`;
  return `${months}mo ${remainingWeeks}w`;
}

export function deadlineStatus(
  iso: string,
): "expired" | "urgent" | "normal" {
  const remaining = daysUntil(iso);
  if (remaining < 0) return "expired";
  if (remaining <= CLOSING_SOON_WINDOW_DAYS) return "urgent";
  return "normal";
}
