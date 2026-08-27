import { useCallback, useEffect, useRef, useState } from "react";

import { useUploadFile } from "@/features/attachment/api/actions";

interface UseFileUploadOptions {
  initialFileId?: string | null;
  onSuccess?: (fileId: string) => void;
  onError?: () => void;
}

export function useFileUpload({
  initialFileId = null,
  onSuccess,
  onError,
}: UseFileUploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string>(initialFileId ?? "");
  const objectUrlRef = useRef<string | null>(null);

  const { mutate: uploadFile, isPending } = useUploadFile();

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const upload = useCallback(
    (selectedFile: File) => {
      setFile(selectedFile);

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const url = URL.createObjectURL(selectedFile);
      objectUrlRef.current = url;
      setPreviewUrl(url);

      uploadFile(selectedFile, {
        onSuccess: (res) => {
          const id = String(res.fileId);
          setFileId(id);
          onSuccess?.(id);
        },
        onError: () => {
          setFile(null);
          setPreviewUrl(null);
          onError?.();
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
          }
        },
      });
    },
    [uploadFile, onSuccess],
  );

  const remove = useCallback(() => {
    setFile(null);
    setFileId("");
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  const reset = useCallback(
    (newFileId?: string) => {
      remove();
      if (newFileId) setFileId(newFileId);
    },
    [remove],
  );

  const onChange = useCallback(
    (file: File | null) => {
      if (file) {
        upload(file);
      } else {
        remove();
      }
    },
    [upload, remove],
  );

  return {
    file,
    fileId,
    previewUrl,
    isPending,
    onChange,
    upload,
    remove,
    reset,
  };
}
