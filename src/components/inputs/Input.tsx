import React, { useEffect, useId, useState, type InputHTMLAttributes } from "react";
import { EmptyObject, type FieldErrors } from "react-hook-form";
import DisplayInputErrors from "../shared/Display-input-errors";

import { FaRegCircleUser } from "react-icons/fa6";
import { FiEye } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  fieldName?: string;
  required?: boolean;
  disabled?: boolean;
  loadInitialValue?: boolean;
  errors?: FieldErrors | EmptyObject;
  className?: string;
  iconType?: "password" | "email" | "user" | "personalIdentifier";
  setValue?: (value: string) => void;
};

function selectIcon(type: string) {
  switch (type) {
    case "password":
        return <FiEye />;
    case "email":
        return <AiOutlineMail />
    case "user":
        return <FaRegUser />
    case "personalIdentifier":
        return <FaRegCircleUser />
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
  iconType = '',
  ...props
}) => {
  const inputId = useId();
  const [invalid, setInvalid] = useState(false); // level up the validation from error message resolve which came from react hook form lib

  useEffect(() => {
    const hasError = Boolean(errors && fieldName && (errors as any)[fieldName]);
    setInvalid(hasError);
  }, [errors, fieldName]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col gap-1 relative">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-[13px] mb-0.5 md:text-sm ${disabled ? "cursor-not-allowed opacity-70" : ""} ${invalid &&"text-red-400"}`}
          >
            {required && <span className="text-red-600">*</span>} {label}
          </label>
        )}
        {loadInitialValue ? (
          <div className="h-8 bg-gray-200 animate-pulse rounded-sm" />
        ) : (
          <div className={`flex items-center  gap-3 rounded-lg border border-border px-2  md:px-4 py-2 md:py-3  has-focus-within:border-primary transition-all ${invalid&&"border-red-400"} border-gray-300 bg-gray-200/40`}>
            <input
              id={inputId}
              type={type}
              value={value}
              onChange={(e) => setValue?.(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={`bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground w-full`}
              {...props}
            />
            {selectIcon(iconType)}
          </div>
        )}
      </div>
      <DisplayInputErrors errors={errors} fieldName={fieldName}  />
    </div>
  );
};

export default Input;
