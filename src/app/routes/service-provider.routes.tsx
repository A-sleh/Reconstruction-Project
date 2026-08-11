import Loader from "@/components/shared/Loader";
import { paths } from "@/config/paths";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";

const ServiceProvidor_WorkSites = lazy(
  () => import("@/pages/service-providor/WorkSites.view"),
);
const ServiceProvidor_Orders = lazy(
  () => import("@/pages/service-providor/Orders.view"),
);
const ServiceProvidor_OrderDetails = lazy(
  () => import("@/pages/service-providor/OrderDetails.view"),
);
const ServiceProvidor_Profile = lazy(
  () => import("@/pages/service-providor/Profile.view"),
);
const ServiceProvidor_Statistics = lazy(
  () => import("@/pages/service-providor/Statistics.view"),
);

export const serviceProviderRoutes: RouteObject[] = [
  {
    path: paths.app.serviceProvidor.workSites.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.WORK_SITES_VIEW}>
          <ServiceProvidor_WorkSites />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.serviceProvidor.orders.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.ORDERS_VIEW}>
          <ServiceProvidor_Orders />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.serviceProvidor.orderDetails.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.ORDERS_VIEW}>
          <ServiceProvidor_OrderDetails />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.serviceProvidor.profile.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
          <ServiceProvidor_Profile />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: paths.app.serviceProvidor.statistics.path,
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard allowedPermissions={Permissions.STATISTICS_VIEW}>
          <ServiceProvidor_Statistics />
        </AuthGuard>
      </Suspense>
    ),
  },
];
