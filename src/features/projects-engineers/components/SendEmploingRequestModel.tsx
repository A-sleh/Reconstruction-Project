import { useState } from "react";

import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import PopuupLayout from "@/components/layouts/Popup-layout";

interface Props {
  engineerName: string;
}

const SendEmploingRequestModel = ({ engineerName }: Props) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (closeModel: () => void) => {
    if (!description.trim()) return;
    setSending(true);
    // TODO: replace with real mutation
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setDescription("");
    closeModel();
  };

  return (
    <PopuupLayout
      openKey={`hire-${engineerName}`}
      openButton={
        <button
          type="button"
          aria-label={t("projectsEngineers.card.hire", "Send hiring request")}
          title={t("projectsEngineers.card.hire", "Send hiring request")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-white shadow-md opacity-0 translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] delay-100 group-hover:translate-y-0 group-hover:opacity-100  active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
        </button>
      }
      title={t(
        "projectsEngineers.modal.title",
        "Send hiring request to {{name}}",
        { name: engineerName },
      )}
      subTitle={t(
        "projectsEngineers.modal.description",
        "Describe the job details, duration, and any requirements. The engineer will review your request.",
      )}
    >
      {(closeModel) => (
        <div className="space-y-4 px-1 pb-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t(
              "projectsEngineers.modal.placeholder",
              "e.g. We need a structural assessment for a 3-story building in Damascus, expected duration 2 weeks...",
            )}
            rows={5}
            className="w-full resize-none rounded-xl border border-gray-300 bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-smooth"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModel}
              disabled={sending}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
            >
              {t("projectsEngineers.modal.cancel", "Cancel")}
            </button>
            <button
              type="button"
              onClick={() => handleSend(closeModel)}
              disabled={!description.trim() || sending}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm transition-smooth hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending
                ? t("projectsEngineers.modal.sending", "Sending...")
                : t("projectsEngineers.modal.send", "Send Request")}
            </button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
};

export default SendEmploingRequestModel;
