import { useState } from "react";
import { useSearchParams } from "react-router";

function useQueryStringState<T>(key: string, defaultKey?: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<T>(
    searchParams.get(key) || defaultKey || "",
  );

  const updateQueryString = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams, { replace: true });
    setState(value as T);
  };

  return [state, updateQueryString] as const;
}

export default useQueryStringState;
