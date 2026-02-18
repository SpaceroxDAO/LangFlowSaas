import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface UseSidecarReturn {
  running: boolean;
  start: (token: string, apiUrl?: string) => Promise<void>;
  stop: () => Promise<void>;
  error: string | null;
}

const DEFAULT_API_URL = "https://app.teachcharlie.ai";

export function useSidecar(): UseSidecarReturn {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for sidecar status events from Rust
  useEffect(() => {
    const unlisten = listen<string>("sidecar-status", (event) => {
      setRunning(event.payload === "running");
    });

    // Check initial status
    invoke<boolean>("sidecar_status")
      .then(setRunning)
      .catch(() => setRunning(false));

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const start = useCallback(
    async (token: string, apiUrl: string = DEFAULT_API_URL) => {
      try {
        setError(null);
        await invoke("start_sidecar", { token, apiUrl });

        // Also write the MCP config for OpenClaw discovery
        await invoke("write_mcp_config", { token, apiUrl });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : String(err);
        setError(msg);
        throw err;
      }
    },
    []
  );

  const stop = useCallback(async () => {
    try {
      setError(null);
      await invoke("stop_sidecar");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  }, []);

  return { running, start, stop, error };
}
