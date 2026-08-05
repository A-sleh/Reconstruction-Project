import { errorToast } from "@/components/common/Toast";
import Input from "@/components/inputs/Input";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAddPayment } from "../api/actions";

interface Props {
  orderId: number | null;
  openButton: React.ReactNode;
}

interface ValidationErrors {
  amount?: string;
  date?: string;
}

export function AddPaymentModal({ orderId, openButton }: Props) {
  const { t } = useTranslation();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { mutate, isPending } = useAddPayment();

  // Validate fields before submitting
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = t("orders.addPaymentModal.validation.amountInvalid");
    }
    if (!date) {
      newErrors.date = t("orders.addPaymentModal.validation.dateInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
    closeModle: () => void,
  ) => {
    e.preventDefault(); // Prevents page reload

    if (!orderId) {
      errorToast(t("common.error"));
      return;
    }
    if (!validateForm()) return; // Halts execution if validation fails

    mutate(
      {
        amount: parseFloat(amount),
        paymentDate: date,
        orderId: Number(orderId),
      },
      {
        onSuccess: () => {
          setAmount("");
          setErrors({});
          closeModle();
        },
      },
    );
  };

  return (
    <PopuupLayout
      openKey="add-new-payment"
      title={t("orders.addPaymentModal.title")}
      openButton={openButton}
      children={(close) => {
        return (
          <form onSubmit={(e) => handleSubmit(e, close)} className="space-y-4">
            <div className="space-y-3">
              {/* Amount Field */}
              <div>
                <Input
                  label={t("orders.addPaymentModal.labels.amount")}
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount)
                      setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <span className="text-xs font-medium text-destructive">
                    {errors.amount}
                  </span>
                )}
              </div>

              {/* Date Field */}
              <div>
                <Input
                  label={t("orders.addPaymentModal.labels.date")}
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date)
                      setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                />
                {errors.date && (
                  <span className="text-xs font-medium text-destructive">
                    {errors.date}
                  </span>
                )}
              </div>
            </div>

            {/* button type="submit" triggers form submission natively */}
            <Button type="submit" disabled={isPending} isLoading={isPending}>
              {isPending
                ? t("orders.addPaymentModal.buttons.saving")
                : t("orders.addPaymentModal.buttons.save")}
            </Button>
          </form>
        );
      }}
    />
  );
}
