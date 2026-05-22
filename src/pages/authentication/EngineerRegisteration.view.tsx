import { AuthLayout } from "@/components/layouts/Auth-layout";
import { MultiStepForm } from "@/components/common/MultiStepForm";
import {
  BaseRegistrationSchema,
  EngineerSchema,
} from "@/features/Auth/api/create-account";
import BaseRegisterInputs from "@/features/Auth/components/Base-register-inputs";
import { useEngineerRegister } from "@/features/Auth/api/create-account";
import EngineerForm from "@/features/Auth/components/Engineer-form";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { useTranslation } from "react-i18next";

const EngineerRegisteration = () => {
  const { t, } = useTranslation();
  const { mutate: registerEngineer, isPending } = useEngineerRegister();

  const handlSubmitForm = (data: any) => {
    registerEngineer(data as any);
  };

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subTitle={t("auth.register.description")}
    >
      <MultiStepForm
        schemas={[BaseRegistrationSchema, EngineerSchema]}
        subForms={[<BaseRegisterInputs />, <EngineerForm />]}
        finalSubmitHandler={handlSubmitForm}
        stepsLabel={[
          t("auth.register.providor.personalInformationLabel"),
          t("auth.register.engineer.engineerInformationLabel"),
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

export default EngineerRegisteration;
