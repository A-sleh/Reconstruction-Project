import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
}

const EmptyState = ({ icon: Icon = Inbox, message }: EmptyStateProps) => {
  return (
    <div className="py-16 text-center">
      <Icon className="h-10 w-10 mx-auto mb-3 text-gray-300" />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
};

export default EmptyState;
