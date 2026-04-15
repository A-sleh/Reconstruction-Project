export const paths = {
  auth: {
    register: {
      asRecourseProvider: {
        path: "/auth/register/service-provider",
        getHref: (redirectTo?: string | null | undefined) =>
          `/auth/register/service-provider${
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
} as const;
