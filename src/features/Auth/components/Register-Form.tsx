import { paths } from "@/config/paths";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";

const RegisterForm = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full md:min-w-150 flex-col justify-center px-4 md:px-8">
      <h1 className="text-3xl font-bold text-foreground">
        {t("register.title")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("register.description")}
      </p>

      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input type="text" placeholder={t("register.namePlaceholder")} />
        <Input type="email" placeholder={t("register.emailPlaceholder")} />
        <Input
          type="password"
          placeholder={t("register.passwordPlaceholder")}
        />

        <Button className="mt-5">{t("register.registerButton")}</Button>
      </form>
      <p className="mt-8 mx-auto text-sm text-muted-foreground">
        {t("register.haveAccount")}
        <Link
          to={paths.auth.login.path}
          className="ml-1 text-primary hover:text-primary-hover hover:underline transition-all"
        >
          {t("register.login")}
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
