import { RouteObject } from "react-router";

import { sharedRoutes } from "./shared.routes";
import { authRoutes } from "./auth.routes";
import { resourceProviderRoutes } from "./resource-provider.routes";
import { serviceProviderRoutes } from "./service-provider.routes";
import { engineerRoutes } from "./engineer.routes";
import { investorRoutes } from "./investor.routes";
import { adminRoutes } from "./admin.routes";

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

const router: RouteObject[] = [
  ...sharedRoutes,
  ...authRoutes,
];

export default router;
