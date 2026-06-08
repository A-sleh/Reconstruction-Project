import { useState } from "react";
import { useLocation } from "react-router";

function useExchangeState<T>() {
  const location = useLocation();
  const state = location.state;
  const [persisteValue, _] = useState<T>(state || {});

  return persisteValue as T;
}

export default useExchangeState;
