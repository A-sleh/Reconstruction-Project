import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiDollarSign, FiFileText, FiList, FiMail, FiPhone, FiUser } from "react-icons/fi";
import Button from "@/components/inputs/Button";

type OrderItem = {
  name: string;
  amount: number;
  price: number;
};

type Order = {
  id: string;
  createdAt: string;
  status: "confirmed" | "pending" | "inProgress";
  owner: {
    name: string;
    email: string;
    phone: string;
    personalIdentifier: string;
  };
  items: OrderItem[];
};

const ResourceProvidorOrderDetails = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar" : "en";

  const order: Order = useMemo(
    () => ({
      id: "ORD-20260417-001",
      createdAt: "2026-04-17T14:32:00Z",
      status: "confirmed",
      owner: {
        name: "Nizar Al-Hassan",
        email: "nizar.hassan@example.com",
        phone: "+966 50 987 6543",
        personalIdentifier: "98765432109876",
      },
      items: [
        { name: "Concrete blocks", amount: 120, price: 2100 },
        { name: "Steel bars", amount: 45, price: 1840 },
        { name: "Wooden beams", amount: 20, price: 950 },
        { name: "Finishing tiles", amount: 180, price: 840 },
      ],
    }),
    []
  );

  const formattedDate = useMemo(
    () => new Date(order.createdAt).toLocaleDateString(language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    [language, order.createdAt]
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(language, {
      style: "currency",
      currency: "SAR",
    }).format(value);

  const totalQuantity = order.items.reduce((sum, item) => sum + item.amount, 0);
  const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.amount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">{t("orders.section")}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{t("orders.title")}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{t("orders.subtitle")}</p>
        </div>

        <div className="grid w-full gap-3 sm:w-auto sm:grid-flow-col sm:auto-cols-max sm:items-center">
          <Button variant="outline">{t("orders.downloadButton")}</Button>
          <Button>{t("orders.newOrderButton")}</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">{t("orders.orderCardTitle")}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{t("orders.orderCodeLabel")}: {order.id}</h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <FiCalendar className="h-4 w-4" />
                  <span>{t("orders.orderDateLabel")}: {formattedDate}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {t(`orders.status.${order.status}`)}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{t("orders.totalItems")}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{order.items.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{t("orders.totalQuantity")}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{totalQuantity}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{t("orders.orderItemsLabel")}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{order.items.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <FiUser className="h-5 w-5" />
              <h3 className="text-lg font-semibold">{t("orders.ownerInfoTitle")}</h3>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{t("orders.ownerNameLabel")}</p>
                <p className="mt-2 font-semibold text-slate-950">{order.owner.name}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <FiMail className="h-4 w-4" />
                  {t("orders.ownerEmailLabel")}
                </p>
                <p className="mt-2 font-semibold text-slate-950">{order.owner.email}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <FiPhone className="h-4 w-4" />
                  {t("orders.ownerPhoneLabel")}
                </p>
                <p className="mt-2 font-semibold text-slate-950">{order.owner.phone}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{t("orders.ownerNationalNumberLabel")}</p>
                <p className="mt-2 font-semibold text-slate-950">{order.owner.personalIdentifier}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex items-center gap-3 text-slate-900">
                <FiList className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{t("orders.itemsTitle")}</h3>
              </div>
              <p className="mt-1 text-sm text-slate-600">{t("orders.itemsSubtitle")}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-white text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t("orders.itemName")}</th>
                    <th className="px-6 py-4 font-medium">{t("orders.itemAmount")}</th>
                    <th className="px-6 py-4 font-medium">{t("orders.itemPrice")}</th>
                    <th className="px-6 py-4 font-medium">{t("orders.itemTotal")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-slate-50">
                  {order.items.map((item) => (
                    <tr key={item.name} className="hover:bg-slate-100">
                      <td className="whitespace-nowrap px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.amount}</td>
                      <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4">{formatCurrency(item.price * item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <FiFileText className="h-5 w-5" />
              <h3 className="text-lg font-semibold">{t("orders.summaryTitle")}</h3>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>{t("orders.totalQuantity")}</span>
                  <span>{totalQuantity}</span>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <FiDollarSign className="h-4 w-4" />
                    {t("orders.totalPrice")}
                  </span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>{t("orders.orderDateLabel")}</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Button>{t("orders.contactOwnerButton")}</Button>
              <Button variant="outline">{t("orders.messageOwnerButton")}</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ResourceProvidorOrderDetails;
