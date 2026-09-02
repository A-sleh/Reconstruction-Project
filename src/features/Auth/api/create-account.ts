import i18n from "i18next";
import z from "zod";

import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import useAuthStore from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";

//? Baisc schema for user information
export const BaseRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(
      2,
      i18n.t("auth.register.generalInformation.validation.name_required"),
    ),
  lastName: z
    .string()
    .min(
      2,
      i18n.t("auth.register.generalInformation.validation.last_name_required"),
    ),
  phone: z
    .string()
    .min(1, i18n.t("auth.register.generalInformation.validation.phone")),
  email: z.string().email(i18n.t("auth.register.validation.invalid_email")),
  password: z.string().min(
    6,
    i18n.t("auth.register.generalInformation.validation.password_too_short", {
      min: 6,
    }),
  ),
  personalIdentifier: z
    .string()
    .min(
      10,
      i18n.t(
        "auth.register.generalInformation.validation.national_number_required",
      ),
    ),
  photoId: z.string(),
  file: z.file().optional(),
});
export type BaseRegistrationValues = z.infer<typeof BaseRegistrationSchema>;
export const intialBasicRegisterationValues: BaseRegistrationValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  personalIdentifier: "",
  photoId: "",
  file: undefined,
  phone: "",
};

//? Base schema for  provider registration
export const ResourceProviderSchema = BaseRegistrationSchema.extend({
  licenseOfService: z
    .string()
    .min(2, i18n.t("auth.register.providor.validation.license_required")),
  providerRole: z.string().optional(),
  workSiteType: z.string(),
  companyName: z
    .string()
    .min(2, i18n.t("auth.register.providor.validation.company_name_required")),
  location: z
    .string()
    .min(
      5,
      i18n.t("auth.register.providor.validation.company_location_required"),
    ),
  logoId: z.string().optional(),
  logoFile: z.file().optional(),
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
  licenseOfService: "",
  companyName: "",
  location: "",
  companyAddress: "",
  workSiteType: "",
  logoId: "",
  providerRole: "Resource",
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
  imageRecordFile: z.file().optional(),
});
export type InvestorFormValues = z.infer<typeof InvestorSchema>;
export const intialInvestoreValues: InvestorFormValues = {
  ...intialBasicRegisterationValues,
  commercialRegistration: "",
  imageRecord: "",
};

//? Engineering roles enum
export enum EEngineeringRole {
  Architect = 0,
  StructuralEngineer = 1,
  CivilEngineer = 2,
  MechanicalEngineer = 3,
  ElectricalEngineer = 4,
  GeotechnicalEngineer = 5,
  SanitaryEngineer = 6,
  FireSafetyEngineer = 7,
  QuantitySurveyor = 8,
  ConstructionProjectManager = 9,
  RestorationArchitect = 10,
  StructuralRemediationEngineer = 11,
  ForensicEngineer = 12,
  EnvironmentalHazmatSpecialist = 13,
  UrbanPlanner = 14,
}

export const engineeringRoleLabels: Record<EEngineeringRole, string> = {
  [EEngineeringRole.Architect]: i18n.t(
    "auth.register.engineer.roles.architect",
  ),
  [EEngineeringRole.StructuralEngineer]: i18n.t(
    "auth.register.engineer.roles.structuralEngineer",
  ),
  [EEngineeringRole.CivilEngineer]: i18n.t(
    "auth.register.engineer.roles.civilEngineer",
  ),
  [EEngineeringRole.MechanicalEngineer]: i18n.t(
    "auth.register.engineer.roles.mechanicalEngineer",
  ),
  [EEngineeringRole.ElectricalEngineer]: i18n.t(
    "auth.register.engineer.roles.electricalEngineer",
  ),
  [EEngineeringRole.GeotechnicalEngineer]: i18n.t(
    "auth.register.engineer.roles.geotechnicalEngineer",
  ),
  [EEngineeringRole.SanitaryEngineer]: i18n.t(
    "auth.register.engineer.roles.sanitaryEngineer",
  ),
  [EEngineeringRole.FireSafetyEngineer]: i18n.t(
    "auth.register.engineer.roles.fireSafetyEngineer",
  ),
  [EEngineeringRole.QuantitySurveyor]: i18n.t(
    "auth.register.engineer.roles.quantitySurveyor",
  ),
  [EEngineeringRole.ConstructionProjectManager]: i18n.t(
    "auth.register.engineer.roles.constructionProjectManager",
  ),
  [EEngineeringRole.RestorationArchitect]: i18n.t(
    "auth.register.engineer.roles.restorationArchitect",
  ),
  [EEngineeringRole.StructuralRemediationEngineer]: i18n.t(
    "auth.register.engineer.roles.structuralRemediationEngineer",
  ),
  [EEngineeringRole.ForensicEngineer]: i18n.t(
    "auth.register.engineer.roles.forensicEngineer",
  ),
  [EEngineeringRole.EnvironmentalHazmatSpecialist]: i18n.t(
    "auth.register.engineer.roles.environmentalHazmatSpecialist",
  ),
  [EEngineeringRole.UrbanPlanner]: i18n.t(
    "auth.register.engineer.roles.urbanPlanner",
  ),
};

//? Basic shcema for engineer
export const EngineerSchema = BaseRegistrationSchema.extend({
  specialty: z.nativeEnum(EEngineeringRole),
  syndicateId: z.string(),
});
export type EngineerFormValues = z.infer<typeof EngineerSchema>;
export const intialEngineerValues: EngineerFormValues = {
  ...intialBasicRegisterationValues,
  specialty: EEngineeringRole.Architect,
  syndicateId: "",
};

// API calls
enum AuthController {
  ProviderRegister = "/auth/provider-sign-up",
  InvestorRegister = "/auth/investor-sign-up",
  EngineerRegister = "/auth/engineer-sign-up",
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
