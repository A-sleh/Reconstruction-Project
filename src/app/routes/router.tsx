import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";

import Loader from "@/components/shared/Loader";
import ApplicationLayout from "@/components/layouts/Main-layout";

// Auth pages
const Login = lazy(() => import("@/features/Auth/Login.view"));
const ProvidorRegisteration = lazy(() => import("@/features/Auth/ProvidorRegisteration.view"));
const EngineerRegisteration = lazy(() => import("@/features/Auth/EngineerRegisteration.view"));
const InvestorRegisteration = lazy(() => import("@/features/Auth/InvestorRegisteration.view"));

// Shared pages 
const HomePage = lazy(() => import("@/features/home/Home.view"));

// Landing page
const LandingPage = lazy(() => import("@/features/landing-page/LandingPage.view"));

// Resource Provider importing pages
const ResourceProvidorWorkSites = lazy(() => import("@/pages/resource-providor/WorkSites.view"));
const ResourceProvidorSiteResources = lazy(() => import("@/pages/resource-providor/SiteResources.view"));
const ResourceProvidorSite = lazy(() => import("@/pages/resource-providor/ResourceProvidorSite.view"));
const ResourceProvidorOrders = lazy(() => import("@/pages/resource-providor/ResourceProvidorOrders.view"));
const ResourceProvidorOrderDetails = lazy(() => import("@/pages/resource-providor/ResourceProvidorOrderDetails.view"));

// Service Porvider importing pages
// Investor importing pages
// Engineers importing pages

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
            <ResourceProvidorWorkSites />
          </Suspense>
        ),
      },
      {
        path: paths.app.resourceProvidor.siteResources.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResourceProvidorSiteResources />
          </Suspense>
        ),
        
      },
      {
        path: paths.app.resourceProvidor.workSite.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResourceProvidorSite />
          </Suspense>
        ),
        
      },
      {
        path: paths.app.resourceProvidor.orders.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResourceProvidorOrders />
          </Suspense>
        ),
        
      },
      {
        path: paths.app.resourceProvidor.orderDetails.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResourceProvidorOrderDetails />
          </Suspense>
        ),
        
      }
    ],

  }
];

export default router;
