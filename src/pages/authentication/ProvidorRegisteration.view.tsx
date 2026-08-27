import { useState } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import { MultiStepForm } from "@/components/common/MultiStepForm";
import { AuthLayout } from "@/components/layouts/Auth-layout";
import { paths } from "@/config/paths";
import {
  BaseRegistrationSchema,
  ResourceProviderSchema,
  useProviderRegister,
} from "@/features/Auth/api/create-account";
import { providerDTO } from "@/features/Auth/api/dtos";
import BaseRegisterInputs from "@/features/Auth/components/Base-register-inputs";
import ServiceProviderForm from "@/features/Auth/components/Service-provider-form";

const ProviderRegisteration = () => {
  const goto = useNavigate();
  const { t } = useTranslation();
  const [disableFormSubmit, setDisableFormSubmit] = useState(false);
  const { mutate: registerProvider, isPending } = useProviderRegister();

  const handlSubmitForm = (data: any) => {
    registerProvider(providerDTO(data) as any, {
      onSuccess: (_) => {
        goto(paths.auth.login.path, {
          replace: true,
          state: {
            message: t("auth.register.providor.successRegisterModelInfo"),
            email: data.email,
            password: data.password,
          },
        });
      },
    });
  };

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subTitle={t("auth.register.description")}
    >
      <MultiStepForm
        schemas={[BaseRegistrationSchema, ResourceProviderSchema]}
        subForms={[
          <BaseRegisterInputs setDisableFormSubmit={setDisableFormSubmit} />,
          <ServiceProviderForm setDisableFormSubmit={setDisableFormSubmit} />,
        ]}
        finalSubmitHandler={handlSubmitForm}
        stepsLabel={[
          t("auth.register.providor.personalInformationLabel"),
          t("auth.register.providor.companyInformationLabel"),
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

export default ProviderRegisteration;
