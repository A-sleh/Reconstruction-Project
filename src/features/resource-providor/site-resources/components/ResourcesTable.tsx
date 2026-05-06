import TableLayout from "@/components/common/Table";
import { AnimatePresence, motion } from "framer-motion";
import { Package, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../../shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useSiteResources } from "../context/SiteResourcesContext";

const ResourcesTable = () => {
  const { handleDelete, openEdit, resources } = useSiteResources();
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  return (
    <TableLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <h2 className="text-lg font-semibold">Resource Inventory</h2>
        <TableLayout.Search
          placeholder="Search by name or phone…"
          setValue={(e) => {
            //@ts-ignore
            setQuery(e.target.value);
            setPage(1);
          }}
          value={query}
        />
      </div>
      <TableLayout.Table
        columns={[
          "Resource",
          "Type",
          "Quantity",
          "Unit Price",
          "Availability",
          "Actions",
        ]}
      >
        <AnimatePresence initial={false}>
          {resources.map((r) => (
            <motion.tr
              key={r.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="border-t border-border hover:bg-muted/30 transition-smooth"
            >
              <td className="px-5 py-4 font-medium text-foreground">
                {r.name}
              </td>
              <td className="px-5 py-4 text-muted-foreground">{r.type}</td>
              <td className="px-5 py-4 text-right tabular-nums">
                {r.quantity.toLocaleString()}
              </td>
              <td className="px-5 py-4 text-right tabular-nums">
                ${r.unitPrice.toFixed(2)}
              </td>
              <td className="px-5 py-4 text-right tabular-nums font-semibold text-primary">
                $
                {(r.quantity * r.unitPrice).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={r.availability} />
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(r)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(r)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </AnimatePresence>
        {resources.length === 0 && (
          <tr>
            <td
              colSpan={7}
              className="px-5 py-16 text-center text-muted-foreground"
            >
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No resources yet. Click "Add New Resource" to get started.
            </td>
          </tr>
        )}
      </TableLayout.Table>
      <TableLayout.Controls
        currentPage={page}
        totalPages={10}
        onPageChange={(value) => setPage(value)}
      />
    </TableLayout>
  );
};

export default ResourcesTable;
