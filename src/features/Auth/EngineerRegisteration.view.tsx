import { AuthLayout } from "@/components/layouts/Auth-layout";
import { MultiStepForm } from "@/components/common/MultiStepForm";
import { CreateBaseRegistrationSchema, CreateEngineerSchema } from "./api/create-account";
import BaseRegisterInputs from "./components/Base-register-inputs";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import EngineerForm from "./components/Engineer-form";
import { Link } from "react-router";
import { paths } from "@/config/paths";

const EngineerRegisteration = () => {
  const { t, i18n } = useTranslation();
  const handlSubmitForm = () => {
    // Call the api here
  };

  // Re-create schema when language changes
  const baseRegistrationSchema = useMemo(
    () => CreateBaseRegistrationSchema(t),
    [t, i18n.language], // Re-run when language changes
  );

  // Re-create schema when language changes
  const engineerSchema = useMemo(
    () => CreateEngineerSchema(t),
    [t, i18n.language], // Re-run when language changes
  );

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subTitle={t("auth.register.description")}
    >
      <MultiStepForm
        schemas={[baseRegistrationSchema,engineerSchema]}
        subForms={[<BaseRegisterInputs />,<EngineerForm />]}
        finalSubmitHandler={handlSubmitForm}
        stepsLabel={[t("auth.register.providor.personalInformationLabel"),t("auth.register.engineer.engineerInformationLabel")]}
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
