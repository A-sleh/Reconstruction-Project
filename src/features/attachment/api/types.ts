export interface FileUploadResponse {
  fileId: number;
  name: string;
}

export interface FileDeleteParams {
  fileId: number;
}

export interface FileGetParams {
  fileId: number;
}
