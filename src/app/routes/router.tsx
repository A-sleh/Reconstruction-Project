import { paths } from "@/config/paths";
import { RouteObject } from "react-router";
import { Login } from "@/features/Auth/login-page/Login.view";
import LandingPage from "@/features/landing-page/LandingPage.view";
import { AuthLayout } from "@/components/layouts/Auth-layout";

const router: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "auth",
    children: [
      {
        path: paths.auth.login.path,
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: paths.auth.register.path,
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
    ],
  },
];

export default router;
