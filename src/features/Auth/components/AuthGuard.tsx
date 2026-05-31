import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import { paths } from "@/config/paths";

interface AuthGuardProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const AuthGuard = ({ allowedRoles, children }: AuthGuardProps) => {
  const { isAuthenticated, role } = useAuthStore((s) => s);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={paths.auth.login.getHref()}
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    switch (role) {
      case "Provider":
        return <Navigate to={paths.app.home.path} replace />;
      default:
        return <Navigate to={paths.auth.login.path} replace />;
    }
  }

  return children;
};

export default AuthGuard;
