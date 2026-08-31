import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getDominImageURL } from "@/lib/helpers";

import type { PublicProviderProfile } from "../api/types";

interface ProviderHeroProps {
  provider: PublicProviderProfile;
}

export default function ProviderHero({ provider }: ProviderHeroProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="gradient-hero text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("publicProvider.back")}
        </motion.button>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative shrink-0"
          >
            <img
              src={getDominImageURL(provider.photo?.url ?? "")}
              alt={provider.name}
              className="h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-elegant"
            />
            <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-success text-white ring-4 ring-white/40">
              <BadgeCheck className="h-5 w-5" />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1"
          >
            <h1 className="text-3xl font-bold md:text-4xl">{provider.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                {t(
                  provider.providerType === "Resource"
                    ? "publicProvider.role.resource"
                    : "publicProvider.role.service",
                )}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/85">
                <BadgeCheck className="h-4 w-4" />
                {t("publicProvider.license")}: {provider.licenseNumber}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85">
              {provider.bio}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-2"
          >
            <a
              href={`tel:${provider.phone}`}
              className="inline-flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4" />
              {provider.phone}
            </a>
            <a
              href={`mailto:${provider.email}`}
              className="inline-flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" />
              {provider.email}
            </a>
            <Button
              size="sm"
              className="mt-2 w-full bg-white text-primary hover:bg-white/90"
              onClick={() =>
                document
                  .getElementById("public-contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("publicProvider.contat")}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
