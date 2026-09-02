import { Dispatch, SetStateAction } from "react";

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import ImageUploader from "@/components/inputs/ImageUploader";
import { useFileUpload } from "@/hooks/useFileUpload";

import type { EngineerFormValues } from "../api/create-account";
import { EEngineeringRole } from "../api/create-account";
import EngineeringRoleSelector from "./EngineeringRoleSelector";

const EngineerForm = ({
  setDisableFormSubmit,
}: {
  setDisableFormSubmit: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EngineerFormValues>();
  const engineeringRole = watch("specialty");
  const syndicateId = watch("syndicateId");

  const setEngineeringRole = (value: EEngineeringRole) => {
    setValue("specialty", value);
  };

  const { previewUrl, isPending, onChange } = useFileUpload({
    onSuccess: (id) => {
      setDisableFormSubmit(false);
      setValue("syndicateId", id);
    },
    onError: () => {
      setDisableFormSubmit(false);
    },
  });

  const handleImageChange = (selectedFile: File | null) => {
    onChange(selectedFile);
    setDisableFormSubmit(true);
    if (!selectedFile) {
      setValue("syndicateId", "");
      setValue("file", undefined);
    }
  };

  return (
    <div className="space-y-3 mt-3">
      <EngineeringRoleSelector
        value={engineeringRole || EEngineeringRole.Architect}
        setValue={setEngineeringRole}
        required={true}
      />
      <ImageUploader
        label={t("auth.register.generalInformation.profilePhoto")}
        required={true}
        fileName={"syndicateId"}
        value={previewUrl || syndicateId}
        disabled={isPending}
        onFileChange={handleImageChange}
        errors={errors ?? null}
        fieldName="syndicateId"
      />
    </div>
  );
};

export default EngineerForm;
