import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FolderOpen, SlidersHorizontal, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { EngineerFilters, EngineerSearchResult } from "../api/types";
import { MOCK_ENGINEERS } from "../mock/engineers";
import EngineerSummeryCard from "./EngineerSummeryCard";
import FiltersBar from "./FiltersBar";

const DEFAULT_FILTERS: EngineerFilters = {
  query: "",
  specializations: [],
  experienceRange: "all",
  hasPhone: false,
  hasEmail: false,
  sort: "experience",
};

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, "");

const filterEngineers = (
  engineers: EngineerSearchResult[],
  filters: EngineerFilters,
): EngineerSearchResult[] => {
  const queryTokens = normalize(filters.query).split(/\s+/).filter(Boolean);

  const list = engineers.filter((engineer) => {
    if (queryTokens.length > 0) {
      const haystack = normalize(
        `${engineer.firstName} ${engineer.lastName} ${engineer.licenseNumber} ${engineer.bio}`,
      );
      if (!queryTokens.every((token) => haystack.includes(token))) {
        return false;
      }
    }

    if (
      filters.specializations.length > 0 &&
      !filters.specializations.includes(engineer.specialization)
    ) {
      return false;
    }

    const years = engineer.yearsOfExperience;
    if (
      (filters.experienceRange === "0-2" && (years < 0 || years > 2)) ||
      (filters.experienceRange === "3-5" && (years < 3 || years > 5)) ||
      (filters.experienceRange === "5+" && years <= 5)
    ) {
      return false;
    }

    if (filters.hasPhone && !engineer.phone) return false;
    if (filters.hasEmail && !engineer.email) return false;

    return true;
  });

  const sorted = [...list];
  switch (filters.sort) {
    case "experience":
      sorted.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
      break;
    case "recent":
      sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
    case "name":
      sorted.sort(
        (a, b) =>
          a.firstName.localeCompare(b.firstName) ||
          a.lastName.localeCompare(b.lastName),
      );
      break;
  }

  return sorted;
};

const countActiveFilters = (filters: EngineerFilters) =>
  Number(filters.specializations.length > 0) +
  Number(filters.experienceRange !== "all") +
  Number(filters.hasPhone) +
  Number(filters.hasEmail);

const EngineerSearch = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<EngineerFilters>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  const updateFilters = (updates: Partial<EngineerFilters>) =>
    setFilters((prev) => ({ ...prev, ...updates }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => filterEngineers(MOCK_ENGINEERS, filters),
    [filters],
  );

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("engineerProfile.engineerSearch.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("engineerProfile.engineerSearch.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {t(
              `engineerProfile.engineerSearch.${filtered.length > 1 ? "resultsCount_other" : "resultsCount_one"}`,
              {
                count: filtered.length,
              },
            )}
          </div>
          <Button
            variant="outline"
            className="lg:hidden shrink-0 gap-2"
            onClick={() => setSheetOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("engineerProfile.engineerSearch.filterButton")}
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="hidden w-72 shrink-0 lg:block xl:w-80">
          <Card className="sticky top-24 shadow-card">
            <CardContent className="p-5">
              <FiltersBar
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              {t("engineerProfile.engineerSearch.resultsLabel")}:{" "}
              <span className="font-medium text-foreground">
                {filtered.length}
              </span>
            </span>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-3.5 w-3.5" />
                {t("engineerProfile.engineerSearch.resetFilters")}
              </Button>
            )}
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
                <p className="font-medium text-foreground">
                  {t("engineerProfile.engineerSearch.emptyTitle")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("engineerProfile.engineerSearch.emptyHint")}
                </p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  {t("engineerProfile.engineerSearch.resetFilters")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((engineer) => (
                <EngineerSummeryCard
                  key={engineer.userId}
                  engineer={engineer}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] overflow-y-auto rounded-t-lg"
        >
          <SheetHeader>
            <SheetTitle>
              {t("engineerProfile.engineerSearch.filtersTitle")}
            </SheetTitle>
          </SheetHeader>
          <Separator className="mt-2" />
          <div className="pt-5">
            <FiltersBar
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
            />
          </div>
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button className="w-full">
                {t("engineerProfile.engineerSearch.showResults", {
                  count: filtered.length,
                })}
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EngineerSearch;
