import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
}

const EmptyState = ({ icon: Icon = Inbox, message }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent>
        <div className="py-16 text-center">
          <Icon className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
