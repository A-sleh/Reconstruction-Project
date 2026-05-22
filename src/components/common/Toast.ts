import { toast } from "sonner";

export const successToast = (message: string) => {
  toast.success(message, {
    style: {
      background: "#4BB543",
      color: "#fff",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    style: {
        background: "#FF4C4C",
        color: "#fff",
    },
  });
}