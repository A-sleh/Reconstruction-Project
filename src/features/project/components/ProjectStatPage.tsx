import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  HardHat,
  Package,
  Star,
  TrendingUp,
  Users,
  AlertTriangle,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import KpiCard from "@/components/shared/KpiCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { MOCK_ORDERS } from "@/features/orders/data/mockOrders";
import { MOCK_WORK_SHOPS } from "@/features/work-shop/mock/mockWorkShops";
import { MOCK_ENGINEERS } from "@/features/projects-engineers/mock/mockEngineers";
import { MOCK_PROJECT_REPORTS } from "@/features/project-reports/mock/mockReports";

const fmtCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

const ORDER_STATUS_COLORS: Record<string, string> = {
  Completed: "hsl(142 71% 45%)",
  Preparing: "hsl(38 92% 50%)",
  PendingApproval: "hsl(var(--muted-foreground))",
  PendingToApproveCancellation: "hsl(0 84% 60%)",
  Cancelled: "hsl(0 60% 50%)",
  Suspended: "hsl(220 9% 46%)",
};

const WORKSHOP_STATUS_COLORS: Record<string, string> = {
  open: "hsl(142 71% 45%)",
  "in-progress": "hsl(38 92% 50%)",
  closed: "hsl(var(--muted-foreground))",
};

const REPORT_TYPE_COLORS: Record<string, string> = {
  daily: "hsl(199 89% 48%)",
  weekly: "hsl(142 71% 45%)",
  monthly: "hsl(38 92% 50%)",
  yearly: "hsl(262 83% 58%)",
  progress: "hsl(var(--primary))",
  "services-order": "hsl(0 84% 60%)",
  "resources-order": "hsl(142 71% 45%)",
};

const ProjectStatPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const stats = useMemo(() => {
    const totalOrders = MOCK_ORDERS.length;
    const completedOrders = MOCK_ORDERS.filter(
      (o) => o.status === "Completed",
    ).length;
    const pendingOrders = MOCK_ORDERS.filter(
      (o) => o.status === "PendingApproval",
    ).length;
    const preparingOrders = MOCK_ORDERS.filter(
      (o) => o.status === "Preparing",
    ).length;

    const totalOrderValue = MOCK_ORDERS.reduce(
      (sum, o) => sum + o.totalPrice,
      0,
    );
    const totalDiscount = MOCK_ORDERS.reduce(
      (sum, o) => sum + o.totalDiscountValue,
      0,
    );
    const netRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.netTotal, 0);
    const avgFulfillRate =
      MOCK_ORDERS.reduce((sum, o) => sum + o.fulfillRate, 0) / totalOrders;

    const totalWorkshops = MOCK_WORK_SHOPS.length;
    const openWorkshops = MOCK_WORK_SHOPS.filter(
      (w) => w.status === "open",
    ).length;
    const inProgressWorkshops = MOCK_WORK_SHOPS.filter(
      (w) => w.status === "in-progress",
    ).length;
    const totalWorkers = MOCK_WORK_SHOPS.reduce(
      (sum, w) => sum + w.workerNumber,
      0,
    );
    const totalBudgetRequired = MOCK_WORK_SHOPS.reduce(
      (sum, w) => sum + w.requirePrice,
      0,
    );
    const totalBudgetPaid = MOCK_WORK_SHOPS.reduce(
      (sum, w) => sum + w.payedPrice,
      0,
    );
    const budgetUtilization =
      totalBudgetRequired > 0
        ? Math.round((totalBudgetPaid / totalBudgetRequired) * 100)
        : 0;

    const totalEngineers = new Set(MOCK_ENGINEERS.map((e) => e.id)).size;
    const availableEngineers = MOCK_ENGINEERS.filter(
      (e) => e.isAvilable,
    ).length;
    const avgRating =
      MOCK_ENGINEERS.reduce((sum, e) => sum + e.rate, 0) /
      MOCK_ENGINEERS.length;
    const totalCompletedProjects = MOCK_ENGINEERS.reduce(
      (sum, e) => sum + e.numberOfCompletedProjects,
      0,
    );

    const specCounts: Record<string, number> = {};
    MOCK_ENGINEERS.forEach((e) => {
      specCounts[e.spec] = (specCounts[e.spec] || 0) + 1;
    });

    const totalReports = MOCK_PROJECT_REPORTS.length;
    const totalAttachments = MOCK_PROJECT_REPORTS.reduce(
      (sum, r) => sum + r.attachments.length,
      0,
    );
    const orderReports = MOCK_PROJECT_REPORTS.filter(
      (r) => r.type === "services-order" || r.type === "resources-order",
    ).length;

    const reportTypeCounts: Record<string, number> = {};
    MOCK_PROJECT_REPORTS.forEach((r) => {
      reportTypeCounts[r.type] = (reportTypeCounts[r.type] || 0) + 1;
    });

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      preparingOrders,
      totalOrderValue,
      totalDiscount,
      netRevenue,
      avgFulfillRate,
      totalWorkshops,
      openWorkshops,
      inProgressWorkshops,
      totalWorkers,
      totalBudgetRequired,
      totalBudgetPaid,
      budgetUtilization,
      totalEngineers,
      availableEngineers,
      avgRating,
      totalCompletedProjects,
      specCounts,
      totalReports,
      totalAttachments,
      orderReports,
      reportTypeCounts,
    };
  }, []);

  const orderStatusData = useMemo(
    () => [
      {
        name: t("project.statistics.status.completed"),
        value: stats.completedOrders,
        key: "Completed",
      },
      {
        name: t("project.statistics.status.preparing"),
        value: stats.preparingOrders,
        key: "Preparing",
      },
      {
        name: t("project.statistics.status.pending"),
        value: stats.pendingOrders,
        key: "PendingApproval",
      },
      {
        name: t("project.statistics.status.cancelled"),
        value:
          stats.totalOrders -
          stats.completedOrders -
          stats.preparingOrders -
          stats.pendingOrders,
        key: "Cancelled",
      },
    ],
    [stats, t],
  );

  const workshopStatusData = useMemo(
    () => [
      {
        name: t("project.statistics.status.open"),
        value: stats.openWorkshops,
        key: "open",
      },
      {
        name: t("project.statistics.status.inProgress"),
        value: stats.inProgressWorkshops,
        key: "in-progress",
      },
      {
        name: t("project.statistics.status.closed"),
        value:
          stats.totalWorkshops -
          stats.openWorkshops -
          stats.inProgressWorkshops,
        key: "closed",
      },
    ],
    [stats, t],
  );

  const reportTypeData = useMemo(
    () =>
      Object.entries(stats.reportTypeCounts).map(([type, count]) => ({
        name: t(`project.statistics.reportTypes.${type}`, type),
        value: count,
        key: type,
      })),
    [stats, t],
  );

  const specData = useMemo(
    () =>
      Object.entries(stats.specCounts).map(([spec, count]) => ({
        name: spec.split(" ")[0],
        count,
      })),
    [stats],
  );

  const workshopBudgetData = useMemo(
    () =>
      MOCK_WORK_SHOPS.map((w) => ({
        name: w.title.length > 20 ? w.title.slice(0, 20) + "..." : w.title,
        paid: w.payedPrice,
        required: w.requirePrice,
      })),
    [],
  );

  const orderTimelineData = useMemo(() => {
    const monthly: Record<string, { count: number; revenue: number }> = {};
    MOCK_ORDERS.forEach((o) => {
      const d = new Date(o.requestedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthly[key]) monthly[key] = { count: 0, revenue: 0 };
      monthly[key].count++;
      monthly[key].revenue += o.netTotal;
    });
    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        orders: data.count,
        revenue: data.revenue,
      }));
  }, []);

  const avgOrderValue =
    stats.totalOrders > 0 ? stats.totalOrderValue / stats.totalOrders : 0;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">
            {t("project.statistics.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("project.statistics.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Briefcase}
          label={t("project.statistics.kpi.totalOrders")}
          value={String(stats.totalOrders)}
          hint={`${stats.completedOrders} ${t("project.statistics.kpi.completed")}`}
          accent="bg-primary/10 text-primary"
        />
        <KpiCard
          icon={DollarSign}
          label={t("project.statistics.kpi.netRevenue")}
          value={fmtCurrency(stats.netRevenue)}
          hint={`${t("project.statistics.kpi.discount")}: ${fmtCurrency(stats.totalDiscount)}`}
          accent="bg-emerald-500/10 text-emerald-600"
        />
        <KpiCard
          icon={HardHat}
          label={t("project.statistics.kpi.workers")}
          value={String(stats.totalWorkers)}
          hint={`${stats.totalWorkshops} ${t("project.statistics.kpi.workshops")}`}
          accent="bg-amber-500/10 text-amber-600"
        />
        <KpiCard
          icon={Users}
          label={t("project.statistics.kpi.engineers")}
          value={String(stats.totalEngineers)}
          hint={`${stats.availableEngineers} ${t("project.statistics.kpi.available")}`}
          accent="bg-indigo-500/10 text-indigo-600"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={TrendingUp}
          label={t("project.statistics.kpi.fulfillRate")}
          value={`${Math.round(stats.avgFulfillRate)}%`}
          hint={t("project.statistics.kpi.avgAcrossOrders")}
          accent="bg-emerald-500/10 text-emerald-600"
        />
        <KpiCard
          icon={CheckCircle2}
          label={t("project.statistics.kpi.budgetUtilization")}
          value={`${stats.budgetUtilization}%`}
          hint={fmtCurrency(stats.totalBudgetPaid)}
          accent="bg-primary/10 text-primary"
        />
        <KpiCard
          icon={FileText}
          label={t("project.statistics.kpi.reports")}
          value={String(stats.totalReports)}
          hint={`${stats.totalAttachments} ${t("project.statistics.kpi.attachments")}`}
          accent="bg-violet-500/10 text-violet-600"
        />
        <KpiCard
          icon={Star}
          label={t("project.statistics.kpi.avgRating")}
          value={stats.avgRating.toFixed(1)}
          hint={`${stats.totalCompletedProjects} ${t("project.statistics.kpi.totalProjects")}`}
          accent="bg-amber-500/10 text-amber-600"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("project.statistics.charts.orderStatus")}
            </CardTitle>
            <CardDescription>
              {t("project.statistics.charts.orderStatusDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {orderStatusData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={
                        ORDER_STATUS_COLORS[entry.key] ||
                        "hsl(var(--muted))"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    textAlign: isArabic ? "right" : "left",
                  }}
                />
                <Legend
                  direction={isArabic ? "rtl" : "ltr"}
                  wrapperStyle={{ direction: isArabic ? "rtl" : "ltr" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("project.statistics.charts.workshopBudget")}
            </CardTitle>
            <CardDescription>
              {t("project.statistics.charts.workshopBudgetDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workshopBudgetData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="gray"
                  fontSize={10}
                  reversed={isArabic}
                />
                <YAxis
                  stroke="gray"
                  fontSize={11}
                  orientation={isArabic ? "right" : "left"}
                  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    textAlign: isArabic ? "right" : "left",
                  }}
                  formatter={(v: number) => [fmtCurrency(v), ""]}
                />
                <Legend
                  direction={isArabic ? "rtl" : "ltr"}
                  wrapperStyle={{ direction: isArabic ? "rtl" : "ltr" }}
                />
                <Bar
                  dataKey="paid"
                  name={t("project.statistics.charts.paid")}
                  fill="hsl(142 71% 45%)"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="required"
                  name={t("project.statistics.charts.required")}
                  fill="hsl(var(--muted))"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("project.statistics.charts.engineerSpecs")}
            </CardTitle>
            <CardDescription>
              {t("project.statistics.charts.engineerSpecsDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={specData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="gray"
                  fontSize={11}
                  reversed={isArabic}
                />
                <YAxis
                  stroke="gray"
                  fontSize={11}
                  orientation={isArabic ? "right" : "left"}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    textAlign: isArabic ? "right" : "left",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  barSize={40}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("project.statistics.charts.reportTypes")}
            </CardTitle>
            <CardDescription>
              {t("project.statistics.charts.reportTypesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportTypeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {reportTypeData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={
                        REPORT_TYPE_COLORS[entry.key] ||
                        "hsl(var(--muted))"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    textAlign: isArabic ? "right" : "left",
                  }}
                />
                <Legend
                  direction={isArabic ? "rtl" : "ltr"}
                  wrapperStyle={{ direction: isArabic ? "rtl" : "ltr" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("project.statistics.charts.orderTimeline")}
          </CardTitle>
          <CardDescription>
            {t("project.statistics.charts.orderTimelineDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={orderTimelineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                stroke="gray"
                fontSize={11}
                reversed={isArabic}
              />
              <YAxis
                stroke="gray"
                fontSize={11}
                orientation={isArabic ? "right" : "left"}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  textAlign: isArabic ? "right" : "left",
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                name={t("project.statistics.charts.orders")}
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.15)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("project.statistics.charts.workshopStatus")}
            </CardTitle>
            <CardDescription>
              {t("project.statistics.charts.workshopStatusDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workshopStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {workshopStatusData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={
                        WORKSHOP_STATUS_COLORS[entry.key] ||
                        "hsl(var(--muted))"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    textAlign: isArabic ? "right" : "left",
                  }}
                />
                <Legend
                  direction={isArabic ? "rtl" : "ltr"}
                  wrapperStyle={{ direction: isArabic ? "rtl" : "ltr" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("project.statistics.charts.orderValue")}
            </CardTitle>
            <CardDescription>
              {t("project.statistics.charts.orderValueDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderTimelineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  stroke="gray"
                  fontSize={11}
                  reversed={isArabic}
                />
                <YAxis
                  stroke="gray"
                  fontSize={11}
                  orientation={isArabic ? "right" : "left"}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    textAlign: isArabic ? "right" : "left",
                  }}
                  formatter={(v: number) => [fmtCurrency(v), ""]}
                />
                <Bar
                  dataKey="revenue"
                  name={t("project.statistics.charts.revenue")}
                  fill="hsl(142 71% 45%)"
                  barSize={40}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("project.statistics.quickInsights.title")}
          </CardTitle>
          <CardDescription>
            {t("project.statistics.quickInsights.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InsightItem
              icon={DollarSign}
              label={t("project.statistics.quickInsights.avgOrderValue")}
              value={fmtCurrency(avgOrderValue)}
              accent="text-emerald-600"
            />
            <InsightItem
              icon={Package}
              label={t("project.statistics.quickInsights.orderReports")}
              value={`${stats.orderReports} / ${stats.totalReports}`}
              accent="text-primary"
            />
            <InsightItem
              icon={Wrench}
              label={t("project.statistics.quickInsights.activeWorkshops")}
              value={`${stats.openWorkshops + stats.inProgressWorkshops} / ${stats.totalWorkshops}`}
              accent="text-amber-600"
            />
            <InsightItem
              icon={Users}
              label={t("project.statistics.quickInsights.engineerAvailability")}
              value={`${Math.round((stats.availableEngineers / Math.max(stats.totalEngineers, 1)) * 100)}%`}
              accent="text-indigo-600"
            />
            <InsightItem
              icon={Clock}
              label={t("project.statistics.quickInsights.pendingOrders")}
              value={String(stats.pendingOrders)}
              accent="text-violet-600"
            />
            <InsightItem
              icon={AlertTriangle}
              label={t("project.statistics.quickInsights.budgetGap")}
              value={fmtCurrency(stats.totalBudgetRequired - stats.totalBudgetPaid)}
              accent="text-destructive"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function InsightItem({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-4 transition-colors hover:bg-muted/30">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted",
          accent,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export default ProjectStatPage;
