import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

const EmptyUsersState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted/60">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">
          {t("systemUsers.table.empty")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("systemUsers.table.emptyHint", "Try adjusting your search or filters")}
        </p>
      </div>
    </div>
  );
};

export default EmptyUsersState;
