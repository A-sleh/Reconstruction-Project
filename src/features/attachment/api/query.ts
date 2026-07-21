import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { FileController, QUERY_KEYS } from ".";
import type { FileGetParams } from "./types";

const getFileApi = async ({ fileId }: FileGetParams) => {
  const { data } = await ApiInstance.get(`/${FileController.Get}`, {
    params: { fileId },
  });
  return data;
};

export const useGetFile = (fileId: number | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.files.detail(fileId ?? 0),
    queryFn: () => getFileApi({ fileId: fileId! }),
    enabled: fileId !== null && fileId > 0,
  });
};
