import type { Role } from "@/types";

/** Mock id of the logged-in user (swap with backend user id). */
export const CURRENT_USER_ID = 1;

export const PARTICIPANT_COLORS: Record<Role, string> = {
  Provider: "bg-emerald-500",
  Investor: "bg-primary",
  Engineer: "bg-amber-500",
  Admin: "bg-violet-500",
};

export const ROLE_LABEL_KEYS: Record<Role, string> = {
  Provider: "conversations.roles.provider",
  Investor: "conversations.roles.investor",
  Engineer: "conversations.roles.engineer",
  Admin: "conversations.roles.admin",
};

export function fullName(
  participant: { firstName: string; lastName: string },
): string {
  return `${participant.firstName} ${participant.lastName}`.trim();
}

export function timeAgoMinutes(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
}