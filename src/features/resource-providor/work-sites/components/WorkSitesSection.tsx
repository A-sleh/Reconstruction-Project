import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";
import { SiteCard } from "./SiteCard";
import { useMemo, useState } from "react";
import { NewWorkSite } from "./NewWorkSite";
import { useTranslation } from "react-i18next";
import { useWorkSites } from "@/features/resource-providor/work-sites/api/query";

const WorkSitesSection = () => {
  const { t } = useTranslation();
  const { data: fetchedSites, isLoading, isError } = useWorkSites();
  const sites = fetchedSites;
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      sites?.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.address.toLowerCase().includes(query.toLowerCase()) ||
          s.manager.toLowerCase().includes(query.toLowerCase()),
      ),
    [sites, query],
  );

  return (
    <section className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">
            {t("resourceProvidor.workSites.work-sites")}
          </h2>
          <span className="text-sm text-muted-foreground">
            ({filtered?.length})
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
        {isLoading && (
          <div className="col-span-3 text-center py-8">
            {t("common.loading", "Loading...")}
          </div>
        )}

        {!isLoading && isError && (
          <div className="col-span-3 text-center py-8 text-red-500">
            {t("common.error", "Failed to load sites")}
          </div>
        )}

        {!isLoading &&
          !isError &&
          filtered?.map((site, i) => (
            <SiteCard
              key={site.id}
              site={site}
              index={i}
            />
          ))}
      </div>

      {!isLoading && filtered?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          {t("resourceProvidor.workSites.no-sites")}
        </div>
      )}
    </section>
  );
};

export default WorkSitesSection;
