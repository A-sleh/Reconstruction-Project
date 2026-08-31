import Input from "@/components/inputs/Input";
import Selector from "@/components/inputs/Selector";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import {
  initialWorkShopValues,
  useCreateWorkShop,
  useUpdateWorkShop,
  workShopFormSchema,
  type WorkShopFormValues,
} from "../api/actions";
import type { WorkShop, WorkShopPayload } from "../api/types";
import { WORK_SHOP_STATUSES } from "../api/types";

interface Props {
  openKey: string;
  initial?: WorkShop | null;
  openButton?: ReactNode | null;
}

export function WorkShopModel({ initial = null, openButton, openKey }: Props) {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId?: string }>();
  const numericProjectId = Number(projectId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkShopFormValues>({
    resolver: zodResolver(workShopFormSchema) as unknown as Resolver<WorkShopFormValues>,
    defaultValues: initialWorkShopValues,
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const status = watch("status");

  useEffect(() => {
    if (initial)
      reset({
        jobTitle: initial.name ?? "",
        description: initial.description ?? "",
        memberNumber: initial.memberNumber ?? 1,
        supervisorPhoneNumber: initial.supervisorPhoneNumber ?? "",
        totalCost: initial.totalCost ?? 0,
        startWorkDate: initial.startWorkDate
          ? initial.startWorkDate.slice(0, 10)
          : "",
        endWorkDate: initial.endWorkDate
          ? initial.endWorkDate.slice(0, 10)
          : "",
        status: initial.status ?? "Pending",
      });
  }, [initial, reset]);

  const { mutate: createWorkShop, isPending: isCreating } = useCreateWorkShop();
  const { mutate: updateWorkShop, isPending: isUpdating } = useUpdateWorkShop();

  const isLoading = isCreating || isUpdating;

  const buildPayload = (data: WorkShopFormValues): WorkShopPayload => ({
    id: initial?.id ?? 0,
    jobTitle: data.jobTitle,
    memberNumber: data.memberNumber,
    totalCost: data.totalCost,
    startWorkDate: new Date(data.startWorkDate).toISOString(),
    endWorkDate: new Date(data.endWorkDate).toISOString(),
    supervisorPhoneNumber: data.supervisorPhoneNumber,
    description: data.description,
    status: data.status,
  });

  const onSubmit = (data: WorkShopFormValues, close: () => void) => {
    if (initial) {
      updateWorkShop(
        { workshop: buildPayload(data) },
        {
          onSuccess: () => {
            reset();
            close();
          },
        },
      );
    } else {
      createWorkShop(
        { projectId: numericProjectId, workShops: [buildPayload(data)] },
        {
          onSuccess: () => {
            reset();
            close();
          },
        },
      );
    }
  };

  return (
    <PopuupLayout
      openKey={openKey}
      title={
        initial
          ? t("workShops.form.editTitle", "Edit Workshop")
          : t("workShops.form.createTitle", "New Workshop")
      }
      subTitle={t(
        "workShops.form.subTitle",
        "Fill in the details of the workshop.",
      )}
      openButton={
        openButton || (
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("workShops.form.trigger", "New Workshop")}
          </Button>
        )
      }
    >
      {(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label={t("workShops.fields.title", "Workshop Title")}
              placeholder={t(
                "workShops.placeholders.title",
                "e.g. Al-Razi Tower Structural Works",
              )}
              fieldName="jobTitle"
              errors={errors}
              {...register("jobTitle")}
            />
            <Input
              label={t("workShops.fields.phone", "Supervisor Phone Number")}
              placeholder="+963 9XX XXX XXX"
              fieldName="supervisorPhoneNumber"
              errors={errors}
              {...register("supervisorPhoneNumber")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              type="number"
              min={1}
              label={t("workShops.fields.workerNumber", "Number of Workers")}
              placeholder="10"
              fieldName="memberNumber"
              errors={errors}
              {...register("memberNumber")}
            />
            <Input
              type="number"
              min={0}
              label={t("workShops.fields.totalCost", "Total Cost")}
              placeholder="0"
              fieldName="totalCost"
              errors={errors}
              {...register("totalCost")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              type="date"
              label={t("workShops.fields.startWorkDate", "Start Date")}
              fieldName="startWorkDate"
              errors={errors}
              {...register("startWorkDate")}
            />
            <Input
              type="date"
              label={t("workShops.fields.endWorkDate", "End Date")}
              fieldName="endWorkDate"
              errors={errors}
              {...register("endWorkDate")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-start">
            <div className="w-full space-y-1">
              <label className="text-[11px] text-muted-foreground md:text-sm"></label>
              <Selector
                label={t("workShops.fields.status", "Status")}
                value={status}
                setValue={(value) =>
                  setValue("status", value as WorkShopFormValues["status"], {
                    shouldValidate: true,
                  })
                }
              >
                {WORK_SHOP_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`workShops.status.${s}`, s)}
                  </option>
                ))}
              </Selector>
              {errors.status && (
                <p className="text-xs text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full space-y-1">
            <label className="text-[11px] text-muted-foreground md:text-sm">
              {t("workShops.fields.description", "Description")}
            </label>
            <Textarea
              rows={2}
              placeholder={t(
                "workShops.placeholders.description",
                "Describe the scope of work...",
              )}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("common.cancel", "Cancel")}
              </Button>
            </Model.Close>
            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              {initial
                ? t("common.save", "Save Changes")
                : t("common.create", "Create Workshop")}
            </Button>
          </div>
        </form>
      )}
    </PopuupLayout>
  );
}

export default WorkShopModel;