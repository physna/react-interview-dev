import * as React from "react";

type Action<Data> =
  | { status: "idle"; data: null; error: null }
  | { status: "pending"; data?: Data | null; error: null }
  | { error: unknown; status: "rejected"; data: null }
  | { data: Data; status: "resolved"; error: null };

const defaultInitialState = {
  status: "idle",
  data: null,
  error: null,
} as const;

/**
 * Wrap an async action like fetching data in a more useful lifecycle state.
 *
 * @example
 * Fetch data from an api
 * ```
 * useEffect(() => {
 *   run(async () => {
 *     const response = await fetch("/api/pokemon-list");
 *     return response.json();
 *   });
 * }, [run]);
 * ```
 *
 */
function useAsync<State>(initialState: Action<State> = defaultInitialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  });

  const [{ status, data, error }, setState] = React.useReducer(
    (s: Action<State>, a: Action<State>) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback(
    (data: State) => safeSetState({ data, status: "resolved", error: null }),
    [safeSetState]
  );

  const setError = React.useCallback(
    (error: unknown) => safeSetState({ error, status: "rejected", data: null }),
    [safeSetState]
  );

  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  const run = React.useCallback(
    (promise: () => Promise<State>) => {
      safeSetState({ status: "pending", error: null });

      return promise().then(
        (data: State) => {
          setData(data);
          return data;
        },
        (error: unknown) => {
          setError(error);
          return Promise.reject(error);
        }
      );
    },
    [safeSetState, setData, setError]
  );

  return {
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

function useSafeDispatch<T>(dispatch: React.Dispatch<T>) {
  const mounted = React.useRef(false);

  useIsomorphicLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return React.useCallback(
    (action: T) => (mounted.current ? dispatch(action) : void 0),
    [dispatch]
  );
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export { useAsync };
