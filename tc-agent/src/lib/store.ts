import { invoke } from "@tauri-apps/api/core";

interface DesktopConfig {
  api_url: string | null;
  mcp_token: string | null;
  clerk_session: string | null;
  auto_start: boolean | null;
}

export async function getStoredToken(): Promise<string | null> {
  try {
    const config = await invoke<DesktopConfig>("load_config");
    return config.mcp_token ?? null;
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  let config: DesktopConfig;
  try {
    config = await invoke<DesktopConfig>("load_config");
  } catch {
    config = { api_url: null, mcp_token: null, clerk_session: null, auto_start: null };
  }
  config.mcp_token = token;
  await invoke("store_config", { config });
}

export async function clearStoredToken(): Promise<void> {
  let config: DesktopConfig;
  try {
    config = await invoke<DesktopConfig>("load_config");
  } catch {
    config = { api_url: null, mcp_token: null, clerk_session: null, auto_start: null };
  }
  config.mcp_token = null;
  config.clerk_session = null;
  await invoke("store_config", { config });
}
