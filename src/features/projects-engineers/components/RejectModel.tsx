import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { z } from "zod";

import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import type { EmploingRequests } from "../api/types";

const rejectSchema = z.object({
  cause: z
    .string()
    .trim()
    .min(1, "projectsEngineers.requests.reject.validation"),
});

type RejectValues = z.infer<typeof rejectSchema>;

interface Props {
  request: EmploingRequests;
  onConfirm?: (request: EmploingRequests, cause: string) => void;
}

const RejectModel = ({ request, onConfirm }: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RejectValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { cause: "" },
    mode: "onSubmit",
  });

  const onSubmit = (data: RejectValues, close: () => void) => {
    onConfirm?.(request, data.cause);
    reset();
    close();
  };

  return (
    <PopuupLayout
      openKey={`reject-request-${request.id}`}
      title={t("projectsEngineers.requests.reject.title", "Reject Request")}
      subTitle={t(
        "projectsEngineers.requests.reject.subTitle",
        "Let the engineer know why this request is rejected.",
      )}
      openButton={
        <button
          type="button"
          title={t("projectsEngineers.requests.actions.reject")}
          aria-label={t("projectsEngineers.requests.actions.reject")}
          className="text-gold transition-smooth hover:scale-125 focus-visible:outline-none"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      }
    >
      {(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data, close))}
          className="space-y-5 pt-2"
        >
          <div className="rounded-xl bg-muted/50 p-3 text-sm">
            <p className="font-medium text-foreground">
              {request.engineer.fullName}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {request.requestNote}
            </p>
          </div>

          <div className="w-full space-y-1">
            <label className="text-[11px] text-muted-foreground md:text-sm">
              {t("projectsEngineers.requests.reject.cause", "Rejection Cause")}
            </label>
            <Textarea
              rows={3}
              placeholder={t(
                "projectsEngineers.requests.reject.causePlaceholder",
                "Explain the reason for rejection...",
              )}
              {...register("cause")}
            />
            {errors.cause && (
              <p className="text-xs text-destructive">
                {t("projectsEngineers.requests.reject.validation")}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("common.cancel", "Cancel")}
              </Button>
            </Model.Close>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              <X className="h-4 w-4" />
              {t("projectsEngineers.requests.actions.reject")}
            </Button>
          </div>
        </form>
      )}
    </PopuupLayout>
  );
};

export default RejectModel;
