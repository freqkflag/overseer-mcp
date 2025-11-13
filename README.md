# overseer-mcp

Overseer MCP is a scaffolded [Model Context Protocol](https://modelcontextprotocol.io/) server implemented with Node.js and TypeScript. It is designed to act as a multi-agent overseer for Codex projects, coordinating planning tools and surfacing TODOs for future expansion.

## Features

- TypeScript-first project layout with `src/` entry point and build configuration.
- Lightweight server wrapper that registers tools and exposes execution helpers.
- Example `plan_project` tool that returns a cross-phase implementation roadmap.
- Vitest test harness with starter coverage for the included tool.
- ESLint + Prettier configuration for consistent formatting.

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

This boots the scaffolded server and logs the registered tools. The actual MCP transport wiring is left as a TODO once integration with `@modelcontextprotocol/sdk` is ready.

### Execute the example tool manually

You can exercise the tool handlers directly from a REPL or temporary script:

```bash
node --loader ts-node/esm -e "import('src/server.ts').then(async ({ createServer }) => { const server = createServer(); const result = await server.executeTool('plan_project', { goal: 'Example project' }); console.log(result); });"
```

## Testing

```bash
npm test
```

Vitest executes the TypeScript tests under `src/**/*.test.ts` and validates the example `plan_project` tool output.

## Project structure

```
.
├── src
│   ├── core
│   │   └── types.ts
│   ├── index.ts
│   ├── server.ts
│   └── tools
│       ├── planProjectTool.test.ts
│       └── planProjectTool.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Extending the Overseer

- Implement additional tools (e.g. `risk_analysis`, `assign_agents`, `progress_report`) inside `src/tools/` and register them via the server constructor.
- Replace the placeholder `start()` method in `src/server.ts` with the actual `@modelcontextprotocol/sdk` server wiring when ready.
- Add automation or infrastructure scripts under `scripts/` for deployment workflows.

## How Codex should use it

1. Launch the server (`npm run dev` or build + `npm start`).
2. Connect via the Model Context Protocol transport once the SDK integration is complete.
3. Invoke tools such as `plan_project` to bootstrap planning for new initiatives.
4. Expand with additional tools to cover risk management, agent assignment, and reporting.

## Runbook

### Run

```bash
npm run dev
```

### Test

```bash
npm test
```

### Deploy / migrate

1. Build the TypeScript output: `npm run build`
2. Deploy the contents of `dist/` to your runtime environment.
3. TODO: add MCP transport configuration as part of deployment once available.

### Rollback

1. Re-deploy the previous build artifacts (e.g. the last known good `dist/`).
2. Revert to the prior git tag or commit if necessary.
