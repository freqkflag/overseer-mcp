export interface ToolContext {
  /** Unique identifier for the request being processed. */
  requestId: string;
  /** Timestamp the request was received. */
  receivedAt: Date;
  /** Simple logger surface that tools can leverage. */
  logger: Pick<Console, 'log' | 'warn' | 'error'>;
}

export interface ToolDefinition<Input, Output> {
  /** Machine-readable name that the MCP runtime exposes. */
  name: string;
  /** Short description that helps Codex understand the tool's purpose. */
  description: string;
  /** JSON schema fragment describing the expected input payload. */
  inputSchema: object;
  /** Handler invoked when the tool is executed. */
  handler: (input: Input, context: ToolContext) => Promise<Output> | Output;
}
