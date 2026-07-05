import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const switchRef = React.useRef<null | HTMLInputElement>(null);
  const isChecked = switchRef.current?.dataset["state"] == "checked";
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        ref={switchRef}
        style={{
          transform: `translateX(${isArabic ? (isChecked ? "-100%" : "0%") : isChecked ? "100%" : "0%"})`,
        }}
        className={cn(
          `pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform `,
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
