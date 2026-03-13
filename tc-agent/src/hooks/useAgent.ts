import { useCallback, useEffect, useRef, useState } from "react";
import { fetchBootstrapByToken, type BootstrapData } from "../lib/api";
import { getStoredToken } from "../lib/store";

const POLL_INTERVAL_MS = 30_000;

interface UseAgentReturn {
  data: BootstrapData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAgent(): UseAgentReturn {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasDataRef = useRef(false);

  const refresh = useCallback(async () => {
    try {
      // Only show loading spinner on first fetch
      if (!hasDataRef.current) setLoading(true);
      setError(null);
      const token = await getStoredToken();
      if (!token) {
        setError("Not connected. Please enter your setup code.");
        return;
      }
      const result = await fetchBootstrapByToken(token);
      setData(result);
      hasDataRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch agent");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 30-second polling
  useEffect(() => {
    const id = setInterval(() => {
      refresh();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [refresh]);

  return { data, loading, error, refresh };
}
