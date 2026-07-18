import { useMemo, useState } from "react";
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
import { MOCK_USERS, SystemUser } from "../mock/users";

const ROLES = ["مستثمر", "مهندس مدني", "مزود خدمات", "مزود موارد"];

const UsersTable = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const rows: SystemUser[] = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === "" ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phoneNumber.includes(search) ||
        user.personalIdentifier.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleToggleActive = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)),
    );
  };

  const handleDelete = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

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
              <SelectItem key={role} value={role}>
                {role}
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
                <TableHead>{t("systemUsers.table.user")}</TableHead>
                <TableHead>{t("systemUsers.table.phone")}</TableHead>
                <TableHead>{t("systemUsers.table.role")}</TableHead>
                <TableHead>{t("systemUsers.table.identifier")}</TableHead>
                <TableHead className="text-right">
                  {t("systemUsers.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-16 text-muted-foreground"
                  >
                    {t("systemUsers.table.empty")}
                  </TableCell>
                </TableRow>
              )}

              {rows.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
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
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {user.personalIdentifier}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant={user.isActive ? "outline" : "default"}
                        onClick={() => handleToggleActive(user.id)}
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
                        onConfirm={() => handleDelete(user.id)}
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

        {rows.length > 0 && (
          <p className="text-center text-xs text-muted-foreground py-4">
            {t("systemUsers.table.total", { count: rows.length })}
          </p>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
