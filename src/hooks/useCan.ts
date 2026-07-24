import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Imperative permission check hook.
 *
 * Usage:
 *   const can = useCan();
 *   if (can(Permissions.ORDERS_CREATE)) { ... }
 */
export function useCan() {
  return useAuthStore((s) => s.can);
}
