import { AuthLayout } from "@/components/layouts/Auth-layout";
import { MultiStepForm } from "@/components/common/MultiStepForm";
import {
  CreateBaseRegistrationSchema,
  CreateResourceProviderSchema,
} from "./api/create-account";
import ServiceProviderForm from "./components/Service-provider-form";
import BaseRegisterInputs from "./components/Base-register-inputs";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const ProviderRegisteration = () => {
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
  const serviceProviderSchema = useMemo(
    () => CreateResourceProviderSchema(t),
    [t, i18n.language], // Re-run when language changes
  );

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subTitle={t("auth.register.description")}
    >
      <MultiStepForm
        schemas={[baseRegistrationSchema, serviceProviderSchema]}
        subForms={[<BaseRegisterInputs />, <ServiceProviderForm />]}
        finalSubmitHandler={handlSubmitForm}
        stepsLabel={[t("auth.register.providor.personalInformationLabel"),t("auth.register.providor.companyInformationLabel")]}
      />
    </AuthLayout>
  );
};

export default ProviderRegisteration;
