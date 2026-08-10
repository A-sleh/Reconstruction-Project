import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";
import Loader from "@/components/shared/Loader";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";

const Engineer_Profile = lazy(
  () => import("@/pages/engineer/Profile.view"),
);

const LoadingFallback = () => <Loader />;

export const engineerRoutes: RouteObject[] = [
  {
    path: paths.app.engineer.profile.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
          <Engineer_Profile />
        </AuthGuard>
      </Suspense>
    ),
  },
];
