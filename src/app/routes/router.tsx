import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";

import Loader from "@/components/shared/Loader";

// Auth pages
const Login = lazy(() => import("@/features/Auth/Login.view"));
const ProvidorRegisteration = lazy(() => import("@/features/Auth/ProvidorRegisteration.view"));
const EngineerRegisteration = lazy(() => import("@/features/Auth/EngineerRegisteration.view"));
const InvestorRegisteration = lazy(() => import("@/features/Auth/InvestorRegisteration.view"));

// Landing page
const LandingPage = lazy(() => import("@/features/landing-page/LandingPage.view"));

// Service Porvider importing pages

// Resource Provider importing pages

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
];

export default router;
