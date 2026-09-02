import { useState } from "react";

import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { MultiStepForm } from "@/components/common/MultiStepForm";
import { AuthLayout } from "@/components/layouts/Auth-layout";
import { paths } from "@/config/paths";
import {
  BaseRegistrationSchema,
  EngineerSchema,
  useEngineerRegister,
} from "@/features/Auth/api/create-account";
import { engineerDTO } from "@/features/Auth/api/dtos";
import BaseRegisterInputs from "@/features/Auth/components/Base-register-inputs";
import EngineerForm from "@/features/Auth/components/Engineer-form";

const EngineerRegisteration = () => {
  const { t } = useTranslation();
  const [disableFormSubmit, setDisableFormSubmit] = useState(false);
  const { mutate: registerEngineer, isPending } = useEngineerRegister();

  const handlSubmitForm = (data: any) => {
    console.log(data);
    registerEngineer(engineerDTO(data) as any);
  };

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subTitle={t("auth.register.description")}
    >
      <MultiStepForm
        schemas={[BaseRegistrationSchema, EngineerSchema]}
        subForms={[
          <BaseRegisterInputs setDisableFormSubmit={setDisableFormSubmit} />,
          <EngineerForm setDisableFormSubmit={setDisableFormSubmit} />,
        ]}
        finalSubmitHandler={handlSubmitForm}
        stepsLabel={[
          t("auth.register.providor.personalInformationLabel"),
          t("auth.register.engineer.engineerInformationLabel"),
        ]}
        disabled={isPending || disableFormSubmit}
      />
      <p className="mt-8 mx-auto text-sm text-muted-foreground text-center">
        {t("auth.register.haveAccount")}
        <Link
          to={paths.auth.login.path}
          className="ml-1 text-primary hover:text-primary-hover hover:underline transition-all"
        >
          {t("auth.register.login")}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default EngineerRegisteration;
