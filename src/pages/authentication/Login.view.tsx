import { AuthLayout } from "@/components/layouts/Auth-layout";
import { useTranslation } from "react-i18next";
import { Message } from "@/components/common/Message";

import LoginForm from "../../features/Auth/components/Login-Form";
import useExchangeState from "@/hooks/useExchangeState";

const Login = () => {
  const { t } = useTranslation();
  const { message } = useExchangeState<{ message: string }>();

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subTitle={t("auth.login.description")}
    >
      {message  && <Message message={message } type="info" />}
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
