import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { BootstrapData } from "../lib/api";

interface OpenClawCheckResult {
  installed: boolean;
  version: string | null;
}

interface DaemonResult {
  status: string;
  output: string;
}

interface OpenClawConfigData {
  token: string;
  agent_name: string;
  system_prompt: string | null;
  avatar_url: string | null;
  skills: string[];
}

export interface UseOpenClawReturn {
  installed: boolean | null; // null = checking
  version: string | null;
  daemonRunning: boolean;
  configWritten: boolean;
  checkInstalled: () => Promise<void>;
  install: () => Promise<void>;
  writeConfig: (data: BootstrapData) => Promise<string>;
  startDaemon: () => Promise<void>;
  stopDaemon: () => Promise<void>;
  checkDaemonStatus: () => Promise<void>;
  installing: boolean;
  installProgress: string | null;
  error: string | null;
}

export function useOpenClaw(): UseOpenClawReturn {
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [daemonRunning, setDaemonRunning] = useState(false);
  const [configWritten, setConfigWritten] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Listen for install progress events
  useEffect(() => {
    const unlisten = listen<string>("openclaw-install-progress", (event) => {
      setInstallProgress(event.payload);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // Listen for daemon status events
  useEffect(() => {
    const unlisten = listen<string>("openclaw-daemon-status", (event) => {
      setDaemonRunning(event.payload === "running");
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const checkInstalled = useCallback(async () => {
    try {
      setError(null);
      const result = await invoke<OpenClawCheckResult>("check_openclaw");
      setInstalled(result.installed);
      setVersion(result.version ?? null);
    } catch (err) {
      setInstalled(false);
      setVersion(null);
    }
  }, []);

  const install = useCallback(async () => {
    try {
      setError(null);
      setInstalling(true);
      setInstallProgress("starting");
      await invoke<string>("install_openclaw");
      setInstalled(true);
      // Re-check to get version
      const result = await invoke<OpenClawCheckResult>("check_openclaw");
      setVersion(result.version ?? null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    } finally {
      setInstalling(false);
      setInstallProgress(null);
    }
  }, []);

  const writeConfig = useCallback(async (data: BootstrapData): Promise<string> => {
    try {
      setError(null);
      const configData: OpenClawConfigData = {
        token: data.mcp_token,
        agent_name: data.published_agent?.name ?? "Charlie",
        system_prompt: data.published_agent?.qa_who ?? null,
        avatar_url: data.published_agent?.avatar_url ?? null,
        skills: data.skills.map((s) => s.name),
      };
      const path = await invoke<string>("write_openclaw_config", { data: configData });
      setConfigWritten(true);
      return path;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    }
  }, []);

  const startDaemon = useCallback(async () => {
    try {
      setError(null);
      const result = await invoke<DaemonResult>("control_openclaw_daemon", {
        action: "start",
      });
      setDaemonRunning(result.status === "running");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    }
  }, []);

  const stopDaemon = useCallback(async () => {
    try {
      setError(null);
      const result = await invoke<DaemonResult>("control_openclaw_daemon", {
        action: "stop",
      });
      setDaemonRunning(result.status !== "running");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  }, []);

  const checkDaemonStatus = useCallback(async () => {
    try {
      const result = await invoke<DaemonResult>("control_openclaw_daemon", {
        action: "status",
      });
      setDaemonRunning(result.status === "running");
    } catch {
      setDaemonRunning(false);
    }
  }, []);

  return {
    installed,
    version,
    daemonRunning,
    configWritten,
    checkInstalled,
    install,
    writeConfig,
    startDaemon,
    stopDaemon,
    checkDaemonStatus,
    installing,
    installProgress,
    error,
  };
}
