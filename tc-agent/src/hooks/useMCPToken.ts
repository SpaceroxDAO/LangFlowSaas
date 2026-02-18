import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface DesktopConfig {
  api_url: string | null;
  mcp_token: string | null;
  clerk_session: string | null;
  auto_start: boolean | null;
}

interface UseMCPTokenReturn {
  token: string | null;
  apiUrl: string;
  hasStoredConfig: boolean;
  saveConfig: (token: string, apiUrl?: string) => Promise<void>;
}

const DEFAULT_API_URL = "https://app.teachcharlie.ai";

export function useMCPToken(): UseMCPTokenReturn {
  const [token, setToken] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [hasStoredConfig, setHasStoredConfig] = useState(false);

  useEffect(() => {
    invoke<DesktopConfig>("load_config")
      .then((config) => {
        if (config.mcp_token) {
          setToken(config.mcp_token);
          setHasStoredConfig(true);
        }
        if (config.api_url) {
          setApiUrl(config.api_url);
        }
      })
      .catch(() => {
        // No config file yet, that's fine
      });
  }, []);

  const saveConfig = useCallback(
    async (newToken: string, newApiUrl: string = DEFAULT_API_URL) => {
      const config: DesktopConfig = {
        mcp_token: newToken,
        api_url: newApiUrl,
        clerk_session: null,
        auto_start: true,
      };
      await invoke("store_config", { config });
      setToken(newToken);
      setApiUrl(newApiUrl);
      setHasStoredConfig(true);
    },
    []
  );

  return { token, apiUrl, hasStoredConfig, saveConfig };
}
