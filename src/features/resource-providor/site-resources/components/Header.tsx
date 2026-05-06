import { ArrowLeft, Boxes, DollarSign, Package } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { StatusBadge } from "../../shared/StatusBadge";
import { WorkSite } from "@/data/resource-providor/mockData";

const stats = [
  { label: "Total Resources", value: 3, icon: Package },
  {
    label: "Total Quantity",
    value: 100, // This need to calcaulte in realy data
    icon: Boxes,
  },
  {
    label: "Inventory Value",
    value: 300, // This need to calcaulte in realy data
    icon: DollarSign,
  },
];

interface IHeaderProps {
  CallToAction?: React.ReactNode;
  site: WorkSite;
}

const Header: React.FC<IHeaderProps> = ({ CallToAction, site }) => {
  return (
    <section className="border-b border-border gradient-hero text-primary-foreground">
      <div className="container py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
        >
          <ArrowLeft className="h-4 w-4" /> All Work Sites
        </Link>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <StatusBadge status={site.status} />
              <span className="text-sm text-primary-foreground/70">
                Manager · {site.manager}
              </span>
            </div>
            <h1 className="mt-2 text-3xl lg:text-4xl font-bold">{site.name}</h1>
            <p className="text-primary-foreground/80 mt-1">{site.location}</p>
          </motion.div>
          {CallToAction}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur p-4"
            >
              <s.icon className="h-4 w-4 text-accent-glow mb-2" />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-primary-foreground/70 mt-0.5">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Header;
