import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";

import Loader from "@/components/shared/Loader";
import ApplicationLayout from "@/components/layouts/Main-layout";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";

// Auth pages
const Login = lazy(() => import("@/pages/authentication/Login.view"));
const ProvidorRegisteration = lazy(
  () => import("@/pages/authentication/ProvidorRegisteration.view"),
);
const EngineerRegisteration = lazy(
  () => import("@/pages/authentication/EngineerRegisteration.view"),
);
const InvestorRegisteration = lazy(
  () => import("@/pages/authentication/InvestorRegisteration.view"),
);
const RegisterOptions = lazy(
  () => import("@/pages/authentication/RegisterOptions.view"),
);

// Shared pages
const HomePage = lazy(() => import("@/features/home/Home.view"));

// Landing page
const LandingPage = lazy(
  () => import("@/features/landing-page/LandingPage.view"),
);

// Resource Provider importing pages
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

// Investor importing pages
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

// Service Porvider importing pages
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

// Engineers importing pages

// Admin importing pages
const Admin_Categories = lazy(
  () => import("@/pages/admin/Categories.view"),
);
const Admin_ManageUsers = lazy(
  () => import("@/pages/admin/ManageUsersSystem.view"),
);
const Admin_Support = lazy(
  () => import("@/pages/admin/Support.view"),
);

// Fallback component for lazy loading
const LoadingFallback = () => <Loader />;

const router: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "auth",
    children: [
      {
        path: paths.auth.login.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: paths.auth.register.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterOptions />
          </Suspense>
        ),
      },
      {
        path: paths.auth.register.asProvider.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProvidorRegisteration />
          </Suspense>
        ),
      },
      {
        path: paths.auth.register.asInvestor.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <InvestorRegisteration />
          </Suspense>
        ),
      },
      {
        path: paths.auth.register.asEngineer.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <EngineerRegisteration />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "app",
    element: <ApplicationLayout />,
    children: [
      // Home page route
      {
        path: paths.app.home.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      // Resource Providor routes
      {
        path: paths.app.resourceProvidor.workSites.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.WORK_SITES_VIEW}>
              <ResourceProvidor_WorkSites />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.resourceProvidor.workSite.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.WORK_SITES_VIEW}>
              <ResourceProvidor_Site />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.resourceProvidor.profile.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
              <ResourceProvidor_Profile />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.resourceProvidor.statistics.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.STATISTICS_VIEW}>
              <ResourceProvidor_Statistics />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.resourceProvidor.orders.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.ORDERS_VIEW}>
              <ResourceProvidor_Orders />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.resourceProvidor.orderDetails.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.ORDERS_VIEW}>
              <ResourceProvidor_OrderDetails />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.resourceProvidor.newResources.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.RESOURCES_ADD}>
              <ResourceProvidor_NewResources />
            </AuthGuard>
          </Suspense>
        ),
      },
      // Service provider
      {
        path: paths.app.serviceProvidor.workSites.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.WORK_SITES_VIEW}>
              <ServiceProvidor_WorkSites />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.serviceProvidor.orders.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.ORDERS_VIEW}>
              <ServiceProvidor_Orders />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.serviceProvidor.orderDetails.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.ORDERS_VIEW}>
              <ServiceProvidor_OrderDetails />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.serviceProvidor.profile.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard allowedPermissions={Permissions.PROFILE_VIEW}>
              <ServiceProvidor_Profile />
            </AuthGuard>
          </Suspense>
        ),
      },

      // Investor
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
      // Admin routes
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
    ],
  },
];

export default router;
