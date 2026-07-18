import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Check, X, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RejectRequestModal } from "./RejectRequestModal";
import { ApproveRequestModal } from "./ApproveRequestModal";
import { MOCK_PENDING_REQUESTS, PendingRequest } from "../mock/pendingRequests";
import CollapsibleFilter from "@/components/common/CollapsibleFilter";

const PendingApprovableRequests = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [requests, setRequests] = useState<PendingRequest[]>(
    MOCK_PENDING_REQUESTS,
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const rows: PendingRequest[] = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        search === "" ||
        `${req.ownerFirstName} ${req.ownerLastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        req.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
        req.categoryName.toLowerCase().includes(search.toLowerCase()) ||
        req.description.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || req.type === typeFilter;

      const reqDate = new Date(req.createdAt);
      const matchesFrom = !dateFrom || reqDate >= new Date(dateFrom);
      const matchesTo = !dateTo || reqDate <= new Date(dateTo);

      return matchesSearch && matchesType && matchesFrom && matchesTo;
    });
  }, [requests, search, typeFilter, dateFrom, dateTo]);

  const handleReject = (requestId: number, reason: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleApprove = (requestId: number, assignedCategory: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-2">
        <div
          className="relative w-full md:w-72 rounded-lg bg-white"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t(
              "categoryBank.table.searchPlaceholder",
              "Search requests...",
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 w-full bg-transparent"
          />
        </div>
        <CollapsibleFilter
          trigger={
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4" />
              {t("workSites.resource.filters", "Filters")}
            </span>
          }
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:flex-wrap md:gap-3 mb-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t("categoryBank.table.typeLabel", "Type")}</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-44 flex-1">
                  <SelectValue
                    placeholder={t(
                      "categoryBank.table.filterByType",
                      "Filter by type",
                    )}
                  />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="all">
                    {t("categoryBank.table.allTypes", "All Types")}
                  </SelectItem>
                  <SelectItem value="resource">
                    {t("categoryBank.table.resource", "Resource")}
                  </SelectItem>
                  <SelectItem value="service">
                    {t("categoryBank.table.service", "Service")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                {t("categoryBank.table.dateRangeLabel", "Date Range")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full md:w-40 bg-white"
                  placeholder={t("categoryBank.table.fromDate", "From date")}
                />
                <span className="text-muted-foreground text-sm">
                  {t("categoryBank.table.toSeparator", "to")}
                </span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full md:w-40 bg-white"
                  placeholder={t("categoryBank.table.toDate", "To date")}
                />
              </div>
            </div>
          </div>
        </CollapsibleFilter>
      </div>
      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("categoryBank.table.owner")}</TableHead>
                <TableHead>{t("categoryBank.table.category")}</TableHead>
                <TableHead>{t("categoryBank.table.date")}</TableHead>
                <TableHead className="text-left">
                  {t("categoryBank.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-16 text-muted-foreground"
                  >
                    {t("categoryBank.table.empty")}
                  </TableCell>
                </TableRow>
              )}

              {rows.map((req) => (
                <TableRow
                  key={req.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {req.ownerFirstName} {req.ownerLastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {req.ownerEmail}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {req.categoryName}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            req.type === "resource"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-indigo-500/10 text-indigo-600"
                          }`}
                        >
                          {req.type === "resource"
                            ? t("categoryBank.table.resource", "Resource")
                            : t("categoryBank.table.service", "Service")}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-xs">
                        {req.description}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <RejectRequestModal
                        requestId={req.id}
                        onConfirm={(reason) => handleReject(req.id, reason)}
                        openButton={
                          <Button
                            size="icon"
                            variant="destructive"
                            title={t("categoryBank.table.reject", "Reject")}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        }
                      />

                      <ApproveRequestModal
                        requestId={req.id}
                        onConfirm={(category) =>
                          handleApprove(req.id, category)
                        }
                        openButton={
                          <Button
                            size="icon"
                            variant="default"
                            title={t("categoryBank.table.approve", "Approve")}
                            className="h-8 w-8"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {rows.length > 0 && (
          <p className="text-center text-xs text-muted-foreground py-4">
            {t("categoryBank.table.total", { count: rows.length })}
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingApprovableRequests;
