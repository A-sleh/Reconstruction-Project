import { useState } from "react";

import { useTranslation } from "react-i18next";

import Selector from "@/components/inputs/Selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import type { KbCategory, TicketPriority } from "../api/types";

export interface NewTicketInput {
  category: string;
  subject: string;
  message: string;
  priority: TicketPriority;
}

interface CreateTicketSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewTicketInput) => void;
}

const PRIORITIES: TicketPriority[] = ["urgent", "high", "medium", "low"];

const CreateTicketSheet = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateTicketSheetProps) => {
  const { t } = useTranslation();

  const kbCategories = t("support.supportCenter.data.kb.categories", {
    returnObjects: true,
  }) as KbCategory[];

  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");

  const canSubmit = category.trim() && subject.trim() && message.trim();

  const resetForm = () => {
    setCategory("");
    setSubject("");
    setMessage("");
    setPriority("medium");
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ category, subject, message, priority });
    resetForm();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>
            {t("support.supportCenter.createTicket.title")}
          </SheetTitle>
          <SheetDescription>
            {t("support.supportCenter.createTicket.description")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label>{t("support.supportCenter.createTicket.category")}</Label>
            <Selector
              value={category}
              setValue={(value) => setCategory(value || "")}
            >
              {kbCategories.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </Selector>
          </div>

          <div className="space-y-2">
            <Label>{t("support.supportCenter.createTicket.subject")}</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t(
                "support.supportCenter.createTicket.subjectPlaceholder",
              )}
            />
          </div>

          <div className="space-y-2">
            <Selector
              label={t("support.supportCenter.createTicket.priority")}
              value={priority}
              setValue={(value) => setPriority(value as TicketPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {t(`support.agent.priority.${p}`)}
                </option>
              ))}
            </Selector>
          </div>

          <div className="space-y-2">
            <Textarea
              label={t("support.supportCenter.createTicket.message")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t(
                "support.supportCenter.createTicket.messagePlaceholder",
              )}
              className="min-h-32 "
            />
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("support.supportCenter.createTicket.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {t("support.supportCenter.createTicket.submit")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateTicketSheet;
