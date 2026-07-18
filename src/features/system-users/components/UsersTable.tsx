import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Power, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { MOCK_USERS, SystemUser } from "../mock/users";

const UsersTable = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);

  const rows: SystemUser[] = useMemo(() => users, [users]);

  const handleToggleActive = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  const handleDelete = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="space-y-4 w-full">
      <div className="mt-6 rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant={user.isActive ? "outline" : "default"}
                        onClick={() => handleToggleActive(user.id)}
                        className="gap-1.5"
                      >
                        <Power className="h-3.5 w-3.5" />
                        {user.isActive
                          ? t("systemUsers.table.deactivate")
                          : t("systemUsers.table.activate")}
                      </Button>

                      <ConfirmDelete
                        item={`${user.firstName} ${user.lastName}`}
                        onConfirm={() => handleDelete(user.id)}
                        openButton={
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t("systemUsers.table.delete")}
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
