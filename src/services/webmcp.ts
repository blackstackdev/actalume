import { createProposal } from '../lib/ledger';
import type { LedgerAction, LedgerState, Receipt, ReceiptKind } from '../types';

interface ToolResult { content: Array<{ type: 'text'; text: string }> }
interface ToolDefinition {
  name: string;
  title?: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (args: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
}

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: ToolDefinition, options?: { signal?: AbortSignal }) => Promise<void>;
    };
  }
  interface Window {
    ledgerDemoTools?: Record<string, (args?: Record<string, unknown>) => Promise<ToolResult>>;
  }
}

const result = (payload: unknown): ToolResult => ({ content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] });
const requiredString = (args: Record<string, unknown>, key: string) => {
  const value = args[key];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${key} must be a non-empty string`);
  return value.trim();
};

export function createLedgerTools(getState: () => LedgerState, dispatch: React.Dispatch<LedgerAction>): ToolDefinition[] {
  return [
    {
      name: 'list_projects', title: 'List Actalume projects', description: 'List the public-safe projects visible in this local Actalume Agent Work Ledger.',
      annotations: { readOnlyHint: true },
      execute: () => result([{ id: 'fieldnote-launch', name: getState().contract.projectName, activeProposal: getState().proposal.title, status: getState().proposal.status }])
    },
    {
      name: 'inspect_project_contract', title: 'Inspect project contract', description: 'Read the project purpose, public-data boundary, agent permissions and completion rule.',
      annotations: { readOnlyHint: true },
      execute: () => result(getState().contract)
    },
    {
      name: 'propose_brick', title: 'Propose a bounded brick', description: 'Create a proposed unit of work. This never approves, publishes or changes canonical history.',
      inputSchema: { type: 'object', properties: { title: { type: 'string' }, intent: { type: 'string' }, scope: { type: 'string' }, successSignal: { type: 'string' } }, required: ['title', 'intent', 'scope', 'successSignal'], additionalProperties: false },
      execute: (args) => {
        const current = getState();
        if (!['approved', 'rejected'].includes(current.proposal.status)) return result({ ok: false, reason: 'The current brick must be decided before a new one can be opened.' });
        const proposal = { ...createProposal(requiredString(args, 'title')), intent: requiredString(args, 'intent'), scope: requiredString(args, 'scope'), successSignal: requiredString(args, 'successSignal') };
        dispatch({ type: 'NEW_BRICK', proposal });
        return result({ ok: true, proposal, next: 'Attach at least one evidence receipt, then request human review.' });
      }
    },
    {
      name: 'submit_evidence', title: 'Submit evidence receipt', description: 'Attach a public-safe evidence receipt to the active proposal. Evidence is visible to the human reviewer.',
      inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: ['test', 'source', 'artifact', 'note'] }, label: { type: 'string' }, detail: { type: 'string' } }, required: ['kind', 'label', 'detail'], additionalProperties: false },
      execute: (args) => {
        if (getState().proposal.status === 'approved') return result({ ok: false, reason: 'Approved bricks are immutable.' });
        const receipt: Receipt = { id: `receipt-${Date.now()}`, kind: requiredString(args, 'kind') as ReceiptKind, label: requiredString(args, 'label'), detail: requiredString(args, 'detail'), createdAt: new Date().toISOString(), actor: 'agent' };
        dispatch({ type: 'ADD_RECEIPT', receipt, actor: 'agent' });
        return result({ ok: true, receipt, note: 'Attached as evidence only; this is not approval.' });
      }
    },
    {
      name: 'request_status_change', title: 'Request human review', description: 'Ask the human to review the active proposal. The agent cannot approve, reject or write canonical history.',
      inputSchema: { type: 'object', properties: { requestedStatus: { type: 'string', enum: ['awaiting_review'] } }, required: ['requestedStatus'], additionalProperties: false },
      execute: (args) => {
        if (args.requestedStatus !== 'awaiting_review') return result({ ok: false, reason: 'Agents may only request awaiting_review. Approval and rejection are human-only.' });
        const state = getState();
        if (!state.proposal.receipts.length) return result({ ok: false, reason: 'Attach at least one receipt before requesting review.' });
        dispatch({ type: 'REQUEST_REVIEW', actor: 'agent' });
        return result({ ok: true, status: 'awaiting_review', next: 'A named human must inspect the evidence and decide.' });
      }
    },
    {
      name: 'inspect_audit_history', title: 'Inspect canonical history', description: 'Read immutable human-approved history entries and their evidence counts.',
      annotations: { readOnlyHint: true },
      execute: () => result(getState().history)
    }
  ];
}

export async function registerWebMcpTools(tools: ToolDefinition[]): Promise<{ available: boolean; count: number; error?: string; cleanup: () => void }> {
  const controller = new AbortController();
  window.ledgerDemoTools = Object.fromEntries(tools.map((tool) => [tool.name, async (args = {}) => tool.execute(args)]));
  if (!document.modelContext?.registerTool) return { available: false, count: 0, cleanup: () => { delete window.ledgerDemoTools; } };
  try {
    await Promise.all(tools.map((tool) => document.modelContext!.registerTool(tool, { signal: controller.signal })));
    return { available: true, count: tools.length, cleanup: () => { controller.abort(); delete window.ledgerDemoTools; } };
  } catch (error) {
    controller.abort();
    return { available: true, count: 0, error: error instanceof Error ? error.message : 'Tool registration failed', cleanup: () => { delete window.ledgerDemoTools; } };
  }
}
