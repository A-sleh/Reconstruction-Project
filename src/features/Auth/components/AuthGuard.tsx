import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import { useCan } from "@/hooks/useCan";
import { paths } from "@/config/paths";
import type { Permission } from "@/lib/permissions";
import type { Role } from "@/types";

interface AuthGuardProps {
  /** @deprecated Use `allowedPermissions` instead. */
  allowedRoles?: Role[];
  /** Permission(s) required — user needs ALL listed. */
  allowedPermissions?: Permission | Permission[];
  children: React.ReactNode;
}

function getFallbackPath(role: Role | null): string {
  switch (role) {
    case "Provider":
      return paths.app.resourceProvidor.profile.path;
    case "Investor":
      return paths.app.investor.hisLandsAndBuildings.path;
    case "Admin":
      return paths.app.admin.manageUsers.path;
    default:
      return paths.auth.login.path;
  }
}

const AuthGuard = ({ allowedRoles, allowedPermissions, children }: AuthGuardProps) => {
  const { isAuthenticated, role } = useAuthStore((s) => s);
  const can = useCan();
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

  if (allowedPermissions) {
    const perms = Array.isArray(allowedPermissions)
      ? allowedPermissions
      : [allowedPermissions];
    const hasPermission = perms.every((p) => can(p));

    if (!hasPermission) {
      return <Navigate to={getFallbackPath(role)} replace />;
    }
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={getFallbackPath(role)} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
