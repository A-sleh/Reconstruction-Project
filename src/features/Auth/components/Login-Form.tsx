import { paths } from "@/config/paths";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";

const LoginForm = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col justify-center px-4 md:w-full md:px-8">
      <h1 className="text-3xl font-bold text-foreground">{t("login.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("login.description")}
      </p>

      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input type="email" placeholder={t("login.emailPlaceholder")} />
        <Input type="password" placeholder={t("login.passwordPlaceholder")} />
        <Link
          to={"/forgot-password"}
          className="text-sm hover:text-primary hover:underline transition-all"
        >
          {t("login.forgotPassword")}
        </Link>
        <Button className="mt-5">{t("login.loginButton")}</Button>
      </form>
      <p className="mt-8 mx-auto text-sm text-muted-foreground">
        {t("login.noAccount")}
        <Link
          to={paths.auth.register.path}
          className="ml-1 text-primary hover:text-primary-hover hover:underline transition-all"
        >
          {t("login.register")}
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
