import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";

import Loader from "@/components/shared/Loader";

// Auth pages
const Login = lazy(() => import("@/features/Auth/Login.view"));
const ServiceProviderRegister = lazy(() => import("@/features/Auth/ResourceProvider"));
// Landing page
const LandingPage = lazy(() => import("@/features/landing-page/LandingPage.view"));

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
        path: paths.auth.register.asRecourseProvider.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ServiceProviderRegister />
          </Suspense>
        ),
      },
    ],
  },
];

export default router;
