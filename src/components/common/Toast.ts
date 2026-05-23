import { toast } from "sonner";

const baseStyle = {
  color: "#ffffff",
  borderRadius: "12px",
  padding: "12px 16px",
  boxShadow: "0 8px 24px rgba(2,6,23,0.12)",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export const successToast = (message: string) => {
  toast.success(message, {
    style: {
      ...baseStyle,
      background: "linear-gradient(90deg,#34D399,#10B981)",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    style: {
      ...baseStyle,
      background: "linear-gradient(90deg,#FF7A7A,#FF4C4C)",
    },
  });
};
