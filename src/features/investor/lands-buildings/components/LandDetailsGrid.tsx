import { ExternalLink, FileText, Loader2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import ConfirmDelete from "@/components/model/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDownloadFile } from "@/features/attachment/api/useDownloadFile";

import { useUpdateLand } from "../api/actions";
import { buildUpdatePayload } from "../api/DTOs";
import { type Attachment, type LandDetail } from "../api/types";
import AddAttachmentPopup from "./AddAttachmentPopup";
import EditLandPopup from "./EditLandPopup";

interface LandDetailsGridProps {
  land: LandDetail;
}

export default function LandDetailsGrid({ land }: LandDetailsGridProps) {
  const { t } = useTranslation();
  const { mutate: updateLand, isPending: isUpdating } = useUpdateLand();
  const { download, isDownloading } = useDownloadFile();

  const handleSaveAttachments = (
    items: Attachment[],
    closePopup: () => void,
  ) => {
    updateLand(buildUpdatePayload(land, items), {
      onSuccess: () => closePopup(),
    });
  };

  const handleDeleteAttachment = (attId: number) => {
    const updated = land.attachments.filter((a) => a.id !== attId);
    updateLand(buildUpdatePayload(land, updated));
  };
  const infoRows = [
    { label: t("investor.label-address"), value: land.address },
    { label: t("investor.label-zoning"), value: land.zoningType },
    {
      label: t("investor.area"),
      value: `${land.area.toLocaleString()} ${t("investor.squareMeters")}`,
    },
    {
      label: t("investor.label-accessibility"),
      value: land.accessability ? t("investor.yes") : t("investor.no"),
    },
    {
      label: t("investor.validated"),
      value: land.isValidated ? t("investor.yes") : t("investor.no"),
    },
    {
      label: t("investor.location"),
      value: land.location
        ? `${land.location.latitude.toFixed(6)}, ${land.location.longitude.toFixed(6)}`
        : "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {t("investor.landInformation")}
          </CardTitle>
          <EditLandPopup land={land} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {infoRows.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {row.label}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {t("investor.attachments")}
          </CardTitle>
          <AddAttachmentPopup
            initialItems={[]}
            onSave={handleSaveAttachments}
            isSaving={isUpdating}
          />
        </CardHeader>
        <CardContent>
          {land.attachments.length > 0 ? (
            <ul className="space-y-2">
              {land.attachments.map((att) => (
                <li key={att.id} className="flex items-center gap-2">
                  <button
                    onClick={() => download(att.id, att.name)}
                    disabled={isDownloading}
                    className="flex items-center gap-2 text-sm text-primary hover:underline flex-1 min-w-0 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">
                      {att.description || att.name}
                    </span>
                    {att.url && (
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  <ConfirmDelete
                    item={att.name}
                    onConfirm={() => handleDeleteAttachment(att.id)}
                    isLoading={isUpdating}
                    openButton={
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t("investor.noAttachments")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
