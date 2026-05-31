import { AuthLayout } from "@/components/layouts/Auth-layout";
import LoginForm from "../../features/Auth/components/Login-Form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Message } from "@/components/common/Message";

const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const successMessage = location.state?.message;

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subTitle={t("auth.login.description")}
    >
      {successMessage && <Message message={successMessage} type="info" />}
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
