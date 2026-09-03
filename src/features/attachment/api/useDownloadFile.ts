import { useCallback, useState } from "react";

import ApiInstance from "@/config/api-instance";
import { errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import { FileController } from ".";

export const useDownloadFile = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback(async (fileId: number, fileName?: string) => {
    setIsDownloading(true);
    try {
      const response = await ApiInstance.get(`/${FileController.Get}`, {
        params: { fileId },
        responseType: "blob",
      });

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const disposition = response.headers?.["content-disposition"];
      link.download =
        fileName ||
        disposition?.split("filename=")[1]?.replace(/"/g, "") ||
        "";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      errorToast(
        i18n.t("attachment.download-error", "Failed to download file"),
      );
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { download, isDownloading };
};
