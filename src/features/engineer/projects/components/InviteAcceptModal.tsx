import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { useRespondInvite } from "../api/actions";
import type { EngineerInvite } from "../api/types";

interface InviteAcceptModalProps {
  invite: EngineerInvite;
  onConfirmed?: () => void;
  openButton?: ReactNode;
}

const InviteAcceptModal = ({
  invite,
  onConfirmed,
  openButton,
}: InviteAcceptModalProps) => {
  const { t } = useTranslation();
  const { mutate: respondInvite, isPending } = useRespondInvite();
  const OPEN_KEY = `accept-invite-${invite.id}`;

  function handleConfirm(close: () => void) {
    respondInvite(
      { inviteId: invite.id, decision: "ACCEPTED" },
      {
        onSuccess: () => {
          onConfirmed?.();
          close();
        },
      },
    );
  }

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      openButton={openButton}
      title={t("engineerRequests.acceptModal.title")}
      subTitle={t("engineerRequests.acceptModal.description")}
    >
      {(close) => (
        <div className="space-y-5 pt-2">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground">
              {t("engineerRequests.acceptModal.descriptionPrefix")}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {invite.projectName}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {invite.workSiteName}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={close}>
              {t("engineerRequests.acceptModal.cancel")}
            </Button>
            <Button isLoading={isPending} onClick={() => handleConfirm(close)}>
              {t("engineerRequests.acceptModal.confirm")}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
};

export default InviteAcceptModal;
