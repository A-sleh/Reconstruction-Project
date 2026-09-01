import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  open: "hsl(210 80% 50%)",
  inProgress: "hsl(38 92% 50%)",
  pendingCustomer: "hsl(25 95% 53%)",
  resolved: "hsl(142 71% 45%)",
  closed: "hsl(215 16% 47%)",
};

interface SupportStatusPieProps {
  open: number;
  inProgress: number;
  pendingCustomer: number;
  resolved: number;
  closed: number;
}

const SupportStatusPie = ({
  open,
  inProgress,
  pendingCustomer,
  resolved,
  closed,
}: SupportStatusPieProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const data = [
    { name: t("support.agent.status.open"), value: open, key: "open" },
    {
      name: t("support.agent.status.in_progress"),
      value: inProgress,
      key: "inProgress",
    },
    {
      name: t("support.agent.status.pending_customer"),
      value: pendingCustomer,
      key: "pendingCustomer",
    },
    {
      name: t("support.agent.status.resolved"),
      value: resolved,
      key: "resolved",
    },
    { name: t("support.agent.status.closed"), value: closed, key: "closed" },
  ];

  const total = open + inProgress + pendingCustomer + resolved + closed;

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("adminStatistics.charts.supportStatus.title")}
        </CardTitle>
        <CardDescription>
          {t("adminStatistics.charts.supportStatus.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                textAlign: isRtl ? "right" : "left",
              }}
            />
            <Legend
              direction={isRtl ? "rtl" : "ltr"}
              wrapperStyle={{ direction: isRtl ? "rtl" : "ltr" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">
              {t("adminStatistics.charts.supportStatus.total")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportStatusPie;
