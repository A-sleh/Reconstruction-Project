import { FC, ReactNode, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Button from "../inputs/Button";

/**
 * Props for the multi-step form component.
 *
 * @template T - The type of data returned by the final submit handler.
 */
interface IMultiStepFormProps<T> {
  /**
   * An array of schema validators for each step.
   * Each schema should correspond to the fields rendered inside the matching `subForms` entry.
   */
  schemas: any[];
  /**
   * A list of React nodes representing each step of the form.
   * Only the current step is rendered at a time.
   */
  subForms: ReactNode[];

  stepsLabel: string[];

  /**
   * Called when the final step is successfully submitted.
   * Receives the collected form data from React Hook Form.
   */
  finalSubmitHandler: (data: T) => void;

  disabled: boolean;
}

/**
 * A reusable multi-step form wrapper.
 *
 * This component uses React Hook Form to manage validation and submission.
 * It renders one step at a time and includes a header timeline that shows progress through each step.
 */
export const MultiStepForm: FC<IMultiStepFormProps<unknown>> = ({
  schemas,
  subForms,
  finalSubmitHandler,
  disabled,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [step, setStep] = useState(0);

  const methods = useForm({
    mode: "onSubmit",
    criteriaMode: "all",
    resolver: zodResolver(schemas[step]),
  });
  const isLastStep = step === schemas.length - 1;

  /**
   * Validate the current step and advance to the next step when valid.
   */
  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      setStep((currentStep) => currentStep + 1);
    }
  };

  /**
   * Navigate to the previous step.
   */
  const handleBack = () => {
    setStep((currentStep) => currentStep - 1);
  };

  /**
   * Submit handler for the form.
   * If this is the final step, execute the provided final submit handler.
   * Otherwise, advance to the next step.
   */
  const onSubmit = (data: unknown) => {
    if (isLastStep) {
      finalSubmitHandler(data);
    } else {
      handleNext();
    }
  };

  return (
    <div className="flex w-full md:min-w-150 flex-col justify-center px-4 md:px-8 ">
      {/* <div className="absolute bottom-8 right-2 hidden md:grid gap-6 m-2 w-[40%] mx-auto">
        <div className="flex justify-between items-center gap-3 z-10">
          {stepsLabel.map((label, index) => {
            const isActive = index === step;
            const isCompleted = index < step;

            return (
              <div
                className={`mx-auto h-2 w-full rounded-xl border  ${
                  isActive
                    ? "border-slate-900 bg-slate-900  text-white"
                    : isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "bg-slate-100 border-black text-slate-500"
                }`}
              ></div>
            );
          })}
        </div>
      </div> */}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {subForms[step]}

          <div className="mt-6 flex items-center justify-between gap-4">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack}>
                {lang == "en" ? "Last step" : "السابق"}
              </Button>
            )}
            {lang == "en" ? (
              <Button type="submit" variant="solid" disabled={disabled}>
                {isLastStep ? "Send the data" : "Next"}
              </Button>
            ) : (
              <Button type="submit" variant="solid" disabled={disabled}>
                {isLastStep ? "إرسال البيانات" : "التالي"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
