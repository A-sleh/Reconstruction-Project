import { useTranslation } from "react-i18next";
import {
  MoreVertical,
  ShieldCheck,
  XCircle,
  CheckCircle,
  Ban,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RejectRequestModal } from "./RejectRequestModal";
import { ResolveRequestModal } from "./ResolveRequestModal";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { BankItemStatus, ResolveRequestParams } from "../api/types";
import Can from "@/components/shared/Can";
import { Permissions } from "@/lib/permissions";
import { Button } from "@/components/ui/button";

interface RequestActionsMenuProps {
  requestId: number;
  status: BankItemStatus;
  onApprove: (requestId: number) => void;
  onReject: (requestId: number, reason: string) => void;
  onResolve: (payload: ResolveRequestParams) => void;
  onCancel: (requestId: number) => void;
  isProcessing?: boolean;
}

export default function RequestActionsMenu({
  requestId,
  status,
  onApprove,
  onReject,
  onResolve,
  onCancel,
  isProcessing = false,
}: RequestActionsMenuProps) {

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const isPending = status === "Pending";

  if (!isPending) return "--";

  if(isProcessing) return <Loader2 />

  return (
    <DropdownMenu dir={isArabic ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white border-gray-300">
        <Can permission={Permissions.ORDERS_MANAGE}>
          {/* Approve */}
          <DropdownMenuItem
            onClick={() => onApprove(requestId)}
            className="gap-2 text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            {t("categoryBank.table.actions.approve", {
              defaultValue: "Approve",
            })}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Resolve */}
          <ResolveRequestModal
            requestId={requestId}
            onConfirm={onResolve}
            openButton={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="gap-2 text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer"
              >
                <CheckCircle className="h-4 w-4" />
                {t("categoryBank.table.actions.resolve", {
                  defaultValue: "Resolve",
                })}
              </DropdownMenuItem>
            }
          />
          {/* Reject */}
          <RejectRequestModal
            requestId={requestId}
            onConfirm={(reason) => onReject(requestId, reason)}
            openButton={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
              >
                <XCircle className="h-4 w-4" />
                {t("categoryBank.table.actions.reject", {
                  defaultValue: "Reject",
                })}
              </DropdownMenuItem>
            }
          />
        </Can>
        <DropdownMenuSeparator />

        <Can permission={Permissions.ORDERS_CANCEL}>
          {/* Cancel */}
          <ConfirmDelete
            item={t("categoryBank.cancelModal.itemName", {
              defaultValue: "this request",
            })}
            onConfirm={() => onCancel(requestId)}
            openButton={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="gap-2 text-orange-600 focus:text-orange-700 focus:bg-orange-50 cursor-pointer"
              >
                <Ban className="h-4 w-4" />
                {t("categoryBank.table.actions.cancel", {
                  defaultValue: "Cancel Request",
                })}
              </DropdownMenuItem>
            }
          />
        </Can>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
