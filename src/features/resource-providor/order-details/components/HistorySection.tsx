import { useTranslation } from "react-i18next";
import { HistoryEntry } from "../../orders/api";

const HistorySection = ({ history }: { history: HistoryEntry[] }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6 my-2 mb-4">
      <ol
        className={`relative  border-gray-300 ml-3 space-y-5
        ${isArabic ? "border-r" : "border-l"}
        `}
      >
        {history.map((h) => (
          <li key={h.id} className={isArabic ? "mr-6" : "ml-6"}>
            <span
              className={`absolute  mt-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background
                ${isArabic ? "-right-1.5" : "-left-1.5"}
                `}
            />
            <p className="text-sm my-1 font-medium">{h.message}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(h.date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default HistorySection;
