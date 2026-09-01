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
  public: {
    providerProfile: {
      path: "/public/provider/:id",
      getHref: (id: number | string) => `/public/provider/${id}`,
    },
    engineerProfile: {
      path: "/public/engineer/:id",
      getHref: (id: number | string) => `/public/engineer/${id}`,
    },
  },
  app: {
    // Shared pathes
    home: {
      path: "/app/home",
      getHref: () => `/app/home`,
    },
    support: {
      path: "/app/support",
      getHref: () => `/app/support`,
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
      statistics: {
        path: "/app/service-providor/statistics",
        getHref: () => `/app/service-providor/statistics`,
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
        getHref: (id: string) => `/app/investor/market-buildings-lands/${id}`,
      },
      basicLandInfo: {
        path: "/app/investor/basic-land-info",
        getHref: () => `/app/investor/basic-land-info`,
      },
      createBuilding: {
        path: "/app/investor/create-building",
        getHref: (landId?: number) =>
          `/app/investor/create-building${landId ? `?landId=${landId}` : ""}`,
      },
    },
    engineer: {
      profile: {
        path: "/app/engineer/profile",
        getHref: () => `/app/engineer/profile`,
      },
      engineers: {
        path: "/app/engineer/engineers",
        getHref: () => `/app/engineer/engineers`,
      },
    },
    projects: {
      path: "/app/investor/projects",
      getHref: () => `/app/investor/projects`,
      projectDetails: {
        path: "/app/investor/projects/:projectId",
        getHref: (projectId: number) => `/app/investor/projects/${projectId}`,
      },
      projectWorkShopDetails: {
        path: "/app/investor/projects/:projectId/workshops/:workShopId",
        getHref: (projectId: number, workShopId: number) =>
          `/app/investor/projects/${projectId}/workshops/${workShopId}`,
      },
      projectReportDetails: {
        path: "/app/investor/projects/:projectId/reports/:reportId",
        getHref: (projectId: number, reportId: string) =>
          `/app/investor/projects/${projectId}/reports/${reportId}`,
      },
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
      engineerVerification: {
        path: "/app/admin/verify-engineers",
        getHref: () => `/app/admin/verify-engineers`,
      },
      buildingVerification: {
        path: "/app/admin/verify-buildings",
        getHref: () => `/app/admin/verify-buildings`,
      },
      statistics: {
        path: "/app/admin/statistics",
        getHref: () => `/app/admin/statistics`,
      },
    },
  },
} as const;
