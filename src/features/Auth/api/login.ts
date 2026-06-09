import z from "zod";
import i18n from "i18next";
import ApiInstance from "@/config/api-instance";
import useAuthStore, {
  AuthState,
  clearTokens,
  ROLE,
  useAccessToken,
} from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { errorToast, successToast } from "@/components/common/Toast";

//? Baisc schema for user information
export const LoginSchema = z.object({
  email: z.string().email(i18n.t("auth.register.validation.invalid_email")),
  password: z
    .string()
    .min(6, i18n.t("auth.register.validation.password_too_short", { min: 6 })),
  remember: z.boolean().optional(),
});
export type LoginValues = z.infer<typeof LoginSchema>;
export const intialLoginValues: LoginValues = {
  email: "",
  password: "",
  remember: false,
};

export const loginApi = async (payload: LoginValues) => {
  const { data } = await ApiInstance.post<AuthState>(
    "/auth/authenticate",
    payload,
  );
  return data;
};

export const useLoginMutation = () => {
  const { setAuth, setUser } = useAuthStore((s) => s);
  const { setAccessToken } = useAccessToken((s) => s);

  return useMutation({
    mutationFn: (payLoad: LoginValues) => loginApi(payLoad),
    mutationKey: ["login"],
    onSuccess: (data) => {
      successToast(i18n.t("auth.login.toast.success"));
      try {
        const { accessToken = "", user = null } = data || {};
        clearTokens();
        setAuth({
          isAuthenticated: user != null,
          role: user?.role as ROLE,
        });

        if (accessToken) {
          setAccessToken({ accessToken });
        }

        setUser(user);
      } catch (e) {
        // ignore store errors
      }
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("auth.login.toast.error");
      errorToast(message);
    },
  });
};
