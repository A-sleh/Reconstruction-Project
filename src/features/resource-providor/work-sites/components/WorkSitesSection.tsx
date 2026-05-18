import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";
import { SiteCard } from "./SiteCard";
import { WorkSite } from "@/data/resource-providor/mockData";
import { useAppStore } from "@/stores/useAppStore";
import { useMemo, useState } from "react";
import { NewWorkSite } from "./NewWorkSite";
import { useTranslation } from "react-i18next";

const WorkSitesSection = () => {
  const { t } = useTranslation();
  const sites = useAppStore((s) => s.sites);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WorkSite | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WorkSite | null>(null);

  const filtered = useMemo(
    () =>
      sites.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.location.toLowerCase().includes(query.toLowerCase()) ||
          s.manager.toLowerCase().includes(query.toLowerCase()),
      ),
    [sites, query],
  );
  const openEdit = (s: WorkSite) => {
    setEditing(s);
    setModalOpen(true);
  };
  const handleDelete = (s: WorkSite) => setPendingDelete(s);

  return (
    <section className="px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">
            {t("resourceProvidor.workSites.work-sites")}
          </h2>
          <span className="text-sm text-muted-foreground">
            ({filtered.length})
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80 border border-gray-200">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("resourceProvidor.workSites.search-placeholder")}
              className="pr-9 w-full bg-white"
            />
          </div>
          <NewWorkSite />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((site, i) => (
          <SiteCard
            key={site.id}
            site={site}
            index={i}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          {t("resourceProvidor.workSites.no-sites")}
        </div>
      )}
    </section>
  );
};

export default WorkSitesSection;
