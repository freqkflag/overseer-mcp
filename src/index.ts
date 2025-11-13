import { createServer } from './server.js';

async function main(): Promise<void> {
  const server = createServer();
  await server.start();

  // TODO: expose server.executeTool via MCP transport once wired up.
  const tools = server.listTools().map((tool) => tool.name).join(', ');
  console.log(`Overseer MCP server bootstrapped with tools: ${tools}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Failed to start Overseer MCP server', error);
    process.exit(1);
  });
}
