import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useVerifyEngineer } from "../api/actions";
import {
  MOCK_ENGINEER_VERIFICATIONS,
} from "../mock/engineers";
import EngineerStatusBadge from "./EngineerStatusBadge";
import EngineerApproveModal from "./EngineerApproveModal";
import EngineerRejectModal from "./EngineerRejectModal";
import type { EngineerVerificationItem } from "../api/types";

const SPECIALITY_OPTIONS = ["CIVIL", "ARCHITECTURE", "ELECTRICAL", "MECHANICAL"];

const EngineerVerificationTable = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const { mutate: verifyEngineer } = useVerifyEngineer();

  const filteredEngineers = useMemo(() => {
    return MOCK_ENGINEER_VERIFICATIONS.filter((engineer) => {
      const matchesStatus =
        statusFilter === "all" || engineer.status === statusFilter;
      const query = debouncedSearch.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        engineer.firstName.toLowerCase().includes(query) ||
        engineer.lastName.toLowerCase().includes(query) ||
        engineer.email.toLowerCase().includes(query) ||
        engineer.licenseNumber.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, debouncedSearch]);

  const handleApprove = (engineerId: string) => {
    verifyEngineer({ engineerId, decision: "VERIFIED" });
  };

  const handleReject = (engineerId: string, reason: string) => {
    verifyEngineer({ engineerId, decision: "REJECTED", reason });
  };

  const getInitials = (engineer: EngineerVerificationItem) => {
    return `${engineer.firstName.charAt(0)}${engineer.lastName.charAt(0)}`;
  };

  const getSpecialityLabel = (speciality: string) => {
    if (SPECIALITY_OPTIONS.includes(speciality)) {
      return t(`engineerVerification.speciality.${speciality}`);
    }
    return speciality;
  };

  const dataSource =
    MOCK_ENGINEER_VERIFICATIONS.length > 0 ? filteredEngineers : [];

  return (
    <div className="space-y-4 w-full" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t(
              "engineerVerification.table.searchPlaceholder",
              "Search engineers...",
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10 w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-fit" dir={isArabic ? "rtl" : "ltr"}>
            <SelectValue
              placeholder={t(
                "engineerVerification.table.filterStatus",
                "Filter by status",
              )}
            />
          </SelectTrigger>
          <SelectContent dir={isArabic ? "rtl" : "ltr"}>
            <SelectItem value="all">
              {t("engineerVerification.table.allStatuses", "All statuses")}
            </SelectItem>
            <SelectItem value="PENDING">
              {t("engineerVerification.filters.pending")}
            </SelectItem>
            <SelectItem value="VERIFIED">
              {t("engineerVerification.filters.verified")}
            </SelectItem>
            <SelectItem value="REJECTED">
              {t("engineerVerification.filters.rejected")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("engineerVerification.table.engineer")}</TableHead>
                <TableHead>{t("engineerVerification.table.contact")}</TableHead>
                <TableHead>{t("engineerVerification.table.speciality")}</TableHead>
                <TableHead>{t("engineerVerification.table.syndicate")}</TableHead>
                <TableHead>{t("engineerVerification.table.license")}</TableHead>
                <TableHead>{t("engineerVerification.table.experience")}</TableHead>
                <TableHead>{t("engineerVerification.table.status")}</TableHead>
                <TableHead>{t("engineerVerification.table.submittedDocs")}</TableHead>
                <TableHead>{t("engineerVerification.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={9}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {!isLoading && dataSource.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="p-8 text-center">
                    <div className="text-sm font-medium">
                      {t("engineerVerification.table.empty")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t("engineerVerification.table.emptyHint")}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {dataSource.map((engineer) => (
                <TableRow
                  key={engineer.id}
                  className="hover:bg-muted/40 transition-all duration-200"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(engineer)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {engineer.firstName} {engineer.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {engineer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {engineer.phone}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getSpecialityLabel(engineer.speciality)}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {engineer.syndicateId}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {engineer.licenseNumber}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {engineer.yearsOfExperience}
                  </TableCell>
                  <TableCell>
                    <EngineerStatusBadge status={engineer.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {engineer.submittedDocs.length}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EngineerApproveModal
                        engineerId={engineer.id}
                        onConfirm={() => handleApprove(engineer.engineerId)}
                        openButton={
                          <Button
                            size="icon"
                            variant="outline"
                            title={t("engineerVerification.approveModal.confirm")}
                            className={cn(
                              "h-8 w-8 border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700",
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <EngineerRejectModal
                        engineerId={engineer.id}
                        onConfirm={(reason) =>
                          handleReject(engineer.engineerId, reason)
                        }
                        openButton={
                          <Button
                            size="icon"
                            variant="outline"
                            title={t("engineerVerification.rejectModal.confirm")}
                            className={cn(
                              "h-8 w-8 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700",
                            )}
                          >
                            <X className="h-4 w-4" />
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

        {dataSource.length > 0 && (
          <div className="px-4 py-2 text-xs text-muted-foreground">
            {t("engineerVerification.table.total", {
              count: dataSource.length,
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineerVerificationTable;
