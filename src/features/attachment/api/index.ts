const BASE_FILE_ROUTE = "file";

export enum FileController {
  Upload = `${BASE_FILE_ROUTE}/upload`,
  Get = `${BASE_FILE_ROUTE}/get`,
  Delete = `${BASE_FILE_ROUTE}/delete`,
}

export const QUERY_KEYS = {
  files: {
    all: ["files"] as const,
    detail: (fileId: number) => [...QUERY_KEYS.files.all, "detail", fileId] as const,
  },
};

export const MUTATION_KEYS = {
  files: {
    upload: () => ["files", "upload"],
    delete: () => ["files", "delete"],
  },
};
