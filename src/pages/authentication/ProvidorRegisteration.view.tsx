import { AuthLayout } from "@/components/layouts/Auth-layout";
import { MultiStepForm } from "@/components/common/MultiStepForm";
import ServiceProviderForm from "@/features/Auth/components/Service-provider-form";
import BaseRegisterInputs from "@/features/Auth/components/Base-register-inputs";
import { useTranslation } from "react-i18next";
import {
  BaseRegistrationSchema,
  ResourceProviderSchema,
  useProviderRegister,
} from "@/features/Auth/api/create-account";
import { paths } from "@/config/paths";
import { Link } from "react-router";

const ProviderRegisteration = () => {
  const { t } = useTranslation();
  const { mutate: registerProvider, isPending } = useProviderRegister();

  const handlSubmitForm = (data: any) => {
    alert("here");
    registerProvider(data as any);
  };

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subTitle={t("auth.register.description")}
    >
      <MultiStepForm
        schemas={[BaseRegistrationSchema, ResourceProviderSchema]}
        subForms={[<BaseRegisterInputs />, <ServiceProviderForm />]}
        finalSubmitHandler={handlSubmitForm}
        stepsLabel={[
          t("auth.register.providor.personalInformationLabel"),
          t("auth.register.providor.companyInformationLabel"),
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

export default ProviderRegisteration;
