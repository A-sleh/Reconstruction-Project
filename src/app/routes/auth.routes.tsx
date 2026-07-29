import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";
import Loader from "@/components/shared/Loader";

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

const LoadingFallback = () => <Loader />;

export const authRoutes: RouteObject[] = [
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
];
