import ApplicationLayout from "@/components/layouts/Main-layout";
import Loader from "@/components/shared/Loader";
import { paths } from "@/config/paths";
import AuthGuard from "@/features/Auth/components/AuthGuard";
import { Permissions } from "@/lib/permissions";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";

const HomePage = lazy(() => import("@/features/home/Home.view"));
const LandingPage = lazy(
  () => import("@/features/landing-page/LandingPage.view"),
);
const SupportCenterPage = lazy(
  () => import("@/pages/shared/SupportCenter.view"),
);
const ConversationsPage = lazy(
  () => import("@/pages/shared/Conversations.view"),
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
      {
        path: paths.app.support.path,
        element: (
          <Suspense fallback={<Loader />}>
            <AuthGuard allowedPermissions={Permissions.SUPPORT_VIEW}>
              <SupportCenterPage />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: paths.app.conversations.path,
        element: (
          <Suspense fallback={<Loader />}>
            <AuthGuard allowedPermissions={Permissions.CONVERSATIONS_VIEW}>
              <ConversationsPage />
            </AuthGuard>
          </Suspense>
        ),
      },
    ],
  },
];
