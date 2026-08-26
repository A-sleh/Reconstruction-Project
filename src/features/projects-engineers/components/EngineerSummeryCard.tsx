import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Briefcase,
  MapPin,
  Phone,
  Star,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

import type { EngineerSummery } from '../api/types';
import SendEmploingRequestModel from './SendEmploingRequestModel';

interface Props {
  engineer: EngineerSummery;
  index?: number;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

const EngineerSummeryCard = ({ engineer, index = 0 }: Props) => {
  const { t } = useTranslation();

  const availabilityLabel = engineer.isAvilable
    ? t("projectsEngineers.card.available", "Available")
    : t("projectsEngineers.card.unavailable", "Unavailable");

  const stats = [
    {
      icon: Briefcase,
      value: `${engineer.yearsOfExperiance}+`,
      label: t("projectsEngineers.card.years", "Years Exp."),
    },
    {
      icon: BadgeCheck,
      value: engineer.numberOfCompletedProjects.toLocaleString(),
      label: t("projectsEngineers.card.projects", "Projects"),
    },
    {
      icon: Star,
      value: engineer.rate.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
      label: t("projectsEngineers.card.rating", "Rating"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group h-full rounded-lg p-1.5  transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:bg-black/[0.06]"
    >
      <div className="relative flex h-full flex-col rounded-lg bg-white p-5 ">
        {/* action  */}
        <div className="absolute top-3 end-3 z-10 flex flex-col gap-1.5">
          <a
            href={`tel:${engineer.contactNumber.replace(/\s/g, "")}`}
            aria-label={t("projectsEngineers.card.contact", "Contact engineer")}
            title={t("projectsEngineers.card.contact", "Contact engineer")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md opacity-0 translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0 group-hover:opacity-100 active:scale-95"
          >
            <Phone className="h-4 w-4 rtl:-scale-x-100" />
          </a>
          <SendEmploingRequestModel engineerName={engineer.fullName} />
        </div>

        {/* info */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            {engineer.imageUrl ? (
              <img
                src={engineer.imageUrl}
                alt={engineer.fullName}
                loading="lazy"
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/10 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary-hover text-sm font-bold text-white ring-2 ring-primary/10">
                {initialsOf(engineer.fullName)}
              </div>
            )}
            <span
              title={availabilityLabel}
              className={cn(
                "absolute -bottom-1 -end-1 h-4 w-4 rounded-full ring-[2.5px] ring-white",
                engineer.isAvilable ? "bg-emerald" : "bg-muted-foreground/40",
              )}
            />
          </div>

          <h3
            title={engineer.fullName}
            className="min-w-0 flex-1 truncate text-base font-bold text-foreground transition-colors duration-500 group-hover:text-primary"
          >
            {engineer.fullName}
          </h3>
        </div>

        {/* experiace  */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            title={engineer.spec}
            className="max-w-full truncate rounded-full bg-emerald-soft px-2.5 py-0.5 text-[11px] font-semibold text-emerald"
          >
            {engineer.spec}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              engineer.isAvilable
                ? "bg-emerald-soft text-emerald"
                : "bg-muted text-muted-foreground",
            )}
          >
            {availabilityLabel}
          </span>
        </div>

        <div className="mb-5 mt-5 grid grid-cols-3 gap-2">
          {" "}
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-background/80 px-2 py-2.5 text-center ring-1 ring-black/[0.03]"
            >
              <stat.icon
                className={cn(
                  "mx-auto h-3.5 w-3.5",
                  stat.icon === Star ? "fill-gold text-gold" : "text-accent",
                )}
              />
              <p className="mt-1.5 text-sm font-extrabold leading-none text-foreground tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1 truncate text-[10px] font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-2 border-t border-dashed border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span title={engineer.location} className="truncate">
              {engineer.location}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span dir="ltr" className="truncate tabular-nums">
              {engineer.contactNumber}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EngineerSummeryCard;
