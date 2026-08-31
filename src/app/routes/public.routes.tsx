import Loader from "@/components/shared/Loader";
import { paths } from "@/config/paths";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";

const PublicProviderProfile = lazy(
  () => import("@/pages/public/PublicProviderProfile"),
);

export const publicRoutes: RouteObject[] = [
  {
    path: paths.public.providerProfile.path,
    element: (
      <Suspense fallback={<Loader />}>
        <PublicProviderProfile />
      </Suspense>
    ),
  },
];
