import { lazy, Suspense } from "react";

import { RouteObject } from "react-router";

import Loader from "@/components/shared/Loader";
import { paths } from "@/config/paths";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";

const Admin_Categories = lazy(() => import("@/pages/admin/Categories.view"));
const Admin_ManageUsers = lazy(
  () => import("@/pages/admin/ManageUsersSystem.view"),
);
const Admin_Support = lazy(() => import("@/pages/admin/Support.view"));
const Admin_EngineerVerification = lazy(
  () => import("@/pages/admin/EngineerVerification.view"),
);
const Admin_BuildingVerification = lazy(
  () => import("@/pages/admin/BuildingVerification.view"),
);
const Admin_Statistics = lazy(() => import("@/pages/admin/Statistics.view"));

export const adminRoutes: RouteObject[] = [
  {
    path: paths.app.admin.categories.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.CATEGORIES_MANAGE}>
          <Admin_Categories />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.admin.manageUsers.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.USERS_MANAGE}>
          <Admin_ManageUsers />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.admin.support.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.SUPPORT_MANAGE}>
          <Admin_Support />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.admin.engineerVerification.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.ENGINEERS_VERIFY}>
          <Admin_EngineerVerification />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.admin.buildingVerification.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.BUILDINGS_VERIFY}>
          <Admin_BuildingVerification />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.admin.statistics.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.STATISTICS_VIEW}>
          <Admin_Statistics />
        </AuthGuard>
      </Suspense>
    ),
  },
];
