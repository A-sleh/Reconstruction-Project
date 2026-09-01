import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SectionKey } from "../constants";
import { SECTION_KEYS } from "../constants";

interface Props {
  value: SectionKey;
  onValueChange: (v: SectionKey) => void;
}

export default function OpenProjectsSections({ value, onValueChange }: Props) {
  const { t } = useTranslation();

  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as SectionKey)}>
      <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-muted/50 p-1">
        {SECTION_KEYS.map((key) => (
          <TabsTrigger
            key={key}
            value={key}
            className="rounded-full px-4 py-1.5 text-xs font-medium"
          >
            {t(`openProjects.sections.${key}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
