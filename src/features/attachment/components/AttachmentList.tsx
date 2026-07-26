import { useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Trash2, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentItem {
  id: number;
  description: string;
  name?: string;
  url?: string;
}

interface AttachmentListProps<T extends AttachmentItem> {
  fields: T[];
  register: UseFormRegister<any>;
  errors?: FieldErrors | null;
  basePath?: string;
  onUpload: (file: File) => void;
  onRemove: (idx: number) => void;
  onRevert?: (item: T) => void;
  pendingItems?: T[];
  isUploading?: boolean;
  accept?: string;
}

export default function AttachmentList<T extends AttachmentItem>({
  fields,
  register,
  errors,
  basePath = "attachments",
  onUpload,
  onRemove,
  onRevert,
  pendingItems = [],
  isUploading = false,
  accept = "*",
}: AttachmentListProps<T>) {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground block">
        {t("investor.label-attachments", "Attachments")}
      </label>

      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
            >
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {field.name || `File ${idx + 1}`}
                </p>
                <input
                  {...register(`${basePath}.${idx}.description`)}
                  placeholder={t(
                    "investor.placeholder-attachment-desc",
                    "Add description...",
                  )}
                  className="w-full mt-1 text-xs bg-transparent border-b border-border outline-none py-1 placeholder:text-muted-foreground"
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onRemove(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {pendingItems.length > 0 && onRevert && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {t(
              "investor.removedAttachments",
              "Removed attachments (click to restore):",
            )}
          </p>
          {pendingItems.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-muted/10 opacity-60"
            >
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{att.name || "File"}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => onRevert(att)}
              >
                {t("investor.revert", "Restore")}
              </Button>
            </div>
          ))}
        </div>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-dashed transition-colors text-sm ${
          isDragOver
            ? "border-primary bg-primary/10 text-foreground"
            : "border-border hover:border-primary hover:bg-muted/50 text-muted-foreground hover:text-foreground"
        }`}
      >
        <Upload className="h-4 w-4" />
        {isUploading
          ? t("common.loading", "Uploading...")
          : t("investor.uploadAttachment", "Upload Attachment")}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          disabled={isUploading}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
