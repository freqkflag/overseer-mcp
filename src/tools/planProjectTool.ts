import type { ToolDefinition } from '../core/types.js';

export interface PlanProjectInput {
  /** High level goal or problem statement. */
  goal: string;
  /** Optional time horizon in weeks. */
  timelineWeeks?: number;
  /** Optional list of notable constraints the overseer should respect. */
  constraints?: string[];
  /** Optional deliverables that should be produced by the project. */
  deliverables?: string[];
}

export interface PlanProjectStep {
  title: string;
  summary: string;
  owners: string[];
}

export interface PlanProjectPhase {
  name: string;
  objective: string;
  steps: PlanProjectStep[];
}

export interface PlanProjectOutput {
  goal: string;
  horizonWeeks: number | null;
  constraints: string[];
  deliverables: string[];
  phases: PlanProjectPhase[];
}

const DEFAULT_PHASES: PlanProjectPhase[] = [
  {
    name: 'Discovery',
    objective: 'Clarify scope, stakeholders, and success metrics.',
    steps: [
      {
        title: 'Stakeholder interviews',
        summary: 'Identify key stakeholders and gather the outcomes they need.',
        owners: ['strategy']
      },
      {
        title: 'Success metrics',
        summary: 'Define measurable indicators to track progress and completion.',
        owners: ['strategy', 'analytics']
      }
    ]
  },
  {
    name: 'Design & Architecture',
    objective: 'Produce technical and operational blueprints for the Overseer.',
    steps: [
      {
        title: 'System design workshop',
        summary: 'Draft architecture diagrams for agents, orchestrator, and persistence.',
        owners: ['architecture']
      },
      {
        title: 'Implementation roadmap',
        summary: 'Break down deliverables into milestones and allocate engineering ownership.',
        owners: ['architecture', 'engineering']
      }
    ]
  },
  {
    name: 'Execution',
    objective: 'Build, test, and integrate the agreed upon deliverables.',
    steps: [
      {
        title: 'Implementation sprints',
        summary: 'Iterate through prioritized tasks with demos at the end of each sprint.',
        owners: ['engineering']
      },
      {
        title: 'Quality verification',
        summary: 'Run automated suites and manual reviews to confirm acceptance criteria.',
        owners: ['qa', 'engineering']
      }
    ]
  },
  {
    name: 'Launch & Feedback',
    objective: 'Release to target environment and capture learnings.',
    steps: [
      {
        title: 'Release planning',
        summary: 'Coordinate launch checklist, comms, and rollback strategy.',
        owners: ['ops', 'product']
      },
      {
        title: 'Post-launch retrospective',
        summary: 'Collect feedback, measure outcomes, and adjust backlog.',
        owners: ['product', 'strategy']
      }
    ]
  }
];

function createPlan(input: PlanProjectInput): PlanProjectOutput {
  const horizonWeeks = input.timelineWeeks ?? null;
  return {
    goal: input.goal,
    horizonWeeks,
    constraints: input.constraints ?? [],
    deliverables: input.deliverables ?? [],
    phases: DEFAULT_PHASES
  };
}

export const planProjectTool: ToolDefinition<PlanProjectInput, PlanProjectOutput> = {
  name: 'plan_project',
  description: 'Generate a structured cross-phase project plan for a multi-agent overseer.',
  inputSchema: {
    type: 'object',
    required: ['goal'],
    properties: {
      goal: {
        type: 'string',
        description: 'High level objective to orchestrate.'
      },
      timelineWeeks: {
        type: 'number',
        minimum: 0,
        description: 'Optional timeline horizon expressed in weeks.'
      },
      constraints: {
        type: 'array',
        items: { type: 'string' },
        description: 'Known constraints such as budget, compliance, or integrations.'
      },
      deliverables: {
        type: 'array',
        items: { type: 'string' },
        description: 'Outputs that the overseer must produce.'
      }
    }
  },
  async handler(input, context) {
    context.logger.log('plan_project invoked', {
      requestId: context.requestId,
      goal: input.goal
    });
    return createPlan(input);
  }
};

// TODO: Add specialized tools such as risk_analysis, assign_agents, and progress_report
// to expand the Overseer capabilities once the core transport is wired up.
