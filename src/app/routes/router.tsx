// import { lazy } from "react";
// import { paths } from "@/config/paths";
// import { RouteObject } from "react-router-dom";
// import LandingPage from "@/features/landing-page/LandingPage.view.tsx";

// // const LandingPage = lazy(
// //   () => import("@/features/landing-page/LandingPage.view.tsx")
// // );

// const router: RouteObject[] = [
//   {
//     path: '/',
//     element: <LandingPage />

//   },
// ];

// export default router;

// import { paths } from "@/config/paths";
import { Login } from "@/features/Auth/login-page/Login.view";
import LandingPage from "@/features/landing-page/LandingPage.view";
import { RouteObject } from "react-router";

const router: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
];

export default router;
