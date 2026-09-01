import { useTranslation } from "react-i18next";

interface SlaCountdownProps {
  minutes: number;
}

const SlaCountdown = ({ minutes }: SlaCountdownProps) => {
  const { t } = useTranslation();

  const isOverdue = minutes <= 0;

  const text = isOverdue
    ? t("support.agent.sla.overdue")
    : minutes >= 60
      ? Math.floor(minutes / 60) === 1
        ? t("support.agent.sla.hour")
        : t("support.agent.sla.hours", {
            count: Math.floor(minutes / 60),
          })
      : t("support.agent.sla.minutes", { count: minutes });

  const isDanger = isOverdue || minutes <= 30;

  return (
    <span
      className={isDanger ? "font-bold text-rose-600" : "text-muted-foreground"}
    >
      {text}
    </span>
  );
};

export default SlaCountdown;
