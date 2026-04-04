import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";

// Auth pages
const Login = lazy(() => import("@/features/Auth/Login.view"));
const Register = lazy(() => import("@/features/Auth/Register.view"));

// Landing page
const LandingPage = lazy(() => import("@/features/landing-page/LandingPage.view"));

const LoadingFallback = () => <div>Loading...</div>;

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
            <Register />
          </Suspense>
        ),
      },
    ],
  },
];

export default router;
