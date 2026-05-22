import type { ReactNode } from "react";

interface SelectorProps {
  value: any;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  setValue: (params: any) => void;
  children: ReactNode;
}

const Selector: React.FC<SelectorProps> = ({
  label = "",
  setValue,
  value,
  disabled = false,
  required = false,
  children,
}) => {
  return (
    <div className="flex flex-col gap-1  w-full">
      {label && (
        <label htmlFor="input" className="text-sm">
          {required && <span className="text-red-600">*</span>} {label}
        </label>
      )}

      <select
        value={value}
        disabled={disabled}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        className="flex items-center gap-3 rounded-lg border border-border bg-card px-2  md:px-2 py-1 md:py-3  has-focus-within:border-primary transition-all"
      >
        {children}
      </select>
    </div>
  );
};

export default Selector;
