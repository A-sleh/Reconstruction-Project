import { useRef } from "react";

/**
 * A single entry in the client-side marker cache.
 */
export type CacheEntry<T> =
  | { status: "loading"; key: string }
  | { status: "resolved"; key: string; value: T }
  | { status: "error"; key: string };

/**
 * The mutable cache handle returned by {@link useMapCache}. Wraps a plain
 * `Map<string, CacheEntry<T>>` so components can read/write entries without
 * re-triggering React renders (the consuming component holds its own state).
 */
export type MapCache<T> = {
  get: (key: string) => CacheEntry<T> | undefined;
  begin: (key: string) => void;
  resolve: (key: string, value: T) => void;
  fail: (key: string) => void;
};

/**
 * Simple client-side cache to avoid duplicating detail requests when a user
 * hovers the same marker repeatedly. Keyed by marker key.
 */
export function useMapCache<T>(): MapCache<T> {
  const cache = useRef(new Map<string, CacheEntry<T>>());

  return {
    get: (key) => cache.current.get(key),
    begin: (key) => cache.current.set(key, { status: "loading", key }),
    resolve: (key, value) =>
      cache.current.set(key, { status: "resolved", key, value }),
    fail: (key) => cache.current.set(key, { status: "error", key }),
  };
}
