import { TableCell, TableRow } from "@/components/ui/table";

const UserRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <div className="h-4 w-4 rounded bg-muted animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
            <div className="h-3 w-36 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-3.5 w-20 rounded bg-muted animate-pulse" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <div className="h-8 w-8 rounded bg-muted animate-pulse" />
          <div className="h-8 w-8 rounded bg-muted animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserRowSkeleton;
