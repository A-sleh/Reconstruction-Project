import React from "react";

type ButtonVariant = "solid" | "outline" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  variant = "solid",
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) => {
  const baseClasses =
    "w-full rounded-full py-2 md:py-3 text-[12px] md:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer";

  const variantClasses = {
    solid: "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-secondary-hover text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
