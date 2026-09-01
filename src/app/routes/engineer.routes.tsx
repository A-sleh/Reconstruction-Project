import Loader from "@/components/shared/Loader";
import { paths } from "@/config/paths";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";

const Engineer_Profile = lazy(() => import("@/pages/engineer/Profile.view"));

const Engineer_OpenProjects = lazy(() => import("@/pages/engineer/OpenProjects.view"));

const Engineers = lazy(() => import("@/pages/engineer/Engineers.view"));

const Engineer_Requests = lazy(() => import("@/pages/engineer/Requests.view"));

const Engineer_Statistics = lazy(() => import("@/pages/engineer/Statistics.view"));

export const engineerRoutes: RouteObject[] = [
  {
    path: paths.app.engineer.openProjects.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
          <Engineer_OpenProjects />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.engineer.profile.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
          <Engineer_Profile />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.engineer.engineers.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
          <Engineers />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.engineer.requests.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
          <Engineer_Requests />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.engineer.statistics.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.STATISTICS_VIEW}>
          <Engineer_Statistics />
        </AuthGuard>
      </Suspense>
    ),
  },
];
