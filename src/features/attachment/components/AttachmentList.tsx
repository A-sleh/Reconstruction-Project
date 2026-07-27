import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Trash2, Upload, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/features/attachment/api/actions";
import { Attachment } from "@/features/investor/lands-buildings/api/types";

type AttachmentFormValues = {
  attachments: Attachment[];
};

export interface AttachmentListHandle {
  getValues: () => Attachment[];
}

// ── Self-contained mode ──
interface SelfContainedProps {
  mode: "self-contained";
  initialItems?: Attachment[];
  isSaving?: boolean;
  accept?: string;
}

// ── Legacy controlled mode (BasicLandInfoForm / BuildingForm) ──
interface LegacyProps {
  mode?: "legacy";
  fields: Attachment[];
  register: UseFormRegister<any>;
  errors?: FieldErrors | null;
  basePath?: string;
  onUpload: (file: File) => void;
  onRemove: (idx: number) => void;
  onRevert?: (item: Attachment) => void;
  pendingItems?: Attachment[];
  isUploading?: boolean;
  accept?: string;
}

type AttachmentListProps = SelfContainedProps | LegacyProps;

function isSelfContained(props: AttachmentListProps): props is SelfContainedProps {
  return props.mode === "self-contained";
}

const AttachmentList = forwardRef<AttachmentListHandle, AttachmentListProps>(
  function AttachmentList(props, ref) {
    const { t } = useTranslation();
    const [isDragOver, setIsDragOver] = useState(false);

    // ── Self-contained state ──
    const { mutate: uploadFile, isPending: isUploadingInternal } = useUploadFile();
    const { register, control, getValues, reset } = useForm<AttachmentFormValues>({
      defaultValues: { attachments: [] },
    });
    const { fields, append, remove } = useFieldArray({ control, name: "attachments" });
    const [pendingItems, setPendingItems] = useState<Attachment[]>([]);

    const isUploading = isSelfContained(props) ? isUploadingInternal : (props.isUploading ?? false);

    // Sync when initialItems change (stable: only re-sync when content actually changes)
    const initialItemsKey = isSelfContained(props) ? JSON.stringify(props.initialItems) : null;
    const prevItemsKeyRef = useRef<string | null>(null);
    useEffect(() => {
      if (isSelfContained(props) && initialItemsKey !== prevItemsKeyRef.current) {
        prevItemsKeyRef.current = initialItemsKey;
        reset({
          attachments: (props.initialItems ?? []).map((a) => ({
            id: a.id,
            name: a.name ?? "",
            description: a.description,
          })),
        });
        setPendingItems([]);
      }
    }, [initialItemsKey]);

    // Expose getValues to parent
    useImperativeHandle(ref, () => ({
      getValues: () => getValues().attachments,
    }));

    // ── Internal handlers ──
    const handleUploadInternal = useCallback(
      (file: File) => {
        uploadFile(file, {
          onSuccess: (res) => {
            append({ id: Number(res.fileId), name: file.name, description: "" });
          },
        });
      },
      [uploadFile, append],
    );

    const handleRemoveInternal = useCallback(
      (idx: number) => {
        const field = fields[idx];
        if (field) {
          setPendingItems((prev) => [
            ...prev,
            { id: field.id, name: field.name, description: field.description, url: "" },
          ]);
        }
        remove(idx);
      },
      [fields, remove],
    );

    const handleRevertInternal = useCallback(
      (item: Attachment) => {
        append({ id: item.id, name: item.name ?? "", description: item.description });
        setPendingItems((prev) => prev.filter((p) => p.id !== item.id));
      },
      [append],
    );

    // ── Resolve based on mode ──
    const handleUpload = isSelfContained(props) ? handleUploadInternal : props.onUpload;
    const handleRemove = isSelfContained(props) ? handleRemoveInternal : props.onRemove;
    const handleRevert = isSelfContained(props) ? handleRevertInternal : props.onRevert;
    const resolvedPending = isSelfContained(props) ? pendingItems : (props.pendingItems ?? []);
    const basePath = isSelfContained(props) ? "attachments" : (props.basePath ?? "attachments");
    const resolvedRegister = isSelfContained(props) ? register : props.register;
    const accept = props.accept ?? "*";
    const currentFields = isSelfContained(props) ? fields : props.fields;

    // ── Drag & Drop / File input ──
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
        e.target.value = "";
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleUpload(file);
    };

    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground block">
          {t("investor.label-attachments", "Attachments")}
        </label>

        {currentFields.length > 0 && (
          <div className="space-y-2">
            {currentFields.map((field, idx) => (
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
                    {...resolvedRegister(`${basePath}.${idx}.description`)}
                    placeholder={t("investor.placeholder-attachment-desc", "Add description...")}
                    className="w-full mt-1 text-xs bg-transparent border-b border-border outline-none py-1 placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleRemove(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {resolvedPending.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {t("investor.removedAttachments", "Removed attachments (click to restore):")}
            </p>
            {resolvedPending.map((att) => (
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
                  onClick={() => handleRevert(att)}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  {t("investor.revert", "Restore")}
                </Button>
              </div>
            ))}
          </div>
        )}

        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
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
  },
);

export default AttachmentList;
