import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Check, CheckCircle2, Circle, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInvestoryRequests } from "../api/query";
import { RequestStatusBadge } from "./RequestStatusBadge";
import Loader from "@/components/shared/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navigate } from "react-router";
import {
  useApproveInvestorRequest,
  useCancelInvestorRequest,
} from "../api/actions";
import { RejectModalContent } from "./RejectModalContent";

const OrderTables = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const [query, setQuery] = useState("");
  const [currentModify, setCurrentModify] = useState<number | string | null>(
    null,
  );
  const { data: requests, isPending } = useInvestoryRequests();
  const filtered = useMemo(
    () =>
      requests?.filter((r) =>
        r.investor.toLowerCase().includes(query.toLowerCase()),
      ),
    [requests, query],
  );
  const { mutate: approve, isPending: isAproved } = useApproveInvestorRequest();
  const { mutate: cancel, isPending: isCanceld } = useCancelInvestorRequest();

  const handleApprove = (id: number | string) => {
    setCurrentModify(id);
    approve(id, {
      onSettled: () => {
        setCurrentModify(null);
      },
    });
  };
  const handleCancel = (id: number | string, reason: string) => {
    setCurrentModify(id);
    cancel(
      { id, payload: { reason } },
      {
        onSettled: () => {
          setCurrentModify(null);
        },
      },
    );
  };

  if (isPending) return <Loader />;

  return (
    <div
      className="mt-8 rounded-xl border border-gray-300 bg-white shadow-sm"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-300">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "resourceProvidor.investor-request.search.placeholder",
            )}
            className="pr-9 w-full bg-white"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("resourceProvidor.investor-request.search.count", {
            count: filtered?.length ?? 0,
          })}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className={isArabic ? "text-right" : "text-left"}>
            <TableHead>
              {t(`resourceProvidor.investor-request.table.columns.investor`)}
            </TableHead>
            <TableHead>
              {t(`resourceProvidor.investor-request.table.columns.date`)}
            </TableHead>
            <TableHead>
              {t(`resourceProvidor.investor-request.table.columns.status`)}
            </TableHead>
            <TableHead className="">
              {t(`resourceProvidor.investor-request.table.columns.resources`)}
            </TableHead>
            <TableHead className="text-center">
              {t(`resourceProvidor.investor-request.table.columns.actions`)}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered?.map((r) => {
            const total = r.resources.reduce((s, x) => s + x.quantity, 0);
            const delivered = r.resources.reduce((s, x) => s + x.delivered, 0);
            const fullyDelivered = total > 0 && delivered >= total;
            return (
              <TableRow
                key={r.id}
                className="cursor-pointer"
                onClick={() => Navigate({ to: window.location.pathname })}
              >
                <TableCell>
                  <div className="font-medium">{r.investor}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </TableCell>
                <TableCell className="text-muted-foreground ">
                  {new Date(r.requestDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={r.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center  gap-2">
                    {fullyDelivered ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {delivered}/{total}
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="inline-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-success/40 text-success hover:bg-success/10 hover:text-success rounded-xl"
                      disabled={
                        r.status === "completed" ||
                        (currentModify === r.id && isAproved)
                      }
                      onClick={() => handleApprove(r.id)}
                    >
                      {currentModify === r.id && isAproved ? (
                        <>
                          <span className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-success border-t-transparent" />
                          {t(
                            `resourceProvidor.investor-request.table.actions.approve`,
                          )}
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          {t(
                            `resourceProvidor.investor-request.table.actions.approve`,
                          )}
                        </>
                      )}
                    </Button>
                    <RejectModalContent
                      investorName={r.investor}
                      onConfirm={(reason: string) => handleCancel(r.id, reason)}
                      openButton={
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                          disabled={
                            r.status === "rejected" ||
                            (currentModify === r.id && isCanceld)
                          }
                        >
                          {currentModify === r.id && isCanceld ? (
                            <>
                              <span className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                              {t(
                                `resourceProvidor.investor-request.table.actions.rejecting`,
                              )}
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              {t(
                                `resourceProvidor.investor-request.table.actions.reject`,
                              )}
                            </>
                          )}
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {filtered?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-12 text-muted-foreground"
              >
                {t(`resourceProvidor.investor-request.table.empty`)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTables;
