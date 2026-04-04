import { ErrorMessage } from "@hookform/error-message";

interface IDisplayInputErrorsProps {
  errors: string[] | null;
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
        render={({ messages }) =>
          messages &&
          Object.entries(messages).map(([type, message]) => {
            return (
              <p className="text-red-500 mt-2 text-sm text-nowrap" key={type}>
                {message}
              </p>
            );
          })
        }
      />
    );
  }
  return null;
}