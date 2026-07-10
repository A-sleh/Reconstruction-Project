import React from "react";

type ButtonVariant = "solid" | "outline" | "secondary" | "primary";

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
    "inline-flex items-center justify-center gap-2 h-10 px-6 text-body font-medium transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base cursor-pointer";

  const variantClasses = {
    solid: "bg-primary text-primary-foreground hover:opacity-90 rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-secondary-hover text-white hover:bg-secondary rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
    primary: "bg-brand-primary text-brand-primary-ink rounded-pill shadow-ambient hover:bg-[#C4EB2E] disabled:bg-canvas-overlay disabled:text-ink-tertiary disabled:cursor-not-allowed",
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
