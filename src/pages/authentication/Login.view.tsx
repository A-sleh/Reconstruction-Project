import { AuthLayout } from "@/components/layouts/Auth-layout";
import LoginForm from "../../features/Auth/components/Login-Form";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  return (
    <AuthLayout
      title={t("auth.login.title")}
      subTitle={t("auth.login.description")}
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
