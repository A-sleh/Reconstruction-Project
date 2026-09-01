import { useTranslation } from "react-i18next";
import { Ban } from "lucide-react";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { useCancelJoinRequest } from "../api/actions";
import type { EngineerJoinRequest } from "../api/types";

interface JoinRequestCancelConfirmProps {
  request: EngineerJoinRequest;
  onConfirmed?: () => void;
}

const JoinRequestCancelConfirm = ({
  request,
  onConfirmed,
}: JoinRequestCancelConfirmProps) => {
  const { t } = useTranslation();
  const { mutate: cancelJoinRequest, isPending } = useCancelJoinRequest();

  return (
    <ConfirmDelete
      openKey={`cancel-request-${request.id}`}
      item={request.projectName}
      isLoading={isPending}
      onConfirm={() =>
        cancelJoinRequest(
          { requestId: request.id },
          { onSuccess: () => onConfirmed?.() },
        )
      }
      keys={{
        title: "engineerRequests.cancelModal.title",
        descriptionPrefix: "engineerRequests.cancelModal.descriptionPrefix",
        confirm: "engineerRequests.request.actions.cancel",
        cancel: "engineerRequests.cancelModal.cancel",
      }}
      openButton={
        <button
          type="button"
          title={t("engineerRequests.request.actions.cancel")}
          aria-label={t("engineerRequests.request.actions.cancel")}
          className="text-destructive/70 transition-smooth hover:scale-125 hover:text-destructive focus-visible:outline-none"
        >
          <Ban className="h-4 w-4" />
        </button>
      }
    />
  );
};

export default JoinRequestCancelConfirm;