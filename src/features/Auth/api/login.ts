import z from "zod";
import { TFunction } from "i18next";
import ApiInstance from "@/config/api-instance";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/stores/useAuthStore";
import { errorToast, successToast } from "@/components/common/Toast";

//? Baisc schema for user information
export const CreateLoginSchema = (t: TFunction) =>
  z.object({
    email: z.string().email(t("auth.register.validation.invalid_email")),
    password: z
      .string()
      .min(6, t("auth.register.validation.password_too_short", { min: 6 })),
    remember: z.boolean().optional(),
  });
export type LoginValues = z.infer<ReturnType<typeof CreateLoginSchema>>;
export const intialLoginValues: LoginValues = {
  email: "",
  password: "",
  remember: false,
};

export const loginApi = async (payload: LoginValues) => {
  const { data } = await ApiInstance.post("auth/login", payload);
  return data;
};

export const useLoginMutation = () => {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (payLoad: LoginValues) => loginApi(payLoad),
    mutationKey: ["login"],
    onSuccess: (data: any) => {
      successToast("Logged in successfully");
      // store token/role/user in auth store
      try {
        const { token = null, role = null, user = null } = data || {};
        setAuth({ token, role, user });
      } catch (e) {
        // ignore store errors
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "Login failed";
      errorToast(message);
    },
  });
};
