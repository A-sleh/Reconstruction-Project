import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import z from "zod";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import type { ReactNode } from "react";

const skillSchema = z.object({
  skill: z
    .string()
    .min(
      2,
      i18n.t("engineerProfile.skills.validation.skill", {
        defaultValue: "Skill must be at least 2 characters",
      })
    ),
});

type SkillFormValues = z.infer<typeof skillSchema>;

const defaultValues: SkillFormValues = {
  skill: "",
};

interface Props {
  onAdd: (skill: string) => void;
  openButton?: ReactNode;
}

const AddSkillModal = ({ onAdd, openButton }: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema) as unknown as Resolver<SkillFormValues>,
    defaultValues,
    mode: "onSubmit",
  });

  const handleCreate = (data: SkillFormValues, close: () => void) => {
    onAdd(data.skill.trim());
    reset(defaultValues);
    close();
  };

  return (
    <PopuupLayout
      openKey="engineer-skill"
      title={t("engineerProfile.skills.addSkill")}
      openButton={
        openButton || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            {t("engineerProfile.skills.addSkill")}
          </Button>
        )
      }
      children={(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => handleCreate(data, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          <Input
            placeholder={t("engineerProfile.skills.skillPlaceholder")}
            required={true}
            fieldName="skill"
            errors={errors}
            {...register("skill")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("engineerProfile.skills.cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">
              {t("engineerProfile.skills.addSkill")}
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export default AddSkillModal;
