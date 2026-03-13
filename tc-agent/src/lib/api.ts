const API_URL =
  import.meta.env.VITE_TC_API_URL || "https://app.teachcharlie.ai";

export interface BootstrapData {
  user: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
  published_agent: {
    id: string;
    name: string;
    description: string | null;
    avatar_url: string | null;
    qa_who: string;
    is_published: boolean;
  } | null;
  skills: Array<{
    id: string;
    name: string;
    description: string;
    is_active: boolean;
  }>;
  mcp_token: string;
}

export async function activateDesktop(code: string): Promise<BootstrapData> {
  const res = await fetch(`${API_URL}/api/v1/desktop/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail || `Activation failed: ${res.status}`;
    throw new Error(detail);
  }

  return res.json();
}

export async function fetchBootstrapByToken(
  token: string
): Promise<BootstrapData> {
  const res = await fetch(`${API_URL}/api/v1/desktop/bootstrap-by-token`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Bootstrap failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
