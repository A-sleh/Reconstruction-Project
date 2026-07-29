import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";
import Loader from "@/components/shared/Loader";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";

const Admin_Categories = lazy(
  () => import("@/pages/admin/Categories.view"),
);
const Admin_ManageUsers = lazy(
  () => import("@/pages/admin/ManageUsersSystem.view"),
);
const Admin_Support = lazy(
  () => import("@/pages/admin/Support.view"),
);

const LoadingFallback = () => <Loader />;

export const adminRoutes: RouteObject[] = [
  {
    path: paths.app.admin.categories.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.CATEGORIES_MANAGE}>
          <Admin_Categories />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.admin.manageUsers.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.USERS_MANAGE}>
          <Admin_ManageUsers />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.admin.support.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.SUPPORT_MANAGE}>
          <Admin_Support />
        </AuthGuard>
      </Suspense>
    ),
  },
];
