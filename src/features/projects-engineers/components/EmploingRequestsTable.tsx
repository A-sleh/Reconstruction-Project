import { useState } from "react";

import {
  Ban,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import ConfirmDelete from "@/components/model/ConfirmDelete";

import { type EmploingRequests, EmploingRequestStatus } from "../api/types";
import { MOCK_EMPLOING_REQUESTS } from "../mock/mockEmploingRequests";
import RejectModel from "./RejectModel";

export const ENGINEER_PERMISSIONS_PATH = "/admin/engineer-permissions";

const PAGE_SIZE = 6;

interface Props {
  requests?: EmploingRequests[];
  isLoading?: boolean;
  onCancel?: (request: EmploingRequests) => void;
  onReject?: (request: EmploingRequests) => void;
}

const statusStyles: Record<EmploingRequestStatus, string> = {
  [EmploingRequestStatus.PENDING]: "bg-gold/15 text-gold",
  [EmploingRequestStatus.APPROVED]: "bg-emerald-soft text-emerald",
  [EmploingRequestStatus.REJECTED]: "bg-destructive/10 text-destructive",
  [EmploingRequestStatus.CANCELED]: "bg-muted text-muted-foreground",
};

const EmploingRequestsTable = ({
  requests = MOCK_EMPLOING_REQUESTS,
  isLoading = false,
  onCancel,
  onReject,
}: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(i18n.language === "ar" ? "ar" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusLabel = (status: EmploingRequestStatus) =>
    t(
      `projectsEngineers.requests.status.${EmploingRequestStatus[status].toLowerCase()}`,
    );

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = requests.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isLoading) {
    return (
      <div className="space-y-2 rounded-xl border border-border bg-white p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>
                {t("projectsEngineers.requests.columns.engineer")}
              </TableHead>
              <TableHead>
                {t("projectsEngineers.requests.columns.note")}
              </TableHead>
              <TableHead>
                {t("projectsEngineers.requests.columns.date")}
              </TableHead>
              <TableHead>
                {t("projectsEngineers.requests.columns.status")}
              </TableHead>
              <TableHead>
                {t("projectsEngineers.requests.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-16 text-center text-muted-foreground"
                >
                  {t("projectsEngineers.requests.empty")}
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((request) => (
              <TableRow
                key={request.id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="max-w-52">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                      {request.engineer.imageUrl ? (
                        <img
                          src={request.engineer.imageUrl}
                          alt={request.engineer.fullName}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound className="h-4 w-4 text-primary" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {request.engineer.fullName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {request.engineer.spec}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="max-w-72">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span title={request.requestNote} className="line-clamp-2">
                      {request.requestNote}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(request.createdAt)}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    className={cn(
                      "inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      statusStyles[request.status],
                    )}
                  >
                    {statusLabel(request.status)}
                  </span>
                </TableCell>

                <TableCell>
                  {request.status === EmploingRequestStatus.REJECTED ? (
                    <div className="flex max-w-56 items-start gap-2">
                      <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                      <span
                        title={request.rejectedCause}
                        className="line-clamp-2 text-xs italic leading-4 text-destructive"
                      >
                        {request.rejectedCause ||
                          t("projectsEngineers.requests.noCause")}
                      </span>
                    </div>
                  ) : request.status === EmploingRequestStatus.PENDING ? (
                    <div className="flex items-center gap-4">
                      <RejectModel request={request} onConfirm={onReject} />
                      <ConfirmDelete
                        openKey={`cancel-request-${request.id}`}
                        item={request.engineer.fullName}
                        onConfirm={() => onCancel?.(request)}
                        keys={{
                          title: "projectsEngineers.requests.cancel.title",
                          descriptionPrefix:
                            "projectsEngineers.requests.cancel.descriptionPrefix",
                          confirm: "projectsEngineers.requests.actions.cancel",
                          cancel: "projectsEngineers.requests.common.cancel",
                        }}
                        openButton={
                          <button
                            type="button"
                            title={t(
                              "projectsEngineers.requests.actions.cancel",
                            )}
                            aria-label={t(
                              "projectsEngineers.requests.actions.cancel",
                            )}
                            className="text-destructive/70 transition-smooth hover:scale-125 hover:text-destructive focus-visible:outline-none"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        }
                      />
                    </div>
                  ) : request.status === EmploingRequestStatus.APPROVED ? (
                    <button
                      type="button"
                      title={t(
                        "projectsEngineers.requests.actions.permissions",
                      )}
                      aria-label={t(
                        "projectsEngineers.requests.actions.permissions",
                      )}
                      onClick={() =>
                        navigate(`${ENGINEER_PERMISSIONS_PATH}/${request.id}`)
                      }
                      className="text-emerald transition-smooth hover:scale-125 focus-visible:outline-none"
                    >
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            {t("common.prev", "Prev")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
          >
            {t("common.next", "Next")}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmploingRequestsTable;
