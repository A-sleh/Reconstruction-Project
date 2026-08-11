import ApplicationLayout from "@/components/layouts/Main-layout";
import Loader from "@/components/shared/Loader";
import { paths } from "@/config/paths";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";

const HomePage = lazy(() => import("@/features/home/Home.view"));
const LandingPage = lazy(
  () => import("@/features/landing-page/LandingPage.view"),
);

export const sharedRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
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
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },
];
