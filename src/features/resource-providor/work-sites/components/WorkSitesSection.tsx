import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";
import { SiteCard } from "./SiteCard";
import { useEffect, useMemo, useState } from "react";
import { NewWorkSite } from "./NewWorkSite";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useWorkSites } from "@/features/resource-providor/work-sites/api/query";
import WorkSiteType from "../../shared/WorkSiteType";
import { WorkSiteCardSkeleton } from "./skeletons/WorkSiteCardSkeleton";


const SKELETON_CARDS_NUMBER = 6;

const WorkSitesSection = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get("filter") ?? "";
  const [filter, setFilter] = useState(initialFilter);
  const [query, setQuery] = useState("");
  const { data: fetchedSites, isLoading, isError } = useWorkSites(filter);
  const sites = fetchedSites;

  useEffect(() => {
    const urlFilter = searchParams.get("filter") ?? "";
    if (urlFilter !== filter) {
      setFilter(urlFilter);
    }
  }, [searchParams, filter]);

  const handleFilterChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set("filter", value);
    } else {
      nextParams.delete("filter");
    }
    setSearchParams(nextParams, { replace: true });
    setFilter(value);
  };

  const filtered = useMemo(
    () =>
      sites?.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.address.toLowerCase().includes(query.toLowerCase()),
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
          <div className="relative flex-1 sm:w-80 border border-gray-200 w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("resourceProvidor.workSites.search-placeholder")}
              className="pr-9 w-full bg-white"
            />
          </div>
          <div>
            <WorkSiteType
              setValue={handleFilterChange}
              value={filter}
              asInput={false}
            />
          </div>
          <NewWorkSite />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: SKELETON_CARDS_NUMBER }, (_, idx) => (
            <WorkSiteCardSkeleton key={idx} />
          ))}

        {!isLoading && isError && (
          <div className="col-span-3 text-center py-8 text-red-500">
            {t("common.error", "Failed to load sites")}
          </div>
        )}

        {!isLoading &&
          !isError &&
          filtered?.map((site, i) => (
            <SiteCard key={site.id} site={site} index={i} />
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
