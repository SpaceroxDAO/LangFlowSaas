/**
 * Teach Charlie API client for the TC Connector.
 *
 * Communicates with the MCP Bridge endpoints on the Teach Charlie backend.
 */

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  _workflow_id?: string;
}

export interface MCPContentBlock {
  type: string;
  text: string;
}

export interface MCPToolResult {
  content: MCPContentBlock[];
  isError: boolean;
}

export class TeachCharlieClient {
  private apiUrl: string;
  private token: string;

  constructor(apiUrl: string, token: string) {
    this.apiUrl = apiUrl.replace(/\/$/, "");
    this.token = token;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Fetch all skill-enabled workflows as MCP tools.
   */
  async listTools(): Promise<MCPTool[]> {
    const url = `${this.apiUrl}/api/v1/mcp/bridge/tools`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to list tools (HTTP ${response.status}): ${text}`
      );
    }

    const data = (await response.json()) as { tools: MCPTool[] };
    return data.tools;
  }

  /**
   * Execute a tool call by routing to the correct workflow.
   */
  async callTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<MCPToolResult> {
    const url = `${this.apiUrl}/api/v1/mcp/bridge/tools/call`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name,
        arguments: args,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        content: [
          {
            type: "text",
            text: `API error (HTTP ${response.status}): ${text}`,
          },
        ],
        isError: true,
      };
    }

    return (await response.json()) as MCPToolResult;
  }

  /**
   * Verify the token is valid by attempting to list tools.
   */
  async verify(): Promise<boolean> {
    try {
      await this.listTools();
      return true;
    } catch {
      return false;
    }
  }
}
