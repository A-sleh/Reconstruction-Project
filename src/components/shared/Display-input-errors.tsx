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
  // console.log(errors,fieldName)
  
  if (errors) {
    return (
      <ErrorMessage
        errors={errors}
        name={fieldName}
        render={({ messages }) => {
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => {
              console.log(messages);
              return (
                <p className="text-red-500 mt-2 text-[12px] text-nowrap" key={type}>
                  {message}
                </p>
              );
            })
          );
        }}
      />
    );
  }
  return null;
}
