export const paths = {
  auth: {
    register: {
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
    home: {},
    resourceProvidor: {
      progile: {
        path: "/app/resource-providor/profile",
        getHref: () => `/app/resource-providor/profile`,
      },
      orders: {
        path: "/app/resource-providor/order",
        getHref: () => `/app/resource-providor/order`,
      },
      orderDetails: {
        path: "/app/resource-providor/order/:orderId",
        getHref: (orderId: number) => `/app/resource-providor/order/${orderId}`,
      },
      services: {
        path: "/app/resource-providor/services",
        getHref: () => `/app/resource-providor/services`,
      },
    },
    serviceProvidor: {},
    investor:{},
    engineer: {},

  },
} as const;
