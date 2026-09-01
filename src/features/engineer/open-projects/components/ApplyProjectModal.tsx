import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitApplication } from "../api/actions";
import type { OpenProject } from "../api/types";

interface Props {
  project: OpenProject | null;
  open: boolean;
  onClose: () => void;
}

export default function ApplyProjectModal({ project, open, onClose }: Props) {
  const { t } = useTranslation();
  const { mutate: submitApplication, isPending } = useSubmitApplication();

  const positiveNumber = (min: number, msg: string) =>
    z
      .string()
      .trim()
      .min(1, msg)
      .refine((v) => /^\d+$/.test(v), msg)
      .refine((v) => Number(v) >= min, msg);

  const schema = z.object({
    proposal: z
      .string()
      .trim()
      .min(1, t("openProjects.apply.validation.proposalRequired"))
      .min(50, t("openProjects.apply.validation.proposalMin")),
    portfolioUrl: z
      .string()
      .trim()
      .url(t("openProjects.apply.validation.urlInvalid"))
      .optional()
      .or(z.literal("")),
    estimatedTimelineWeeks: positiveNumber(
      1,
      t("openProjects.apply.validation.timelineRange"),
    ).refine(
      (v) => Number(v) <= 208,
      t("openProjects.apply.validation.timelineRange"),
    ),
    bidAmount: positiveNumber(
      1,
      t("openProjects.apply.validation.bidMin"),
    ),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      proposal: "",
      portfolioUrl: "",
      estimatedTimelineWeeks: "",
      bidAmount: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: FormValues) => {
    if (!project) return;

    submitApplication(
      {
        projectId: project.id,
        proposal: data.proposal,
        portfolioUrl: data.portfolioUrl ?? "",
        estimatedTimelineWeeks: Number(data.estimatedTimelineWeeks),
        bidAmount: Number(data.bidAmount),
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("openProjects.apply.title")}</DialogTitle>
          {project && (
            <DialogDescription>
              {t("openProjects.apply.description", { title: project.title })}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">
              {t("openProjects.apply.proposal")}
            </label>
            <Textarea
              rows={5}
              placeholder={t("openProjects.apply.proposalPlaceholder")}
              {...register("proposal")}
            />
            {errors.proposal && (
              <p className="text-xs text-destructive">
                {errors.proposal.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">
              {t("openProjects.apply.portfolioUrl")}
            </label>
            <Input
              placeholder={t("openProjects.apply.portfolioPlaceholder")}
              {...register("portfolioUrl")}
            />
            {errors.portfolioUrl && (
              <p className="text-xs text-destructive">
                {errors.portfolioUrl.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                {t("openProjects.apply.timeline")}
              </label>
              <Input
                type="number"
                min={1}
                max={208}
                {...register("estimatedTimelineWeeks")}
              />
              {errors.estimatedTimelineWeeks && (
                <p className="text-xs text-destructive">
                  {errors.estimatedTimelineWeeks.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                {t("openProjects.apply.bidAmount")}
              </label>
              <Input type="number" min={1} {...register("bidAmount")} />
              {errors.bidAmount && (
                <p className="text-xs text-destructive">
                  {errors.bidAmount.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              {t("openProjects.apply.cancel")}
            </Button>
            <Button type="submit" isLoading={isPending}>
              {t("openProjects.apply.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
