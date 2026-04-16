import z from "zod";
import { TFunction } from "i18next";

//? Baisc schema for user information
export const CreateBaseRegistrationSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .min(2, t("auth.register.validation.name_required")),
    lastName: z
      .string()
      .min(2, t("auth.register.validation.last_name_required")),
    email: z.string().email(t("auth.register.validation.invalid_email")),
    password: z
      .string()
      .min(6, t("auth.register.validation.password_too_short", { min: 6 })),
    NationalNumber: z
      .string()
      .min(10, t("auth.register.validation.national_number_required")),
  });
export type BaseRegistrationValues = z.infer<
  ReturnType<typeof CreateBaseRegistrationSchema>
>;
export const intialBasicRegisterationValues: BaseRegistrationValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  NationalNumber: "",
};

//? Base schema for  provider registration
export const CreateResourceProviderSchema = (t: TFunction) =>
  CreateBaseRegistrationSchema(t).extend({
    license: z
      .string()
      .min(2, t("auth.register.providor.validation.license_required")),
    companyName: z
      .string()
      .min(2, t("auth.register.providor.validation.company_name_required")),
    companyLocation: z
      .string()
      .min(5, t("auth.register.providor.validation.company_location_required")),
    companyAddress: z
      .string()
      .min(5, t("auth.register.providor.validation.company_address_required")),
  });

export type ResourceProviderFormValues = z.infer<
  ReturnType<typeof CreateResourceProviderSchema>
>;
export const intialProviderValues: ResourceProviderFormValues = {
  ...intialBasicRegisterationValues,
  license: "",
  companyName: "",
  companyLocation: "",
  companyAddress: "",
};

//? Basic shcema for invetor
export const CreateInvestorSchema = (t: TFunction) =>
  CreateBaseRegistrationSchema(t).extend({
    commercialRegistration: z
      .string()
      .min(2, t("auth.register.investor.validation.commercial_registration_required")),
    imageRecord: z.string().min(2, t("auth.register.investor.validation.image_record")),
  });
export type InvestorFormValues = z.infer<
  ReturnType<typeof CreateInvestorSchema>
>;
export const intialInvestoreValues: InvestorFormValues = {
  ...intialBasicRegisterationValues,
  commercialRegistration: "",
  imageRecord: "",
};

//? Basic shcema for engineer
export const CreateEngineerSchema = (t: TFunction) =>
  CreateBaseRegistrationSchema(t).extend({
    specialtiy: z.string().min(10, t("auth.register.engineer.validation.specialtiy")),
    syndicateId: z.string().min(12, t("auth.register.engineer.validation.syndicate_id")),
  });
export type EngineerFormValues = z.infer<
  ReturnType<typeof CreateEngineerSchema>
>;
export const intialEngineerValues: EngineerFormValues = {
  ...intialBasicRegisterationValues,
  specialtiy: "",
  syndicateId: "",
};
