import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useRespondInvite } from "../api/actions";
import type { EngineerInvite } from "../api/types";

const declineSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "engineerRequests.declineModal.validation"),
});

type DeclineValues = z.infer<typeof declineSchema>;

interface InviteDeclineModalProps {
  invite: EngineerInvite;
  onConfirmed?: () => void;
  openButton?: ReactNode;
}

const InviteDeclineModal = ({
  invite,
  onConfirmed,
  openButton,
}: InviteDeclineModalProps) => {
  const { t } = useTranslation();
  const { mutate: respondInvite } = useRespondInvite();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeclineValues>({
    resolver: zodResolver(declineSchema),
    defaultValues: { reason: "" },
    mode: "onSubmit",
  });

  const onSubmit = (data: DeclineValues, close: () => void) => {
    respondInvite(
      { inviteId: invite.id, decision: "DECLINED", reason: data.reason },
      {
        onSuccess: () => {
          onConfirmed?.();
          reset();
          close();
        },
      },
    );
  };

  return (
    <PopuupLayout
      openKey={`decline-invite-${invite.id}`}
      title={t("engineerRequests.declineModal.title")}
      subTitle={t("engineerRequests.declineModal.description")}
      openButton={openButton}
    >
      {(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data, close))}
          className="space-y-5 pt-2"
        >
          <div className="rounded-xl bg-muted/50 p-3 text-sm">
            <p className="font-medium text-foreground">{invite.projectName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {invite.workSiteName}
            </p>
          </div>

          <div className="w-full space-y-1">
            <label className="text-sm text-muted-foreground">
              {t("engineerRequests.declineModal.reason")}
            </label>
            <Textarea
              rows={3}
              placeholder={t("engineerRequests.declineModal.reasonPlaceholder")}
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">
                {t("engineerRequests.declineModal.validation")}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("engineerRequests.declineModal.cancel")}
              </Button>
            </Model.Close>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {t("engineerRequests.declineModal.confirm")}
            </Button>
          </div>
        </form>
      )}
    </PopuupLayout>
  );
};

export default InviteDeclineModal;
