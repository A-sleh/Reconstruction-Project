import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Pencil, Trash2, User } from "lucide-react";
import { Link } from "react-router-dom";
import { WorkSite } from "@/data/resource-providor/mockData";
import { StatusBadge } from "../../shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { NewWorkSite } from "./NewWorkSite";
import ConfirmDelete from "@/components/model/ConfirmDelete";

interface Props {
  site: WorkSite;
  index: number;
  onEdit: (site: WorkSite) => void;
  onDelete: (site: WorkSite) => void;
}

export function SiteCard({ site, index, onEdit, onDelete }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full bg-white overflow-hidden rounded-2xl"
    >
      <div className="absolute left-4 top-4 z-10 flex gap-1 opacity-0 transition-smooth group-hover:opacity-100">
        <NewWorkSite
          openButton={
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={(e) => {
                e.preventDefault();
                onEdit(site);
              }}
              aria-label="Edit site"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          }
          initial={site}
        />
        <ConfirmDelete
          onConfirm={() => onDelete(site)}
          openButton={
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.preventDefault();
                onDelete(site);
              }}
              aria-label="Delete site"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          }
        />
      </div>

      <Link
        to={paths.app.resourceProvidor.workSite.getHref(Number(site.id))}
        className="block h-full rounded-2xl border border-gray-300 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <StatusBadge status={site.status} />
            <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
              {site.name}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-smooth group-hover:gradient-accent group-hover:text-accent-foreground group-hover:opacity-0">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="truncate">{site.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 text-accent" />
            <span>{site.manager}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
