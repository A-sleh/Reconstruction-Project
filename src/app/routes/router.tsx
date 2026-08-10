import { RouteObject } from "react-router";

import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { engineerRoutes } from "./engineer.routes";
import { investorRoutes } from "./investor.routes";
import { resourceProviderRoutes } from "./resource-provider.routes";
import { serviceProviderRoutes } from "./service-provider.routes";
import { sharedRoutes } from "./shared.routes";

const appRouteIndex = sharedRoutes.findIndex((r) => r.path === "app");

if (appRouteIndex !== -1) {
  const appRoute = sharedRoutes[appRouteIndex];
  appRoute.children = [
    ...(appRoute.children ?? []),
    ...resourceProviderRoutes,
    ...serviceProviderRoutes,
    ...engineerRoutes,
    ...investorRoutes,
    ...adminRoutes,
  ];
}

const router: RouteObject[] = [...sharedRoutes, ...authRoutes];

export default router;
