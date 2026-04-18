import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiChevronRight, FiCheckCircle, FiMessageCircle } from "react-icons/fi";
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
  };
  items: OrderItem[];
};

const ResourceProvidorOrders = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar" : "en";
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const orders: Order[] = useMemo(
    () => [
      {
        id: "1001",
        createdAt: "2026-04-17T14:32:00Z",
        status: "confirmed",
        owner: {
          name: "Nizar Al-Hassan",
          email: "nizar.hassan@example.com",
          phone: "+966 50 987 6543",
        },
        items: [
          { name: "Concrete blocks", amount: 120, price: 2100 },
          { name: "Steel bars", amount: 45, price: 1840 },
        ],
      },
      {
        id: "1002",
        createdAt: "2026-04-15T10:20:00Z",
        status: "pending",
        owner: {
          name: "Amina Al-Khatib",
          email: "amina.khatib@example.com",
          phone: "+966 55 234 9876",
        },
        items: [
          { name: "Wooden beams", amount: 20, price: 950 },
          { name: "Finishing tiles", amount: 180, price: 840 },
        ],
      },
      {
        id: "1003",
        createdAt: "2026-04-13T09:10:00Z",
        status: "inProgress",
        owner: {
          name: "Khaled Al-Ghamdi",
          email: "khaled.ghamdi@example.com",
          phone: "+966 54 321 6789",
        },
        items: [
          { name: "Electric wiring", amount: 60, price: 640 },
          { name: "Plumbing kit", amount: 15, price: 420 },
        ],
      },
    ],
    []
  );

  const totalItems = (order: Order) => order.items.length;
  const orderTotalPrice = (order: Order) => order.items.reduce((sum, item) => sum + item.price * item.amount, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(language, {
      style: "currency",
      currency: "SAR",
    }).format(value);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleAction = (orderId: string, action: string) => {
    setSelectedOrder(`${action}:${orderId}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">{t("orders.section")}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{t("orders.listTitle")}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{t("orders.listSubtitle")}</p>
        </div>

        <div className="grid w-full gap-3 sm:w-auto sm:grid-flow-col sm:auto-cols-max sm:items-center">
          <Button variant="outline">{t("orders.downloadButton")}</Button>
          <Button>{t("orders.newOrderButton")}</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{t("orders.openOrders")}</h2>
              <p className="mt-1 text-sm text-slate-600">{t("orders.openOrdersSubtitle")}</p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {orders.length} {t("orders.ordersCount")}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200  text-sm text-slate-700 text-center">
            <thead className="bg-white text-slate-500 text-center">
              <tr>
                <th className="px-6 py-4 font-medium">{t("orders.orderCode")}</th>
                <th className="px-6 py-4 font-medium">{t("orders.owner")}</th>
                <th className="px-6 py-4 font-medium">{t("orders.items")}</th>
                <th className="px-6 py-4 font-medium">{t("orders.total")}</th>
                <th className="px-6 py-4 font-medium">{t("orders.date")}</th>
                <th className="px-6 py-4 font-medium">{t("orders.statusLabel")}</th>
                <th className="px-6 py-4 font-medium">{t("orders.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-slate-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-100">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-950">#{order.id}</td>
                  <td className="px-6 py-4">{order.owner.name}</td>
                  <td className="px-6 py-4">{totalItems(order)}</td>
                  <td className="px-6 py-4">{formatCurrency(orderTotalPrice(order))}</td>
                  <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "inProgress"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {t(`orders.status.${order.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/app/resource-providor/order/${order.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                      >
                        {t("orders.viewDetails")}
                        <FiChevronRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAction(order.id, "accept")}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
                      >
                        <FiCheckCircle className="h-4 w-4" />
                        {t("orders.accept")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(order.id, "message")}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                      >
                        <FiMessageCircle className="h-4 w-4" />
                        {t("orders.contact")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {t("orders.selectionText", { selection: selectedOrder })}
        </div>
      )}
    </div>
  );
};

export default ResourceProvidorOrders;
