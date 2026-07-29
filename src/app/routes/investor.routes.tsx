import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";
import Loader from "@/components/shared/Loader";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";

const Invesort_Buildings_lands = lazy(
  () => import("@/pages/investor/InvestorLandsAndBuildings.view"),
);
const Invesort_Market_Place = lazy(
  () => import("@/pages/investor/MarketPlace.view"),
);
const Invesort_Property_Details = lazy(
  () => import("@/pages/investor/PropertyDetails.view"),
);
const Investor_BasicLandInfo = lazy(
  () => import("@/pages/investor/BasicLandInfo.view"),
);
const Investor_CreateBuilding = lazy(
  () => import("@/pages/investor/CreateBuilding.view"),
);
const Project_List_Property = lazy(
  () => import("@/pages/project/ListProperty.view"),
);
const Project_Work_Site = lazy(
  () => import("@/pages/project/ProjectWorkSite.view"),
);

const LoadingFallback = () => <Loader />;

export const investorRoutes: RouteObject[] = [
  {
    path: paths.app.investor.hisLandsAndBuildings.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.LANDS_VIEW}>
          <Invesort_Buildings_lands />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.investor.marketOfLandsBuildings.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.MARKETPLACE_VIEW}>
          <Invesort_Market_Place />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.investor.propertyVerfication.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.PROPERTY_LIST}>
          <Project_List_Property />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.investor.landBuildingDetails.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.MARKETPLACE_VIEW}>
          <Invesort_Property_Details />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.investor.basicLandInfo.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.LANDS_VIEW}>
          <Investor_BasicLandInfo />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.investor.createBuilding.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.BUILDINGS_CREATE}>
          <Investor_CreateBuilding />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.projects.ListProperty.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.PROPERTY_LIST}>
          <Project_List_Property />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.projects.projectWorkSite.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard allowedPermissions={Permissions.PROJECTS_VIEW}>
          <Project_Work_Site />
        </AuthGuard>
      </Suspense>
    ),
  },
];
