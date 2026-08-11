import Loader from "@/components/shared/Loader";
import { paths } from "@/config/paths";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";

const ResourceProvidor_WorkSites = lazy(
  () => import("@/pages/resource-providor/WorkSites.view"),
);
const ResourceProvidor_Site = lazy(
  () => import("@/pages/resource-providor/WorkSiteDetails"),
);
const ResourceProvidor_Orders = lazy(
  () => import("@/pages/resource-providor/Orders.view"),
);
const ResourceProvidor_OrderDetails = lazy(
  () => import("@/pages/resource-providor/OrderDetails.view"),
);
const ResourceProvidor_NewResources = lazy(
  () => import("@/pages/resource-providor/AddWorkSiteResources.view"),
);
const ResourceProvidor_Profile = lazy(
  () => import("@/pages/resource-providor/Profile.view"),
);
const ResourceProvidor_Statistics = lazy(
  () => import("@/pages/resource-providor/Statistics.view"),
);

export const resourceProviderRoutes: RouteObject[] = [
  {
    path: paths.app.resourceProvidor.workSites.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.WORK_SITES_VIEW}>
          <ResourceProvidor_WorkSites />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.resourceProvidor.workSite.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.WORK_SITES_VIEW}>
          <ResourceProvidor_Site />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.resourceProvidor.profile.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
          <ResourceProvidor_Profile />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.resourceProvidor.statistics.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.STATISTICS_VIEW}>
          <ResourceProvidor_Statistics />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.resourceProvidor.orders.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.ORDERS_VIEW}>
          <ResourceProvidor_Orders />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.resourceProvidor.orderDetails.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.ORDERS_VIEW}>
          <ResourceProvidor_OrderDetails />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.resourceProvidor.newResources.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.RESOURCES_ADD}>
          <ResourceProvidor_NewResources />
        </AuthGuard>
      </Suspense>
    ),
  },
];
