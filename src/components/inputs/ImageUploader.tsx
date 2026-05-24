import React, { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiImage } from "react-icons/fi";
import { type FieldErrors } from "react-hook-form";
import DisplayInputErrors from "@/components/shared/Display-input-errors";

type ImageUploaderProps = {
  label?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  fileName?: string;
  onFileChange?: (file: File | null) => void;
  errors?: FieldErrors | null;
  fieldName?: string;
  className?: string;
  value?: string | null;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  accept = "image/*",
  disabled = false,
  required = false,
  onFileChange,
  errors = null,
  fieldName = "",
  className = "",
  value
}) => {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ? value : null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    onFileChange?.(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onFileChange?.(null);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-[13px] md:text-sm mb-2 inline-block">
          {required && <span className="text-red-600">*</span>} {label}
        </label>
      )}

      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              handleClick();
            }
          }}
          className={`group flex min-h-40 cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-border bg-card/80 px-4 py-6 text-center transition-all hover:border-primary ${
            disabled ? "cursor-not-allowed opacity-70" : "hover:bg-card/95"
          }`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label ?? t("auth.register.investor.imageRecord")}
              className="max-h-48 w-full rounded-3xl object-cover"
            />
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <FiImage className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("auth.register.investor.uploadImageTitle")}</p>
                <p className="text-xs text-muted-foreground">{t("auth.register.investor.uploadImageHelp")}</p>
              </div>
            </>
          )}
        </div>

        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm"
          >
            {t("auth.register.investor.removeImage")}
          </button>
        )}
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={handleFileChange}
      />

      {fieldName && errors && <DisplayInputErrors errors={errors} fieldName={fieldName} />}
    </div>
  );
};

export default ImageUploader;
