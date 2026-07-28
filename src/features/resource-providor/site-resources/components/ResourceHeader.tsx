import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Package,
  PackageCheck,
  Percent,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { paths } from "@/config/paths";
import { useResourceStatistics } from "@/features/resource-providor/site-resources/api/queries";
import { StatusBadge } from "@/features/work-sites/components/StatusBadge";
interface StatItem {
  label: string;
  value: number | string;
  icon?: any;
}

export default function ResourceHeader() {
  const { siteId } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const [searchParams] = useSearchParams();
  const siteName = searchParams.get("siteName") ?? "";
  const address = searchParams.get("address") ?? "";
  const status = searchParams.get("status") ?? "";
  const manager = searchParams.get("manager") ?? "";
  const { data, isLoading } = useResourceStatistics();

  const stats: StatItem[] = [
    {
      label: "workSites.stats.total-ordered",
      value: isLoading ? "--" : (data?.totalOrdered ?? 0),
      icon: ShoppingCart,
    },
    {
      label: "workSites.stats.fulfill-count",
      value: isLoading ? "--" : (data?.fulfillCount ?? 0),
      icon: CheckCircle2,
    },
    {
      label: "workSites.stats.fulfill-rate",
      value: isLoading ? "--" : `${data?.fulfillRate ?? 0}%`,
      icon: Percent,
    },
    {
      label: "workSites.stats.amount-invoiced",
      value: isLoading ? "--" : (data?.amountInvoiced ?? 0),
      icon: ReceiptText,
    },
    {
      label: "workSites.stats.quantity-invoiced",
      value: isLoading ? "--" : (data?.quantityInvoiced ?? 0),
      icon: PackageCheck,
    },
    {
      label: "workSites.stats.amount-total",
      value: isLoading ? "--" : (data?.amountTotal ?? 0),
      icon: DollarSign,
    },
  ];
  return (
    <section className="border-b border-gray-300 gradient-hero text-primary-foreground rounded-lg p-6">
      <div className="container py-10">
        <Link
          to={paths.app.resourceProvidor.workSites.path}
          className={`inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth ${
            isArabic ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("workSites.all-work-sites")}
        </Link>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full">
                <StatusBadge status={status || "on-hold"} />
              </div>
              <span className="text-sm text-primary-foreground">
                {t("workSites.label-manager")} ·{" "}
                {manager || ""}
              </span>
            </div>
            <h1 className="mt-2 text-3xl lg:text-4xl font-bold">{siteName}</h1>
            <p className="text-primary-foreground mt-1">{address}</p>
          </motion.div>
          <Link
            to={paths.app.resourceProvidor.newResources.getHref(Number(siteId))}
            className="self-start lg:self-auto"
          >
            <Button
              variant="default"
              size="lg"
              className="bg-white text-primary hover:bg-white hover:opacity-70"
            >
              <Package className="h-4 w-4" />
              {t("workSites.add-new-resource")}
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-6 gap-4 max-w-5xl">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur p-4"
            >
              {s.icon ? (
                <s.icon className="h-4 w-4 text-accent-glow mb-2" />
              ) : null}
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-primary-foreground mt-0.5">
                {t(s.label)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
