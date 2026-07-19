import ListProperty from "@/pages/project/ListProperty.view";

export const paths = {
  auth: {
    register: {
      path: "/auth/register",
      asProvider: {
        path: "/auth/register/provider",
        getHref: (redirectTo?: string | null | undefined) =>
          `/auth/register/provider${
            redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
          }`,
      },
      asInvestor: {
        path: "/auth/register/investor",
        getHref: (redirectTo?: string | null | undefined) =>
          `/auth/register/investor${
            redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
          }`,
      },
      asEngineer: {
        path: "/auth/register/engineer",
        getHref: (redirectTo?: string | null | undefined) =>
          `/auth/register/engineer${
            redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
          }`,
      },
    },
    login: {
      path: "/auth/login",
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
  },
  landingPage: {
    path: "/",
    getHref: () => "/",
  },
  app: {
    // Shared pathes
    home: {
      path: "/app/home",
      getHref: () => `/app/home`,
    },
    resourceProvidor: {
      profile: {
        path: "/app/resource-providor/profile",
        getHref: () => `/app/resource-providor/profile`,
      },
      statistics: {
        path: "/app/resource-providor/statistics",
        getHref: () => `/app/resource-providor/statistics`,
      },
      orders: {
        path: "/app/resource-providor/orders",
        getHref: () => `/app/resource-providor/orders`,
      },
      orderDetails: {
        path: "/app/resource-providor/orders/:orderId",
        getHref: (orderId: number | string) =>
          `/app/resource-providor/orders/${orderId}`,
      },
      newResources: {
        path: "/app/resource-providor/work-sites/:siteId/new-resources",
        getHref: (siteId: number | string) =>
          `/app/resource-providor/work-sites/${siteId}/new-resources`,
      },
      workSites: {
        path: "/app/resource-providor/work-sites",
        getHref: () => `/app/resource-providor/work-sites`,
      },
      workSite: {
        path: "/app/resource-providor/work-sites/:siteId",
        getHref: (workSiteId: number | string) =>
          `/app/resource-providor/work-sites/${workSiteId}`,
      },
    },
    serviceProvidor: {
      workSites: {
        path: "/app/service-providor/work-sites",
        getHref: () => `/app/service/work-sites`,
      },
      orders: {
        path: "/app/service-providor/orders",
        getHref: () => `/app/service-providor/orders`,
      },
      orderDetails: {
        path: "/app/service-providor/orders/:orderId",
        getHref: (orderId: number | string) =>
          `/app/service-providor/orders/${orderId}`,
      },
      profile: {
        path: "/app/service-providor/profile",
        getHref: () => `/app/service-providor/profile`,
      },
    },
    investor: {
      hisLandsAndBuildings: {
        path: "/app/investor/own-lands-and-building",
        getHref: () => `/app/investor/own-lands-and-building`,
      },
      propertyVerfication: {
        path: "/app/investor/land-building-verfication",
        getHref: () => `/app/investor/land-building-verfication`,
      },
      marketOfLandsBuildings: {
        path: "/app/investor/market-buildings-lands",
        getHref: () => `/app/investor/market-buildings-lands`,
      },
      landBuildingDetails: {
        path: "/app/investor/market-buildings-lands/:id",
        getHref: (id: number) => `/app/investor/market-buildings-lands/${id}`,
      },
      basicLandInfo: {
        path: "/app/investor/basic-land-info",
        getHref: () => `/app/investor/basic-land-info`,
      },
    },
    engineer: {},
    projects: {
      projectWorkSite: {
        path: "/app/project/work-site/:id",
        getHref: (id: number) => `/app/project/work-site/${id}`,
      },
      ListProperty: {
        path: "/app/project/list-property",
        getHref: () => `/app/project/list-property`,
      },
    },
    admin: {
      categories: {
        path: "/app/admin/categories",
        getHref: () => `/app/admin/categories`,
      },
      manageUsers: {
        path: "/app/admin/manage-users",
        getHref: () => `/app/admin/manage-users`,
      },
      support: {
        path: "/app/admin/support",
        getHref: () => `/app/admin/support`,
      },
    },
  },
} as const;
