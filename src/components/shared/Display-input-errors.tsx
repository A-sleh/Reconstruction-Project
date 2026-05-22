import { ErrorMessage } from "@hookform/error-message";
import type { FieldErrors } from "react-hook-form";

interface IDisplayInputErrorsProps {
  errors: FieldErrors;
  fieldName: string;
}

export default function DisplayInputErrors({
  errors,
  fieldName,
}: IDisplayInputErrorsProps) {
  if (errors) {
    return (
      <ErrorMessage
        errors={errors}
        name={fieldName}
        render={({ messages }) => {
          if (messages) {
            return Object.entries(messages).map(([type, message]) => (
              <p
                className="text-red-500 mt-2 text-[10px] text-nowrap"
                key={type}
              >
                {message}
              </p>
            ));
          }
        }}
      />
    );
  }
  return null;
}
