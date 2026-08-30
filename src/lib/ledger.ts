import { seedState } from '../data/seed';
import type { ActivityEntry, LedgerAction, LedgerState, Proposal } from '../types';

const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

function activity(action: string, detail: string, actor: 'agent' | 'human'): ActivityEntry {
  return { id: uid('activity'), action, detail, actor, createdAt: now() };
}

export function simpleDigest(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}

export function createProposal(title = 'Untitled brick'): Proposal {
  return {
    id: uid('brick'),
    title,
    intent: 'Describe the smallest useful outcome.',
    scope: 'State exactly what changes and what remains untouched.',
    successSignal: 'Define the evidence a reviewer should expect.',
    status: 'proposed',
    proposedAt: now(),
    proposedBy: 'Actalume agent',
    receipts: []
  };
}

export function ledgerReducer(state: LedgerState, action: LedgerAction): LedgerState {
  switch (action.type) {
    case 'UPDATE_CONTRACT':
      return { ...state, contract: action.contract, revision: state.revision + 1, activity: [activity('Contract edited', 'A human updated the working boundary.', 'human'), ...state.activity] };
    case 'UPDATE_PROPOSAL':
      if (state.proposal.status === 'approved') return state;
      return { ...state, proposal: { ...action.proposal, status: 'proposed' }, revision: state.revision + 1, activity: [activity('Proposal edited', 'Scope changed; review status returned to proposed.', 'human'), ...state.activity] };
    case 'ADD_RECEIPT':
      if (state.proposal.status === 'approved') return state;
      return { ...state, proposal: { ...state.proposal, receipts: [...state.proposal.receipts, action.receipt] }, revision: state.revision + 1, activity: [activity('Evidence attached', action.receipt.label, action.actor ?? 'human'), ...state.activity] };
    case 'REQUEST_REVIEW':
      if (!state.proposal.title.trim() || !state.proposal.receipts.length || state.proposal.status === 'approved') return state;
      return { ...state, proposal: { ...state.proposal, status: 'awaiting_review' }, revision: state.revision + 1, activity: [activity('Review requested', `${state.proposal.title} is waiting for a human decision.`, action.actor ?? 'agent'), ...state.activity] };
    case 'APPROVE': {
      if (state.proposal.status !== 'awaiting_review' || !state.proposal.receipts.length || !action.approvedBy.trim()) return state;
      const approvedAt = now();
      const entry = {
        id: uid('history'),
        proposalId: state.proposal.id,
        title: state.proposal.title,
        summary: state.proposal.intent,
        approvedAt,
        approvedBy: action.approvedBy.trim(),
        receiptCount: state.proposal.receipts.length,
        digest: simpleDigest(JSON.stringify({ proposal: state.proposal, approvedAt, approvedBy: action.approvedBy.trim() }))
      };
      return { ...state, proposal: { ...state.proposal, status: 'approved' }, history: [entry, ...state.history], revision: state.revision + 1, activity: [activity('Brick approved', `${entry.title} entered canonical history.`, 'human'), ...state.activity] };
    }
    case 'REJECT':
      if (state.proposal.status !== 'awaiting_review' || !action.reason.trim()) return state;
      return { ...state, proposal: { ...state.proposal, status: 'rejected' }, revision: state.revision + 1, activity: [activity('Brick returned', action.reason.trim(), 'human'), ...state.activity] };
    case 'NEW_BRICK':
      if (state.proposal.status !== 'approved' && state.proposal.status !== 'rejected') return state;
      return { ...state, proposal: action.proposal, revision: state.revision + 1, activity: [activity('New brick opened', action.proposal.title, 'human'), ...state.activity] };
    case 'IMPORT':
      return { ...action.state, revision: action.state.revision + 1, activity: [activity('Ledger imported', 'A local ledger snapshot replaced the current demo.', 'human'), ...action.state.activity] };
    case 'RESET':
      return structuredClone(seedState);
    default:
      return state;
  }
}

export function isLedgerState(value: unknown): value is LedgerState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<LedgerState>;
  return Boolean(candidate.contract?.projectName && candidate.proposal?.id && Array.isArray(candidate.history) && Array.isArray(candidate.activity));
}
