import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { motion } from "framer-motion";

//? Table Search Component
interface TableSearch {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}

const Search: React.FC<TableSearch> = ({ value, setValue, placeholder }) => {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 sm:w-[260px] bg-background"
      />
    </div>
  );
};

interface TableFilter {
  placeHolder: string;
  filterOptions: string[];
  filter: string;
  setFilter: (value: string) => void;
  withAll?: boolean;
}

//? Table Filters Component
const Filters: React.FC<TableFilter> = ({
  filterOptions,
  placeHolder,
  filter,
  setFilter,
  withAll = false,
}) => {
  return (
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger className="sm:w-[130px] bg-background">
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent>
        {withAll && <SelectItem value="all">All {placeHolder}</SelectItem>}
        {filterOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


// Table Row Component
const TableRow: React.FC<{ index: number; children: React.ReactNode }> = ({
  index,
  children,
}) => {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className="border-t border-border/60 hover:bg-accent/40 transition-colors"
    >
      {children}
    </motion.tr>
  );
};

// Main Table Component
interface TableProps {
  columns: string[];
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children, columns }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr className="text-left">
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

interface TableControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      // Show current page and adjacent pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 p-4 border-t border-border/60 bg-background w-full">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      {visiblePages.map((page, index) => (
        typeof page === "number" ? (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
            ...
          </span>
        )
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

interface TableLayoutProps {
  children: React.ReactNode;
}

const TableLayout: React.FC<TableLayoutProps> & {
  Search: typeof Search;
  Filters: typeof Filters;
  Table: typeof Table;
  TableRow: typeof TableRow;
  Controls: typeof TableControls;
} = ({ children }) => {
  return <div className="p-0 shadow-soft overflow-hidden">{children}</div>;
};

TableLayout.Filters = Filters;
TableLayout.Search = Search;
TableLayout.Table = Table;
TableLayout.TableRow = TableRow;
TableLayout.Controls = TableControls;

export default TableLayout;
