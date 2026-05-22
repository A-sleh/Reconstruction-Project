import { paths } from "@/config/paths";
import { useTranslation } from "react-i18next";
import { User, Briefcase, DollarSign } from "lucide-react";

import { AuthLayout } from "@/components/layouts/Auth-layout";
import { Card } from "@/features/Auth/components/Register-option-card";
import { Link } from "react-router";

const RegisterOptions = () => {
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold">
          {t("auth.register.options.title")}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {t("auth.register.options.subtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full">
          <div className="flex flex-col gap-4">
            <Card
              to={paths.auth.register.asEngineer.path}
              Icon={User}
              title={t("auth.register.options.engineer.title")}
              subtitle={t("auth.register.options.engineer.subtitle")}
            />

            <Card
              to={paths.auth.register.asInvestor.path}
              Icon={DollarSign}
              title={t("auth.register.options.investor.title")}
              subtitle={t("auth.register.options.investor.subtitle")}
            />
          </div>

          <Card
            to={paths.auth.register.asProvider.path}
            Icon={Briefcase}
            title={t("auth.register.options.provider.title")}
            subtitle={t("auth.register.options.provider.subtitle")}
          />
        </div>
        <p className="mt-8 mx-auto text-sm text-muted-foreground text-center">
          {t("auth.register.haveAccount")}
          <Link
            to={paths.auth.login.path}
            className="ml-1 text-primary hover:text-primary-hover hover:underline transition-all"
          >
            {t("auth.register.login")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterOptions;
