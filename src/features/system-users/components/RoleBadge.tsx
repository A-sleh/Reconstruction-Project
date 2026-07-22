import type { SystemUserRole } from "../api/types";

const ROLE_STYLES: Record<SystemUserRole, string> = {
  Provider: "bg-indigo-500/10 text-indigo-600",
  Investor: "bg-emerald-500/10 text-emerald-600",
  Engineer: "bg-amber-500/10 text-amber-600",
};

const ROLE_LABELS: Record<SystemUserRole, string> = {
  Provider: "مزود موارد",
  Investor: "مستثمر",
  Engineer: "مهندس",
};

interface RoleBadgeProps {
  role: SystemUserRole;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[role] ?? "bg-muted text-muted-foreground"}`}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  );
};

export default RoleBadge;
