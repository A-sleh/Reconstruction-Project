import { useMemo, useState } from "react";

import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";

import type { GetEmploingRequestsFilters } from "../api/types";
import { MOCK_EMPLOING_REQUESTS } from "../mock/mockEmploingRequests";
import EmploingRequestsFilters from "./EmploingRequestsFilters";
import EmploingRequestsTable from "./EmploingRequestsTable";

const EmploingRequests = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetEmploingRequestsFilters>({});

  const requests = useMemo(() => {
    return MOCK_EMPLOING_REQUESTS.filter((r) => {
      const q = filters.search?.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.engineer.fullName.toLowerCase().includes(q) ||
        r.requestNote.toLowerCase().includes(q);
      const created = new Date(r.createdAt).getTime();
      const matchesFrom =
        !filters.fromDate || created >= new Date(filters.fromDate).getTime();
      const matchesTo =
        !filters.toDate ||
        created <= new Date(filters.toDate).getTime() + 86_399_000;
      const matchesStatus =
        filters.status === undefined || r.status === filters.status;
      return matchesSearch && matchesFrom && matchesTo && matchesStatus;
    });
  }, [filters]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:order-2">
          <EmploingRequestsFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="space-y-5 lg:order-1">
          {requests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              message={t(
                "projectsEngineers.requests.emptyFiltered",
                "No employing requests match your filters.",
              )}
            />
          ) : (
            <EmploingRequestsTable requests={requests} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmploingRequests;
