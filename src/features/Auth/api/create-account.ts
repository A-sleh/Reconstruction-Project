import z from "zod";
import { TFunction } from "i18next";

export const CreateBaseRegistrationSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .min(2, t("validation.baseRegisterForm.name_required")),
    lastName: z.string().min(2, t("validation.baseRegisterForm.last_name_required")),
    email: z.string().email(t("validation.baseRegisterForm.invalid_email")),
    password: z
      .string()
      .min(6, t("validation.baseRegisterForm.password_too_short", { min: 6 })),
    NationalNumber: z
      .string()
      .min(10, t("validation.baseRegisterForm.national_number_required")),
  });
export type BaseRegistrationValues = z.infer<
  ReturnType<typeof CreateBaseRegistrationSchema>
>;

// Base schema for service provider registration
export const CreateResourceProviderSchema = (t: TFunction) =>
  CreateBaseRegistrationSchema(t).extend({
    license: z.string().min(2, t("validation.resourceProvider.license_required")),
    companyName: z.string().min(2, t("validation.resourceProvider.company_name_required")),
    companyLocation: z.string().min(5, t("validation.resourceProvider.company_location_required")),
    companyAddress: z.string().min(5, t("validation.resourceProvider.company_address_required")),
  });

export type ResourceProviderFormValues = z.infer<
  ReturnType<typeof CreateResourceProviderSchema>
>;
export const intialResourceProviderValues: ResourceProviderFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  license: "",
  companyName: "",
  companyLocation: "",
  companyAddress: "",
  NationalNumber: "",
};
