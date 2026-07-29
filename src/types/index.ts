export type Role = "Provider" | "Investor" | "Engineer" | "Admin";
export type ProviderRole = "Resource" | "Service" ;

export interface Paginated<T> {
  data: T[];
  pageNum: number;
  pageSize: number;
  hasNextPage: boolean;
  totalRows: number;
  isSucceeded: boolean;
  message: string;
}
