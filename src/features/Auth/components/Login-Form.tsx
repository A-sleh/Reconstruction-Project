import { paths } from "@/config/paths";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";
import {
  CreateLoginSchema,
  LoginValues,
  useLoginMutation,
} from "../api/login";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const { mutate: login, isPending } = useLoginMutation();

  // Re-create schema when language changes
  const loginSchema = useMemo(
    () => CreateLoginSchema(t),
    [t, i18n.language], // Re-run when language changes
  );

  const onSubmit = (data: LoginValues) => {
    login(data);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(loginSchema),
    criteriaMode: "all",
    mode: "onSubmit",
  });

  return (
    <div className="flex w-full md:min-w-150 flex-col justify-center px-4 md:px-8">
      <div>
        <h1 className="text-3xl font-bold ">{t("auth.login.title")}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {t("auth.login.description")}
        </p>
      </div>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          label={t("auth.login.emailPlaceholder")}
          placeholder={t("auth.login.emailPlaceholder")}
          errors={errors}
          fieldName="email"
          {...register("email")}
        />
        <Input
          type="password"
          label={t("auth.login.passwordPlaceholder")}
          placeholder={t("auth.login.passwordPlaceholder")}
          errors={errors}
          fieldName="password"
          {...register("password")}
        />
        <div className="flex items-center mt-2">
          <label className="inline-flex items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-primary mx-2"
              {...register("remember")}
            />
            <span className="ml-2">{t("auth.login.rememberMe")}</span>
          </label>
        </div>
        <Button
          type="submit"
          className="mt-5"
          disabled={isPending}
        >
          {t("auth.login.loginButton")}
        </Button>
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
