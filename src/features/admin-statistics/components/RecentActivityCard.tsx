import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { FileText, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  MOCK_RECENT_BANK_REQUESTS,
  MOCK_RECENT_SUPPORT_TICKETS,
} from "../mock/mockData";

const RecentActivityCard = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("adminStatistics.recentActivity.title")}
        </CardTitle>
        <CardDescription>
          {t("adminStatistics.recentActivity.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bank Requests Section */}
        <div>
          <p className="text-sm font-semibold mb-3">
            {t("adminStatistics.recentActivity.bankRequests")}
          </p>
          {MOCK_RECENT_BANK_REQUESTS.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("adminStatistics.recentActivity.noItems")}
            </p>
          ) : (
            <div className="space-y-2">
              {MOCK_RECENT_BANK_REQUESTS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      {t("adminStatistics.recentActivity.bankRequestItem", {
                        name: item.name,
                        category: item.category,
                      })}
                    </span>
                  </div>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Tickets Section */}
        <div>
          <p className="text-sm font-semibold mb-3">
            {t("adminStatistics.recentActivity.supportTickets")}
          </p>
          {MOCK_RECENT_SUPPORT_TICKETS.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("adminStatistics.recentActivity.noItems")}
            </p>
          ) : (
            <div className="space-y-2">
              {MOCK_RECENT_SUPPORT_TICKETS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      {t("adminStatistics.recentActivity.supportTicketItem", {
                        subject: item.subject,
                        priority: item.priority,
                      })}
                    </span>
                  </div>
                  <Badge variant="outline">{item.priority}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
