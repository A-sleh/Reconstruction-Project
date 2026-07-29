import { lazy, Suspense } from "react";
import { paths } from "@/config/paths";
import { RouteObject } from "react-router";
import Loader from "@/components/shared/Loader";
import ApplicationLayout from "@/components/layouts/Main-layout";

const HomePage = lazy(() => import("@/features/home/Home.view"));
const LandingPage = lazy(
  () => import("@/features/landing-page/LandingPage.view"),
);

const LoadingFallback = () => <Loader />;

export const sharedRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "app",
    element: <ApplicationLayout />,
    children: [
      {
        path: paths.app.home.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },
];
