// import { RejectModal } from "@/components/RejectModal";
import OrderHeader from "@/features/resource-providor/orders/components/OrderHeader";
import OrderTables from "@/features/resource-providor/orders/components/OrderTables";

export default function Orders() {
  return (
    <div className="min-h-screen bg-background">
      <OrderHeader />
      <OrderTables />

      {/* <RejectModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        investorName={rejectTarget?.investor}
        onConfirm={(reason) => {
          if (rejectTarget) {
            reject(rejectTarget.id, reason);
            toast.success(`Rejected ${rejectTarget.investor}`);
          }
        }}
      /> */}
    </div>
  );
}
