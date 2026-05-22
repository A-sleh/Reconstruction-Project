import z from "zod";
import i18n from "i18next";
import ApiInstance from "@/config/api-instance";
import useAuthStore from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { errorToast, successToast } from "@/components/common/Toast";

//? Baisc schema for user information
export const BaseRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, i18n.t("auth.register.validation.name_required")),
  lastName: z
    .string()
    .min(2, i18n.t("auth.register.validation.last_name_required")),
  email: z.string().email(i18n.t("auth.register.validation.invalid_email")),
  password: z
    .string()
    .min(6, i18n.t("auth.register.validation.password_too_short", { min: 6 })),
  NationalNumber: z
    .string()
    .min(10, i18n.t("auth.register.validation.national_number_required")),
});
export type BaseRegistrationValues = z.infer<typeof BaseRegistrationSchema>;
export const intialBasicRegisterationValues: BaseRegistrationValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  NationalNumber: "",
};

//? Base schema for  provider registration
export const ResourceProviderSchema = BaseRegistrationSchema.extend({
  license: z
    .string()
    .min(2, i18n.t("auth.register.providor.validation.license_required")),
  companyName: z
    .string()
    .min(2, i18n.t("auth.register.providor.validation.company_name_required")),
  companyLocation: z
    .string()
    .min(
      5,
      i18n.t("auth.register.providor.validation.company_location_required"),
    ),
  companyAddress: z
    .string()
    .min(
      5,
      i18n.t("auth.register.providor.validation.company_address_required"),
    ),
});

export type ResourceProviderFormValues = z.infer<typeof ResourceProviderSchema>;
export const intialProviderValues: ResourceProviderFormValues = {
  ...intialBasicRegisterationValues,
  license: "",
  companyName: "",
  companyLocation: "",
  companyAddress: "",
};

//? Basic shcema for invetor
export const InvestorSchema = BaseRegistrationSchema.extend({
  commercialRegistration: z
    .string()
    .min(
      2,
      i18n.t(
        "auth.register.investor.validation.commercial_registration_required",
      ),
    ),
  imageRecord: z
    .string()
    .min(2, i18n.t("auth.register.investor.validation.image_record")),
});
export type InvestorFormValues = z.infer<typeof InvestorSchema>;
export const intialInvestoreValues: InvestorFormValues = {
  ...intialBasicRegisterationValues,
  commercialRegistration: "",
  imageRecord: "",
};

//? Basic shcema for engineer
export const EngineerSchema = BaseRegistrationSchema.extend({
  specialtiy: z
    .string()
    .min(10, i18n.t("auth.register.engineer.validation.specialtiy")),
  syndicateId: z
    .string()
    .min(12, i18n.t("auth.register.engineer.validation.syndicate_id")),
});
export type EngineerFormValues = z.infer<typeof EngineerSchema>;
export const intialEngineerValues: EngineerFormValues = {
  ...intialBasicRegisterationValues,
  specialtiy: "",
  syndicateId: "",
};

// API calls
enum AuthController {
  ProviderRegister = "auth/register/provider",
  InvestorRegister = "auth/register/investor",
  EngineerRegister = "auth/register/engineer",
}

const registerProviderApi = async (payload: ResourceProviderFormValues) => {
  const { data } = await ApiInstance.post(
    AuthController.ProviderRegister,
    payload,
  );
  return data;
};

const registerInvestorApi = async (payload: InvestorFormValues) => {
  const { data } = await ApiInstance.post(
    AuthController.InvestorRegister,
    payload,
  );
  return data;
};

const registerEngineerApi = async (payload: EngineerFormValues) => {
  const { data } = await ApiInstance.post(
    AuthController.EngineerRegister,
    payload,
  );
  return data;
};

export const useProviderRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (payload: ResourceProviderFormValues) =>
      registerProviderApi(payload),
    mutationKey: ["register", "provider"],
    onSuccess: (data: any) => {
      successToast(i18n.t("auth.register.toast.success"));
      try {
        const { token = null, role = null, user = null } = data || {};
        setAuth({ token, role, user });
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("auth.register.toast.error");
      errorToast(message);
    },
  });
};

export const useInvestorRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (payload: InvestorFormValues) => registerInvestorApi(payload),
    mutationKey: ["register", "investor"],
    onSuccess: (data: any) => {
      successToast(i18n.t("auth.register.toast.success"));
      try {
        const { token = null, role = null, user = null } = data || {};
        setAuth({ token, role, user });
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("auth.register.toast.error");
      errorToast(message);
    },
  });
};

export const useEngineerRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (payload: EngineerFormValues) => registerEngineerApi(payload),
    mutationKey: ["register", "engineer"],
    onSuccess: (data: any) => {
      successToast(i18n.t("auth.register.toast.success"));
      try {
        const { token = null, role = null, user = null } = data || {};
        setAuth({ token, role, user });
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("auth.register.toast.error");
      errorToast(message);
    },
  });
};
