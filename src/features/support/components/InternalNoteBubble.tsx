import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InternalNoteBubbleProps {
  senderName: string;
  content: string;
  createdAt?: string;
}

const InternalNoteBubble = ({
  senderName,
  content,
  createdAt,
}: InternalNoteBubbleProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 max-w-2xl">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <Lock className="size-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900">
            {t("support.agent.workspace.internalNote", "Internal note ({name})", {
              name: senderName,
            })}
          </span>
          {createdAt && (
            <span className="text-[10px] text-amber-600">
              {new Date(createdAt).toLocaleString()}
            </span>
          )}
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
          {content}
        </div>
      </div>
    </div>
  );
};

export default InternalNoteBubble;
