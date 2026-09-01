import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Inbox, Search } from "lucide-react";

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

import { MOCK_ENGINEER_INVITES } from "../mock/mockRequests";
import UpcomingInvetaitionCard from "./UpcomingInvetaitionCard";

const UpComingInvetationRequest = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const debouncedSearch = useDebounce(search, 500);

  const filteredInvites = useMemo(() => {
    return MOCK_ENGINEER_INVITES.filter((invite) => {
      if (statusFilter !== "all" && invite.status !== statusFilter) {
        return false;
      }
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const haystack = `${invite.fromName} ${invite.projectName} ${invite.workSiteName} ${invite.message}`.toLowerCase();
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
            {t("engineerRequests.section.invites.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("engineerRequests.section.invites.subtitle")}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {MOCK_ENGINEER_INVITES.length} {t("engineerRequests.section.invites.countLabel")}
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
              {t("engineerRequests.invite.status.PENDING")}
            </SelectItem>
            <SelectItem value="ACCEPTED">
              {t("engineerRequests.invite.status.ACCEPTED")}
            </SelectItem>
            <SelectItem value="DECLINED">
              {t("engineerRequests.invite.status.DECLINED")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredInvites.length === 0 ? (
        <EmptyState
          icon={Inbox}
          message={t(
            search || statusFilter !== "all"
              ? "engineerRequests.empty.invitesFiltered"
              : "engineerRequests.empty.invites",
          )}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredInvites.map((invite, index) => (
            <UpcomingInvetaitionCard
              key={invite.id}
              invite={invite}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default UpComingInvetationRequest;