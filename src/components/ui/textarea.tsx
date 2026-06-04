import * as React from "react";
import { type FieldErrors } from "react-hook-form";
import { cn } from "@/lib/utils";
import DisplayInputErrors from "@/components/shared/Display-input-errors";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldName?: string;
  errors?: FieldErrors | null;
  label?: React.ReactNode;
  required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      errors = null,
      fieldName = "",
      required = false,
      label,
      ...props
    },
    ref,
  ) => {
    const [invalid, setInvalid] = React.useState(false);

    React.useEffect(() => {
      const hasError = Boolean(
        errors && fieldName && (errors as any)[fieldName],
      );
      setInvalid(hasError);
    }, [errors, fieldName]);

    return (
      <div className={`flex flex-col  w-full ${className}`}>
        {label && (
          <label className={`text-sm ${invalid ? "text-red-400" : ""}`}>
            {required && <span className="text-red-600">*</span>} {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-20 w-full mt-1 rounded-md border bg-gray-200/40 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none ring-primary focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            invalid &&
              "border-red-400 focus-visible:ring-red-400 bg-red-400/20",
            !invalid && "border-gray-300",
            className,
          )}
          ref={ref}
          {...props}
        />
        <DisplayInputErrors errors={errors ?? {}} fieldName={fieldName} />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
