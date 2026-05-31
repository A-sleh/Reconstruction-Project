import { RiErrorWarningLine } from "react-icons/ri"
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineReportGmailerrorred } from "react-icons/md";

interface MessageProps {
  message: string;
  type: "warn" | "error" | "info";
}

export const Message: React.FC<MessageProps> = ({ message, type }) => {
  return (
    <div
      className={`flex gap-2 items-center my-2 p-3 rounded-md ${variants.variant[type].container}`}
    >
      <span className="text-5xl">{variants.variant[type].icon}</span>
      <p>{message}</p>
    </div>
  );
};

const variants = {
  variant: {
    warn: {
      container: "bg-orange-300/30 text-orange-600",
      icon: <IoWarningOutline  />,
    },
    info: {
      container: "bg-blue-300/30 text-blue-600",
      icon: <RiErrorWarningLine />,
    },
    error: {
      container: "bg-red-300/30 text-red-600",
      icon: <MdOutlineReportGmailerrorred />,
    },
  },
};