import { ShieldCheck, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  totalListings: number;
  verifiedCount: number;
}

function MarketplaceHeader({ totalListings, verifiedCount }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("marketplace.header.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("marketplace.header.subtitle")}
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
          <Tag className="h-3.5 w-3.5" />
          {t("marketplace.header.listings", { count: totalListings })}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("marketplace.header.verified", { count: verifiedCount })}
        </span>
      </div>
    </div>
  );
}

export default MarketplaceHeader;
