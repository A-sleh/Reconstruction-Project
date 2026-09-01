import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Send } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";

import { MOCK_ENGINEER_JOIN_REQUESTS } from "../mock/mockRequests";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const debouncedSearch = useDebounce(search, 500);

  const filteredRequests = useMemo(() => {
    return MOCK_ENGINEER_JOIN_REQUESTS.filter((request) => {
      if (statusFilter !== "all" && request.status !== statusFilter) {
        return false;
      }
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const haystack = `${request.projectName} ${request.workSiteName} ${request.note}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [debouncedSearch, statusFilter]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("engineerRequests.section.requests.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("engineerRequests.section.requests.subtitle")}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {MOCK_ENGINEER_JOIN_REQUESTS.length} {t("engineerRequests.section.requests.countLabel")}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("engineerRequests.filters.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 bg-transparent"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={t("engineerRequests.filters.statusLabel")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("engineerRequests.filters.allStatuses")}
            </SelectItem>
            <SelectItem value="PENDING">
              {t("engineerRequests.request.status.PENDING")}
            </SelectItem>
            <SelectItem value="APPROVED">
              {t("engineerRequests.request.status.APPROVED")}
            </SelectItem>
            <SelectItem value="REJECTED">
              {t("engineerRequests.request.status.REJECTED")}
            </SelectItem>
            <SelectItem value="CANCELED">
              {t("engineerRequests.request.status.CANCELED")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={Send}
          message={t(
            search || statusFilter !== "all"
              ? "engineerRequests.empty.requestsFiltered"
              : "engineerRequests.empty.requests",
          )}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredRequests.map((request) => (
            <ProjectCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;