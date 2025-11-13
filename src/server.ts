import { randomUUID } from 'node:crypto';
import { planProjectTool } from './tools/planProjectTool.js';
import type { ToolDefinition, ToolContext } from './core/types.js';

type GenericTool = ToolDefinition<unknown, unknown>;

export interface OverseerServerOptions {
  /** Optional logger to override the default console logger. */
  logger?: Pick<Console, 'log' | 'warn' | 'error'>;
}

/**
 * OverseerMcpServer holds tool registrations and exposes a lightweight
 * execution helper. Wire this up to the official MCP SDK when ready.
 */
export class OverseerMcpServer {
  private readonly tools = new Map<string, GenericTool>();
  private readonly logger: Pick<Console, 'log' | 'warn' | 'error'>;

  constructor(options: OverseerServerOptions = {}) {
    this.logger = options.logger ?? console;
    this.registerTool(planProjectTool);
  }

  /** Register a new tool. Existing tools with the same name will be replaced. */
  registerTool<Input, Output>(tool: ToolDefinition<Input, Output>): void {
    this.logger.log(`Registering tool: ${tool.name}`);
    this.tools.set(tool.name, tool as GenericTool);
  }

  /** List registered tools for introspection and documentation. */
  listTools(): GenericTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Execute a registered tool by name. In the real MCP integration this would
   * be triggered by Codex invoking the tool over the protocol transport.
   */
  async executeTool<TInput, TOutput>(name: string, input: TInput): Promise<TOutput> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    const context: ToolContext = {
      logger: this.logger,
      requestId: randomUUID(),
      receivedAt: new Date()
    };

    this.logger.log(`Executing tool: ${name}`, { requestId: context.requestId });
    const result = await tool.handler(input, context);
    return result as TOutput;
  }

  /**
   * Placeholder start routine. Replace with @modelcontextprotocol/sdk wiring
   * once the transport layer is ready.
   */
  async start(): Promise<void> {
    this.logger.log('Overseer MCP server starting...');
    this.logger.log('TODO: integrate with @modelcontextprotocol/sdk Server.start');
  }
}

export function createServer(options: OverseerServerOptions = {}): OverseerMcpServer {
  return new OverseerMcpServer(options);
}
