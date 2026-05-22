import { Link } from "react-router";

export const Card = ({
  to,
  Icon,
  title,
  subtitle,
}: {
  to: string;
  Icon: any;
  title: string;
  subtitle: string;
}) => (
  <Link
    to={to}
    className="flex flex-col items-start gap-3 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow bg-white w-full"
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary text-white">
      <Icon size={20} />
    </div>
    <div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>
    </div>
  </Link>
);
