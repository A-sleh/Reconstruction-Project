import React, { useId } from "react";
import DisplayInputErrors from "../shared/Display-input-errors";
import { FiEye } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";

type InputProps = {
  type: string;
  label?: string;
  fieldName?: string;
  placeholder?: string;
  value?: string | number;
  required?: boolean;
  disabled?: boolean;
  loadInitialValue?: boolean;
  errors?: string[] | null;
  className?: string;
  setValue?: (value: string) => void;
};

function selectIcon(type: string) {
  switch (type) {
    case "password":
        return <FiEye />;
    case "email":
        return <AiOutlineMail />
    default:
      return null;
  }
}

const Input: React.FC<InputProps> = ({
  type,
  value,
  setValue,
  label = "",
  placeholder = "",
  disabled = false,
  required = false,
  className = "",
  loadInitialValue = false,
  fieldName = "",
  errors = null,
  ...props
}) => {
  const inputId = useId();

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col gap-1 text-right relative">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {required && <span className="text-red-600">*</span>} {label}
          </label>
        )}
        {loadInitialValue ? (
          <div className="h-8 bg-gray-200 animate-pulse rounded-sm" />
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3  has-focus-within:border-primary transition-all">
            <input
              id={inputId}
              type={type}
              value={value}
              onChange={(e) => setValue?.(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              {...props}
            />
            {selectIcon(type)}
          </div>
        )}
      </div>
      <DisplayInputErrors errors={errors} fieldName={fieldName} />
    </div>
  );
};

export default Input;
