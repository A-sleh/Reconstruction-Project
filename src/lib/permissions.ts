import { paths } from "@/config/paths";
import type { Role } from "@/types";

/**
 * All application permissions grouped by domain.
 * Convention: "domain.action" e.g. "work_sites.view", "orders.create"
 */
export const Permissions = {
  // ── Work Sites ──────────────────────────────────────────────
  WORK_SITES_VIEW: "work_sites.view",
  WORK_SITES_CREATE: "work_sites.create",
  WORK_SITES_EDIT: "work_sites.edit",
  WORK_SITES_DELETE: "work_sites.delete",

  // ── Orders ──────────────────────────────────────────────────
  ORDERS_VIEW: "orders.view",
  ORDERS_CREATE: "orders.create",
  ORDERS_MANAGE: "orders.manage",
  ORDERS_CANCEL: "orders.cancel",

  // ── Resources ───────────────────────────────────────────────
  RESOURCES_VIEW: "resources.view",
  RESOURCES_ADD: "resources.add",

  // ── Investor: Lands & Buildings ──────────────────────────────
  LANDS_VIEW: "lands.view",
  LANDS_CREATE: "lands.create",
  BUILDINGS_VIEW: "buildings.view",
  BUILDINGS_CREATE: "buildings.create",

  // ── Marketplace ─────────────────────────────────────────────
  MARKETPLACE_VIEW: "marketplace.view",
  PROPERTY_LIST: "property.list",

  // ── Categories (Admin) ──────────────────────────────────────
  CATEGORIES_MANAGE: "categories.manage",

  // ── System Users (Admin) ────────────────────────────────────
  USERS_MANAGE: "users.manage",

  // ── Verification (Admin) ────────────────────────────────────
  ENGINEERS_VERIFY: "engineers.verify",
  BUILDINGS_VERIFY: "buildings.verify",

  // ── Support (Admin) ─────────────────────────────────────────
  SUPPORT_MANAGE: "support.manage",

  // ── Support Center (shared, non-admin) ──────────────────────
  SUPPORT_VIEW: "support.view",

  // ── Conversations (shared) ──────────────────────────────────
  CONVERSATIONS_VIEW: "conversations.view",

  // ── Profile (shared) ────────────────────────────────────────
  PROFILE_VIEW: "profile.view",
  PROFILE_EDIT: "profile.edit",

  // ── Statistics ──────────────────────────────────────────────
  STATISTICS_VIEW: "statistics.view",

  // ── Home ────────────────────────────────────────────────────
  HOME_VIEW: "home.view",

  // ── Projects ────────────────────────────────────────────────
  PROJECTS_VIEW: "projects.view",
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

/**
 * Maps each role to its array of permissions.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  Provider: [
    Permissions.HOME_VIEW,
    Permissions.WORK_SITES_VIEW,
    Permissions.WORK_SITES_CREATE,
    Permissions.WORK_SITES_EDIT,
    Permissions.ORDERS_VIEW,
    Permissions.ORDERS_CREATE,
    Permissions.RESOURCES_VIEW,
    Permissions.RESOURCES_ADD,
    Permissions.PROFILE_VIEW,
    Permissions.PROFILE_EDIT,
    Permissions.STATISTICS_VIEW,
    Permissions.ORDERS_CANCEL,
    Permissions.PROJECTS_VIEW,
    Permissions.SUPPORT_VIEW,
    Permissions.CONVERSATIONS_VIEW,
  ],
  Investor: [
    Permissions.HOME_VIEW,
    Permissions.LANDS_VIEW,
    Permissions.LANDS_CREATE,
    Permissions.BUILDINGS_VIEW,
    Permissions.BUILDINGS_CREATE,
    Permissions.MARKETPLACE_VIEW,
    Permissions.PROPERTY_LIST,
    Permissions.PROFILE_VIEW,
    Permissions.PROFILE_EDIT,
    Permissions.PROJECTS_VIEW,
    Permissions.SUPPORT_VIEW,
    Permissions.CONVERSATIONS_VIEW,
  ],
  Engineer: [
    Permissions.HOME_VIEW,
    Permissions.PROFILE_VIEW,
    Permissions.PROFILE_EDIT,
    Permissions.STATISTICS_VIEW,
    Permissions.SUPPORT_VIEW,
    Permissions.CONVERSATIONS_VIEW,
  ],
  Admin: [
    Permissions.ORDERS_MANAGE,
    Permissions.CATEGORIES_MANAGE,
    Permissions.USERS_MANAGE,
    Permissions.SUPPORT_MANAGE,
    Permissions.PROFILE_VIEW,
    Permissions.ENGINEERS_VERIFY,
    Permissions.BUILDINGS_VERIFY,
    Permissions.PROJECTS_VIEW,
    Permissions.STATISTICS_VIEW,
    Permissions.CONVERSATIONS_VIEW,
  ],
};

/** Default landing page per role after login */
export const ROLE_DEFAULT_PATH: Record<Role, string> = {
  Provider: paths.app.resourceProvidor.profile.path,
  Investor: paths.app.investor.hisLandsAndBuildings.path,
  Engineer: paths.app.engineer.profile.path,
  Admin: paths.app.admin.manageUsers.path,
};
