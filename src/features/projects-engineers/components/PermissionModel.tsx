import { useEffect, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { HardHat, ShieldCheck } from "lucide-react";
import { z } from "zod";

import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";

import {
  PROJECT_ENGINEER_PERMISSION_KEYS,
  type ProjectEngineerPermissionFlags,
} from "../api/types";

interface Props {
  openKey: string;
  engineerId: number;
  engineerName: string;
  initial?: Partial<ProjectEngineerPermissionFlags>;
  onSubmit?: (permissions: ProjectEngineerPermissionFlags) => void;
  openButton?: ReactNode | null;
}

const buildDefaults = (
  initial?: Partial<ProjectEngineerPermissionFlags>,
): Record<keyof ProjectEngineerPermissionFlags, boolean> =>
  Object.fromEntries(
    PROJECT_ENGINEER_PERMISSION_KEYS.map((k) => [k, initial?.[k] === true]),
  ) as Record<keyof ProjectEngineerPermissionFlags, boolean>;

const permissionSchema = z
  .object({
    canOrderResources: z.boolean(),
    canOrderServices: z.boolean(),
    canAddWorkshopRegistry: z.boolean(),
    canAddOrderPayments: z.boolean(),
    canAddWorkshopPayments: z.boolean(),
    canManageMembers: z.boolean(),
    canCreateReports: z.boolean(),
    canInteractWithOrderStatus: z.boolean(),
  })
  .refine((data) => Object.values(data).some(Boolean), {
    message: "projectsEngineers.permissions.validation.atLeastOne",
  });

type PermissionFormValues = z.infer<typeof permissionSchema>;

const PermissionModel = ({
  openKey,
  engineerId,
  engineerName,
  initial,
  onSubmit,
  openButton,
}: Props) => {
  const { t } = useTranslation();
  const isEditing = !!initial;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: buildDefaults(initial),
    mode: "onChange",
  });

  useEffect(() => {
    reset(buildDefaults(initial));
  }, [initial, reset]);

  const onFormSubmit = (data: PermissionFormValues, close: () => void) => {
    const permissions = Object.fromEntries(
      PROJECT_ENGINEER_PERMISSION_KEYS.map((k) => [k, data[k]]),
    ) as ProjectEngineerPermissionFlags;
    onSubmit?.(permissions);
    reset();
    close();
  };

  return (
    <PopuupLayout
      openKey={openKey}
      title={
        isEditing
          ? t("projectsEngineers.permissions.modal.editTitle", "Edit Permissions")
          : t(
              "projectsEngineers.permissions.modal.createTitle",
              "Assign Permissions",
            )
      }
      subTitle={t("projectsEngineers.permissions.modal.subTitle", "{{name}}", {
        name: engineerName,
      })}
      openButton={
        openButton ?? (
          <Button className="shrink-0">
            <ShieldCheck className="h-4 w-4" />
            {t(
              "projectsEngineers.permissions.modal.trigger",
              "Set Permissions",
            )}
          </Button>
        )
      }
    >
      {(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => onFormSubmit(data, close))}
          className="space-y-5 pt-2"
        >
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HardHat className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{engineerName}</p>
              <p className="truncate text-xs text-muted-foreground">#{engineerId}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {t("projectsEngineers.permissions.modal.label", "Permissions")}
            </Label>

            <div className="space-y-3">
              {PROJECT_ENGINEER_PERMISSION_KEYS.map((key) => (
                <Controller
                  key={key}
                  name={key}
                  control={control}
                  render={({ field }) => (
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/50 transition-colors">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-foreground">
                        {t(`projectsEngineers.permissions.labels.${key}`)}
                      </span>
                    </label>
                  )}
                />
              ))}
            </div>

            {errors.root && (
              <p className="text-xs text-destructive">
                {t(
                  "projectsEngineers.permissions.validation.atLeastOne",
                  "Select at least one permission.",
                )}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("common.cancel", "Cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">
              {isEditing
                ? t("common.save", "Save Changes")
                : t("common.create", "Assign")}
            </Button>
          </div>
        </form>
      )}
    </PopuupLayout>
  );
};

export default PermissionModel;
