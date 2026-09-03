import { useCallback, useEffect, useId, useRef, useState } from "react";

import Quill from "quill";
import type { FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";

import DisplayInputErrors from "@/components/shared/Display-input-errors";

type RichTextBoardProps = {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  errors?: FieldErrors | null;
  fieldName?: string;
  className?: string;
  value?: string;
  onChange?: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  maxLength?: number;
};

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ script: "sub" }, { script: "super" }],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"],
];

function RichTextBoard({
  label = "",
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = "Start writing...",
  errors = null,
  fieldName = "",
  className = "",
  value = "",
  onChange,
  onImageUpload,
  maxLength,
}: RichTextBoardProps) {
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const { i18n } = useTranslation();

  const [invalid, setInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const hasError = Boolean(errors && fieldName && errors[fieldName]);
    setInvalid(hasError);
  }, [errors, fieldName]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleImageInsert = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const quill = quillRef.current;
      if (!quill) return;

      if (onImageUpload) {
        try {
          const url = await onImageUpload(file);
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url, "user");
          quill.setSelection(range.index + 1, 0, "silent");
        } catch {
          // silently fail — user can retry
        }
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", dataUrl, "user");
          quill.setSelection(range.index + 1, 0, "silent");
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [onImageUpload]);

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const container = containerRef.current;
    const isRtl = i18n.language === "ar";

    const quill = new Quill(container, {
      theme: "snow",
      placeholder,
      readOnly: readOnly || disabled,
      modules: {
        toolbar: {
          container: TOOLBAR_OPTIONS,
          handlers: {
            image: handleImageInsert,
          },
        },
      },
    });

    if (isRtl) {
      quill.format("direction", "rtl");
      quill.format("align", "right");
    }

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    quillRef.current = quill;

    const textChangeHandler = () => {
      const html = quill.root.innerHTML;
      onChangeRef.current?.(html);
    };

    quill.on("text-change", textChangeHandler);

    quill.root.addEventListener("focus", () => setIsFocused(true));
    quill.root.addEventListener("blur", () => setIsFocused(false));

    return () => {
      quill.off("text-change", textChangeHandler);
      quillRef.current = null;

      const parent = container.parentNode;
      if (parent) {
        const toolbar = container.previousElementSibling;
        const containerWrap = container.parentElement;

        if (containerWrap && containerWrap.classList.contains("ql-container")) {
          containerWrap.remove();
        }
        if (toolbar && toolbar.classList.contains("ql-toolbar")) {
          toolbar.remove();
        }
      }
      container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const currentHtml = quill.root.innerHTML;
    if (value !== currentHtml) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    quill.enable(!disabled);
  }, [disabled]);

  const charCount = quillRef.current
    ? quillRef.current.getText().trim().length - 1
    : 0;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-[11px] text-muted-foreground mb-0.5 md:text-sm inline-block ${
            disabled ? "cursor-not-allowed opacity-70" : ""
          } ${invalid ? "text-red-400" : ""}`}
        >
          {required && <span className="text-red-600">*</span>} {label}
        </label>
      )}

      <div
        id={inputId}
        className={`rounded-lg transition-all duration-200 ${
          isFocused && !invalid ? "ring-2 ring-primary/15 ring-offset-2" : ""
        } ${invalid ? "ring-2 ring-red-400/30 ring-offset-2" : ""}`}
      >
        <div ref={containerRef} />
      </div>

      {maxLength && (
        <div className="flex justify-end mt-1">
          <span
            className={`text-[10px] ${
              charCount > maxLength
                ? "text-red-500 font-medium"
                : "text-muted-foreground"
            }`}
          >
            {charCount}/{maxLength}
          </span>
        </div>
      )}

      <DisplayInputErrors errors={errors ?? {}} fieldName={fieldName} />
    </div>
  );
}

export default RichTextBoard;
