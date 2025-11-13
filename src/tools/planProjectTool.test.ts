import { describe, expect, it } from 'vitest';
import { planProjectTool } from './planProjectTool.js';
import type { PlanProjectInput } from './planProjectTool.js';
import type { ToolContext } from '../core/types.js';

describe('planProjectTool', () => {
  const baseContext: ToolContext = {
    logger: console,
    requestId: 'test-request',
    receivedAt: new Date('2024-01-01T00:00:00.000Z')
  };

  it('returns a plan with default phases and metadata', async () => {
    const input: PlanProjectInput = {
      goal: 'Launch Overseer MCP server',
      constraints: ['Must pass automated tests'],
      deliverables: ['Operational MCP endpoint'],
      timelineWeeks: 6
    };

    const result = await planProjectTool.handler(input, baseContext);
    expect(result.goal).toBe(input.goal);
    expect(result.horizonWeeks).toBe(6);
    expect(result.constraints).toContain('Must pass automated tests');
    expect(result.deliverables).toContain('Operational MCP endpoint');
    expect(result.phases.length).toBeGreaterThan(0);
    expect(result.phases[0].steps.length).toBeGreaterThan(0);
  });

  it('falls back to defaults when optional fields are omitted', async () => {
    const input: PlanProjectInput = {
      goal: 'Draft minimal viable plan'
    };

    const result = await planProjectTool.handler(input, baseContext);
    expect(result.horizonWeeks).toBeNull();
    expect(result.constraints).toEqual([]);
    expect(result.deliverables).toEqual([]);
  });
});
