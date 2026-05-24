import OrderHeader from "@/features/resource-providor/orders/components/OrderHeader";
import OrderTables from "@/features/resource-providor/orders/components/OrderTables";

export default function Orders() {
  return (
    <div className="min-h-screen bg-background">
      <OrderHeader />
      <OrderTables />
    </div>
  );
}
