import { useState } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import { MultiStepForm } from "@/components/common/MultiStepForm";
import { AuthLayout } from "@/components/layouts/Auth-layout";
import { paths } from "@/config/paths";
import {
  BaseRegistrationSchema,
  InvestorSchema,
  useInvestorRegister,
} from "@/features/Auth/api/create-account";
import { investorDTO } from "@/features/Auth/api/dtos";
import BaseRegisterInputs from "@/features/Auth/components/Base-register-inputs";
import InvestorForm from "@/features/Auth/components/Investor-form";

const InvestorRegisteration = () => {
  const { t } = useTranslation();
  const goto = useNavigate();
  const [disableFormSubmit, setDisableFormSubmit] = useState(false);
  const { mutate: registerInvestor, isPending } = useInvestorRegister();

  const handlSubmitForm = (data: any) => {
    registerInvestor(investorDTO(data) as any, {
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
        schemas={[BaseRegistrationSchema, InvestorSchema]}
        subForms={[
          <BaseRegisterInputs setDisableFormSubmit={setDisableFormSubmit} />,
          <InvestorForm />,
        ]}
        finalSubmitHandler={handlSubmitForm}
        stepsLabel={[
          t("auth.register.providor.personalInformationLabel"),
          t("auth.register.investor.investorInformationLabel"),
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

export default InvestorRegisteration;
