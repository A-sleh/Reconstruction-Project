import React, { useEffect, useId, useState, type ReactNode } from "react";
import { type FieldErrors } from "react-hook-form";
import DisplayInputErrors from "@/components/shared/Display-input-errors";

interface SelectorProps {
  value: any;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  asInput?: boolean;
  setValue: (params: any) => void;
  children: ReactNode;
  fieldName?: string;
  errors?: FieldErrors | null;
  className?: string;
}

const Selector: React.FC<SelectorProps> = ({
  label = "",
  setValue,
  value,
  asInput = true,
  disabled = false,
  required = false,
  fieldName = "",
  errors = null,
  className = "",
  children,
}) => {
  const inputId = useId();
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const hasError = Boolean(errors && fieldName && (errors as any)[fieldName]);
    setInvalid(hasError);
  }, [errors, fieldName]);

  return (
    <div className={`flex flex-col  w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm ${invalid ? "text-red-400" : ""}`}
        >
          {required && <span className="text-red-600">*</span>} {label}
        </label>
      )}

      <select
        id={inputId}
        value={value}
        disabled={disabled}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        className={`flex items-center gap-3 mt-1 rounded-lg border bg-card px-2 md:px-2 py-1 md:py-1.5 has-focus-within:border-primary transition-all border-gray-300 ${
          asInput
            ? "bg-gray-200/40"
            : "bg-white md:py-0 rounded-md"
        } ${invalid ? "border-red-400 bg-red-300/30" : ""}`}
      >
        {children}
      </select>

      <DisplayInputErrors errors={errors ?? {}} fieldName={fieldName} />
    </div>
  );
};

export default Selector;
