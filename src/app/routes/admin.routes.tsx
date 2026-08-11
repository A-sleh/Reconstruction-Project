import Loader from "@/components/shared/Loader";
import { paths } from "@/config/paths";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";

const Admin_Categories = lazy(() => import("@/pages/admin/Categories.view"));
const Admin_ManageUsers = lazy(
  () => import("@/pages/admin/ManageUsersSystem.view"),
);
const Admin_Support = lazy(() => import("@/pages/admin/Support.view"));

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
];
