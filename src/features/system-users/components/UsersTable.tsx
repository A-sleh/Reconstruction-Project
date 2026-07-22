import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Power, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { useSystemUsersInfinite } from "../api/query";
import {
  useActivateUser,
  useDeactivateUser,
  useDeleteUser,
} from "../api/actions";
import type { SystemUserRole } from "../api/types";
import { useDebounce } from "@/hooks/useDebounce";
import UserRowSkeleton from "./UserRowSkeleton";
import EmptyUsersState from "./EmptyUsersState";
import RoleBadge from "./RoleBadge";

const ROLES: { value: SystemUserRole; label: string }[] = [
  { value: "Investor", label: "مستثمر" },
  { value: "Engineer", label: "مهندسين" },
  { value: "Provider", label: "مزود موارد/خدمة" },
];

const UsersTable = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSystemUsersInfinite({
      Search: debouncedSearch || undefined,
      Role: roleFilter !== "all" ? (roleFilter as SystemUserRole) : undefined,
    });

  const users = data?.pages.flatMap((p) => p) ?? [];

  const { mutate: activateUser, isPending: isActivating } = useActivateUser();
  const { mutate: deactivateUser, isPending: isDeactivating } =
    useDeactivateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  return (
    <div className="space-y-4 w-full" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex gap-2 items-center mb-4">
        <div className="relative w-90 rounded-lg bg-white">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t(
              "systemUsers.table.searchPlaceholder",
              "Search users...",
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 w-full bg-transparent"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-fit" dir={isArabic ? "rtl" : "ltr"}>
            <SelectValue
              placeholder={t(
                "systemUsers.table.filterByRole",
                "Filter by role",
              )}
            />
          </SelectTrigger>
          <SelectContent dir={isArabic ? "rtl" : "ltr"}>
            <SelectItem value="all">
              {t("systemUsers.table.allRoles", "All Roles")}
            </SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>{t("systemUsers.table.user")}</TableHead>
                <TableHead>{t("systemUsers.table.phone")}</TableHead>
                <TableHead>{t("systemUsers.table.role")}</TableHead>
                <TableHead>{t("systemUsers.table.identifier")}</TableHead>
                <TableHead>{t("systemUsers.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <UserRowSkeleton key={i} />
                  ))}
                </>
              )}

              {!isLoading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <EmptyUsersState />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                users.map((user,Idx) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-sm text-muted-foreground">
                      {Idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user?.avatarUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {user.personalIdentifier}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center  gap-1">
                        <Button
                          size="icon"
                          isLoading={
                            (isActivating || isDeactivating) &&
                            currentUserId == user.id
                          }
                          variant={user.isActive ? "outline" : "default"}
                          onClick={() => {
                            setCurrentUserId(user.id);
                            user.isActive
                              ? deactivateUser(user.id, {
                                  onSettled: () => {
                                    setCurrentUserId(null);
                                  },
                                })
                              : activateUser(user.id, {
                                  onSettled: () => {
                                    setCurrentUserId(null);
                                  },
                                });
                          }}
                          disabled={
                            (isActivating || isDeactivating) &&
                            currentUserId == user.id
                          }
                          title={
                            user.isActive
                              ? t("systemUsers.table.deactivate")
                              : t("systemUsers.table.activate")
                          }
                          className="h-8 w-8"
                        >
                          <Power className="h-4 w-4" />
                        </Button>

                        <ConfirmDelete
                          item={`${user.firstName} ${user.lastName}`}
                          onConfirm={() => deleteUser(user.id)}
                          isLoading={isDeleting}
                          openButton={
                            <Button
                              size="icon"
                              variant="destructive"
                              title={t("systemUsers.table.delete")}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading && users.length > 0 && (
          <>
            <p className="text-center text-xs text-muted-foreground py-4">
              {t("systemUsers.table.total", { count: users.length })}
            </p>
            {hasNextPage && (
              <div className="pb-4 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
