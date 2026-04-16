import { paths } from "@/config/paths";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";

const LoginForm = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full md:min-w-150 flex-col justify-center px-4 md:px-8">

      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input type="email" label={t("auth.login.emailPlaceholder")} placeholder={t("auth.login.emailPlaceholder")} />
        <Input type="password" label={t("auth.login.passwordPlaceholder")} placeholder={t("auth.login.passwordPlaceholder")} />
        <Link
          to={"/forgot-password"}
          className="text-sm hover:text-primary hover:underline transition-all"
        >
          {t("auth.login.forgotPassword")}
        </Link>
        <Button className="mt-5">{t("auth.login.loginButton")}</Button>
      </form>
      <p className="mt-8 mx-auto text-sm text-muted-foreground">
        {t("auth.login.noAccount")}
        <Link
          to={paths.auth.register.asProvider.path}
          className="ml-1 text-primary hover:text-primary-hover hover:underline transition-all"
        >
          {t("auth.login.register")}
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
