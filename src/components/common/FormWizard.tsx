import { type ReactNode, useState } from "react";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Reusable multi-step wizard backed by a react-hook-form context.
 *
 * IMPORTANT: The component consumes the form via `useFormContext()`, so the
 * parent MUST wrap it in a `<FormProvider {...methods}>` — e.g.
 *
 *   const methods = useForm({ resolver, defaultValues, mode: "onSubmit" });
 *   <FormProvider {...methods}>
 *     <FormWizard ...>{renderStep}</FormWizard>
 *   </FormProvider>
 *
 * The parent keeps ownership of `methods` (register/setValue/watch/mutations),
 * while this component handles the stepper UI + per-step validation.
 */

export interface FormWizardStep {
  /** Unique key used for React lists / lookups. */
  key: string;
  /** Label shown under the step indicator. */
  label: string;
  /** Field names validated before advancing (leave empty to skip validation). */
  fields?: string[];
}

interface FormWizardProps {
  steps: FormWizardStep[];
  /** Renders the content for the current step. */
  children: (step: number) => ReactNode;
  /** Called after the final step passes validation. */
  onSubmit: () => void;
  /** True while submitting to disable navigation. */
  isPending?: boolean;
  /** Label for the submit button. */
  submitLabel: string;
  /** Label for the "next" button. */
  nextLabel: string;
  /** Label for the "back" button. */
  backLabel: string;
  /** Label for the "cancel" button. */
  cancelLabel: string;
  /** Called when the user cancels / resets. */
  onCancel?: () => void;
  /** Optional class names applied to the outer card. */
  className?: string;
  /** Controlled current step index (optional). */
  step?: number;
  /** Called whenever the current step changes. */
  onStepChange?: (step: number) => void;
}

export default function FormWizard({
  steps,
  children,
  onSubmit,
  isPending = false,
  submitLabel,
  nextLabel,
  backLabel,
  cancelLabel,
  onCancel,
  className,
  step: controlledStep,
  onStepChange,
}: FormWizardProps) {
  const { trigger, handleSubmit } = useFormContext();
  const isControlled = controlledStep !== undefined;
  const [internalStep, setInternalStep] = useState(0);

  const step = isControlled ? controlledStep : internalStep;

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    if (isControlled) {
      onStepChange?.(clamped);
    } else {
      setInternalStep(clamped);
    }
  };

  const isLastStep = step === steps.length - 1;

  const handleNext = async () => {
    const fields = steps[step]?.fields ?? [];
    const isValid = fields.length > 0 ? await trigger(fields as never[]) : true;
    if (isValid) goTo(step + 1);
  };

  const handleBack = () => goTo(step - 1);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "space-y-5 p-6 bg-canvas-elevated rounded-md border border-gray-300 bg-white",
        className,
      )}
    >
      {/* Stepper */}
      <div className="mb-2 rounded-lg border border-gray-300 bg-white p-4">
        <div
          className="relative grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          }}
        >
          <div className="absolute inset-inline-start-4 inset-inline-end-4 top-5 h-0.5 bg-border" />
          <div
            className="absolute inset-inline-start-4 top-5 h-0.5 bg-primary transition-all duration-500"
            style={{
              width: `calc((100% - 2rem) * ${steps.length > 1 ? step / (steps.length - 1) : 0})`,
            }}
          />
          {steps.map((s, index) => {
            const done = step > index;
            const active = step === index;
            return (
              <div
                key={s.key}
                className="relative flex flex-col items-center text-center gap-1.5"
              >
                <div
                  className={cn(
                    "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all",
                    done && "border-primary bg-primary text-primary-foreground",
                    active && "border-primary bg-emerald-soft text-primary",
                    !done && !active && "border-border text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div
                  className={cn(
                    "text-xs md:text-sm font-medium leading-tight",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {children(step)}

      <div className="flex justify-between gap-3 pt-2">
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isPending}
            >
              {backLabel}
            </Button>
          )}
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              {cancelLabel}
            </Button>
          )}
        </div>

        {isLastStep ? (
          <Button type="submit" disabled={isPending}>
            {submitLabel}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext} disabled={isPending}>
            {nextLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
