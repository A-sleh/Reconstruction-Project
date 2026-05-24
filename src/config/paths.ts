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
        getHref: (orderId: number) => `/app/resource-providor/orders/${orderId}`,
      },
      workSites: {
        path: "/app/resource-providor/work-sites",
        getHref: () => `/app/resource-providor/work-sites`,
      },
      workSite: {
        path: "/app/resource-providor/work-sites/:siteId",
        getHref: (workSiteId: number| string) => `/app/resource-providor/work-sites/${workSiteId}`,
      },
    },
    serviceProvidor: {},
    investor: {},
    engineer: {},
  },
} as const;
