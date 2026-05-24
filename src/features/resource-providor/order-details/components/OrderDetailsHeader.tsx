import { motion } from "motion/react";
import { RequestStatusBadge } from "../../shared/RequestStatusBadge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { RejectModalContent } from "../../orders/components/RejectModalContent";
import {
  useApproveInvestorRequest,
  useCancelInvestorRequest,
} from "../../orders/api/actions";
import { RequestStatus } from "../../orders/api";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

interface OrderDetailsHeaderProps {
  requestDetails: {
    id: string;
    investor: string;
    email: string;
    requestDate: string;
    status: RequestStatus;
    rejectionReason?: string;
  };
}

const OrderDetailsHeader = ({ requestDetails }: OrderDetailsHeaderProps) => {
  const goto = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const { mutate: approve, isPending: isAproved } = useApproveInvestorRequest();
  const { mutate: cancel, isPending: isCanceld } = useCancelInvestorRequest();
  const formattedDate = new Date(
    requestDetails.requestDate,
  ).toLocaleDateString();

  const handleApprove = (id: number | string) => {
    approve(id);
  };
  const handleCancel = (id: number | string, reason: string) => {
    cancel(
      { id, payload: { reason } },
      {
        onSuccess: () => {
          goto(paths.app.resourceProvidor.orders.path);
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 flex flex-wrap items-start justify-between gap-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div>
        <h1 className="text-3xl font-bold">{requestDetails.investor}</h1>
        <p className="text-white">
          {requestDetails.email} ·{" "}
          {t(`resourceProvidor.investor-request-details.requested_on`, {
            date: formattedDate,
          })}
        </p>
        <div className="mt-3 flex items-center gap-2 bg-white p-2 w-fit rounded-3xl">
          <RequestStatusBadge status={requestDetails.status} />
          {requestDetails.rejectionReason && (
            <span className="text-xs text-destructive">
              {t(`resourceProvidor.investor-request-details.reason_label`, {
                reason: requestDetails.rejectionReason,
              })}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-success/40 text-success hover:opacity-80 rounded-xl"
          disabled={requestDetails.status === "completed" || isAproved}
          onClick={() => handleApprove(requestDetails.id)}
        >
          {isAproved ? (
            <>
              <span className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-success border-t-transparent" />
              {t(`resourceProvidor.investor-request.table.actions.approve`)}
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              {t(`resourceProvidor.investor-request.table.actions.approve`)}
            </>
          )}
        </Button>
        <RejectModalContent
          investorName={requestDetails.investor}
          onConfirm={(reason: string) =>
            handleCancel(requestDetails.id, reason)
          }
          openButton={
            <Button
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:opacity-80 rounded-xl"
              disabled={requestDetails.status === "rejected" || isCanceld}
            >
              {isCanceld ? (
                <>
                  <span className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                  {t(
                    `resourceProvidor.investor-request.table.actions.rejecting`,
                  )}
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" />
                  {t(`resourceProvidor.investor-request.table.actions.reject`)}
                </>
              )}
            </Button>
          }
        />
      </div>
    </motion.div>
  );
};

export default OrderDetailsHeader;
