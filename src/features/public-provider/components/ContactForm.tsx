import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { successToast } from "@/components/common/Toast";
import Input from "@/components/inputs/Input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  providerName?: string;
}

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm({ providerName }: ContactFormProps) {
  const { t } = useTranslation();

  const schema = z.object({
    name: z.string().nonempty(t("publicProvider.contact.validation.nameRequired")),
    email: z
      .string()
      .nonempty(t("publicProvider.contact.validation.emailRequired"))
      .email(t("publicProvider.contact.validation.emailInvalid")),
    phone: z.string().optional(),
    message: z
      .string()
      .nonempty(t("publicProvider.contact.validation.messageRequired")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
    mode: "onChange",
  });

  const onSubmit = (values: ContactFormValues) => {
    // TODO: send the message via the public contact API for this provider.
    successToast(t("publicProvider.contact.success"));
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <Input
        label={t("publicProvider.contact.name")}
        id="contact-name"
        placeholder={t("publicProvider.contact.namePlaceholder")}
        fieldName="name"
        errors={errors}
        {...register("name")}
      />
      <Input
        label={t("publicProvider.contact.email")}
        id="contact-email"
        type="email"
        placeholder={t("publicProvider.contact.emailPlaceholder")}
        fieldName="email"
        errors={errors}
        {...register("email")}
      />
      <div className="sm:col-span-2">
        <Input
          label={t("publicProvider.contact.phone")}
          id="contact-phone"
          type="tel"
          placeholder={t("publicProvider.contact.phonePlaceholder")}
          fieldName="phone"
          errors={errors}
          {...register("phone")}
        />
      </div>
      <div className="sm:col-span-2">
        <Textarea
          label={t("publicProvider.contact.message")}
          placeholder={t("publicProvider.contact.messagePlaceholder")}
          rows={4}
          fieldName="message"
          errors={errors}
          {...register("message")}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
          {t("publicProvider.contact.send")}
        </Button>
      </div>
    </form>
  );
}
