import { t } from "i18next";
import z from "zod";

// Define the validation schema with dynamic translation messages inside the component
export const siteFormSchema = z.object({
  name: z
    .string()
    .min(1, t("resourceProvidor.workSites.validation-name-req"))
    .trim(),
  companyLocation: z.string().trim().optional().default(""),
  manager: z.string().trim().optional().default(""),
  status: z.enum(["active", "on-hold", "completed"] as const),
  startDate: z
    .string()
    .min(1, t("resourceProvidor.workSites.validation-date-req")),
  progress: z
    .number()
    .min(0, t("resourceProvidor.workSites.validation-progress-min"))
    .max(100, t("resourceProvidor.workSites.validation-progress-max")),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;
