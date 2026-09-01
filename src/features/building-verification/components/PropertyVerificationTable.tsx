import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Check, X, Landmark } from "lucide-react";
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
import { useDebounce } from "@/hooks/useDebounce";
import type { PropertyKind } from "../api/types";
import { MOCK_PROPERTY_VERIFICATIONS } from "../mock/buildings";
import PropertyStatusBadge from "./PropertyStatusBadge";
import PropertyApproveModal from "./PropertyApproveModal";
import PropertyRejectModal from "./PropertyRejectModal";

const KIND_STYLES: Record<PropertyKind, string> = {
  land: "bg-sky-500/10 text-sky-600",
  building: "bg-violet-500/10 text-violet-600",
};

const PropertyVerificationTable = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const debouncedSearch = useDebounce(search, 500);

  const allItems = MOCK_PROPERTY_VERIFICATIONS;
  const filteredItems = allItems.filter((item) => {
    if (kindFilter !== "all" && item.kind !== kindFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      const haystack = `${item.name} ${item.address} ${item.ownerName} ${item.city}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(isArabic ? "ar-SY" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-4 w-full" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("buildingVerification.table.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-transparent"
          />
        </div>

        <Select value={kindFilter} onValueChange={setKindFilter}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={t("buildingVerification.table.filterKind")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("buildingVerification.table.allKinds")}
            </SelectItem>
            <SelectItem value="land">
              {t("buildingVerification.kind.land")}
            </SelectItem>
            <SelectItem value="building">
              {t("buildingVerification.kind.building")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={t("buildingVerification.table.filterStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("buildingVerification.table.allStatuses")}
            </SelectItem>
            <SelectItem value="PENDING">
              {t("buildingVerification.status.PENDING")}
            </SelectItem>
            <SelectItem value="APPROVED">
              {t("buildingVerification.status.APPROVED")}
            </SelectItem>
            <SelectItem value="REJECTED">
              {t("buildingVerification.status.REJECTED")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("buildingVerification.table.property")}</TableHead>
                <TableHead>{t("buildingVerification.table.kind")}</TableHead>
                <TableHead>{t("buildingVerification.table.address")}</TableHead>
                <TableHead>{t("buildingVerification.table.owner")}</TableHead>
                <TableHead>{t("buildingVerification.table.area")}</TableHead>
                <TableHead>{t("buildingVerification.table.status")}</TableHead>
                <TableHead>{t("buildingVerification.table.requestedAt")}</TableHead>
                <TableHead>{t("buildingVerification.table.attachments")}</TableHead>
                <TableHead>{t("buildingVerification.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="p-0">
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted/60">
                        <Landmark className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {t("buildingVerification.table.empty")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("buildingVerification.table.emptyHint")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/40 transition-all duration-200">
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.propertyId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${KIND_STYLES[item.kind]}`}
                    >
                      {t(`buildingVerification.kind.${item.kind}`)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {item.address}, {item.city}
                  </TableCell>
                  <TableCell className="text-sm">{item.ownerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.area.toLocaleString()} m²
                  </TableCell>
                  <TableCell>
                    <PropertyStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(item.requestedAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.attachments.length}
                  </TableCell>
                  <TableCell>
                    {item.status === "PENDING" && (
                      <div className="flex items-center gap-1">
                        <PropertyApproveModal
                          propertyId={item.propertyId}
                          onConfirm={() => {}}
                          openButton={
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-400"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <PropertyRejectModal
                          propertyId={item.propertyId}
                          onConfirm={() => {}}
                          openButton={
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredItems.length > 0 && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-border/60 bg-background">
            <span className="text-xs text-muted-foreground">
              {t("buildingVerification.table.total", {
                count: filteredItems.length,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyVerificationTable;
