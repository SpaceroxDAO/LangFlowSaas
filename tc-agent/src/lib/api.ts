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

export async function fetchBootstrap(
  clerkToken: string
): Promise<BootstrapData> {
  const res = await fetch(`${API_URL}/api/v1/desktop/bootstrap`, {
    headers: {
      Authorization: `Bearer ${clerkToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Bootstrap failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
