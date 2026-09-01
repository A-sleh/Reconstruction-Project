import { useTranslation } from "react-i18next";
import { MessagesSquare } from "lucide-react";

interface Props {
  memberCount: number;
}

const RoomHeader = ({ memberCount }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <MessagesSquare className="h-5 w-5" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">
          {t("projectMessages.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("projectMessages.subtitle")}
        </p>
      </div>
      <span className="ms-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {memberCount} {t("projectMessages.members")}
      </span>
    </div>
  );
};

export default RoomHeader;