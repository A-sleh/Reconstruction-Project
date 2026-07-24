import type { ReactNode } from "react";
import type { Permission } from "@/lib/permissions";
import { useCan } from "@/hooks/useCan";

interface CanProps {
  permission: Permission | Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function Can({ permission, children, fallback = null }: CanProps) {
  const can = useCan();

  const permissions = Array.isArray(permission) ? permission : [permission];
  const isAuthorized = permissions.every((p) => can(p));

  return <>{isAuthorized ? children : fallback}</>;
}
