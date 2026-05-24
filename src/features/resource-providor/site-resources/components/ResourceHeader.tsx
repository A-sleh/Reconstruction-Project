import { motion } from "framer-motion";
import { ArrowLeft, Boxes, Clock, DollarSign, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { paths } from "@/config/paths";
import { ResourceModal } from "./ResourceModel";
import { useResourceStatistics } from "@/features/resource-providor/site-resources/api/query";
import { type SiteDetailsWithResources } from "../api";

interface StatItem {
  label: string;
  value: number | string;
  icon?: any;
}

interface Props {
  site: SiteDetailsWithResources;
}

export default function ResourceHeader({ site }: Props) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const { data, isLoading } = useResourceStatistics();

  const stats: StatItem[] = [
    {
      label: "resourceProvidor.workSites.stats.total-resources",
      value: isLoading ? "--" : (data?.totalResources ?? 0),
      icon: Package,
    },
    {
      label: "resourceProvidor.workSites.stats.categories",
      value: isLoading ? "--" : (data?.categories ?? 0),
      icon: Boxes,
    },
    {
      label: "resourceProvidor.workSites.stats.inventory-value",
      value: isLoading ? "--" : (data?.inventoryValue ?? 0),
      icon: DollarSign,
    },
    {
      label: "resourceProvidor.workSites.stats.pending-orders",
      value: isLoading ? "--" : (data?.pendingOrders ?? 0),
      icon: Clock,
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
          {t("resourceProvidor.workSites.all-work-sites")}
        </Link>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <StatusBadge status={site.status} />
              <span className="text-sm text-primary-foreground">
                {t("resourceProvidor.workSites.label-manager")} · {site.manager}
              </span>
            </div>
            <h1 className="mt-2 text-3xl lg:text-4xl font-bold">{site.name}</h1>
            <p className="text-primary-foreground mt-1">{site.address}</p>
          </motion.div>
          <ResourceModal
            openButton={
              <Button
                variant="default"
                size="lg"
                className="self-start lg:self-auto bg-white text-primary hover:bg-white hover:opacity-70"
              >
                <Package className="h-4 w-4" />{" "}
                {t("resourceProvidor.workSites.add-new-resource")}
              </Button>
            }
          />
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
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
