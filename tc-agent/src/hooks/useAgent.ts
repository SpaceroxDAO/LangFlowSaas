import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { fetchBootstrap, type BootstrapData } from "../lib/api";

interface UseAgentReturn {
  data: BootstrapData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAgent(): UseAgentReturn {
  const { getToken } = useAuth();
  const [data, setData] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }
      const result = await fetchBootstrap(token);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch agent");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
