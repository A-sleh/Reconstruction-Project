import { AuthLayout } from "@/components/layouts/Auth-layout";
import { MultiStepForm } from "@/components/common/MultiStepForm";
import BaseRegisterInputs from "@/features/Auth/components/Base-register-inputs";
import { useTranslation } from "react-i18next";
import { BaseRegistrationSchema, InvestorSchema, useInvestorRegister } from "@/features/Auth/api/create-account";
import InvestorForm from "@/features/Auth/components/Investor-form";
import { Link } from "react-router";
import { paths } from "@/config/paths";

const InvestorRegisteration = () => {
  const { t } = useTranslation();
  const { mutate: registerInvestor, isPending } = useInvestorRegister();

  const handlSubmitForm = (data: any) => {
    registerInvestor(data as any);
  };

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subTitle={t("auth.register.description")}
    >
      <MultiStepForm
        schemas={[BaseRegistrationSchema, InvestorSchema]}
        subForms={[<BaseRegisterInputs />, <InvestorForm />]}
        finalSubmitHandler={handlSubmitForm}
        stepsLabel={[
          t("auth.register.providor.personalInformationLabel"),
          t("auth.register.investor.investorInformationLabel"),
        ]}
        disabled={isPending}
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
