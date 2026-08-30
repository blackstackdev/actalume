import type { LedgerState } from '../types';

export const STORAGE_KEY = 'agent-work-ledger:v3';

export const seedState: LedgerState = {
  contract: {
    projectName: 'Fieldnote launch',
    purpose: 'Ship a calm public page that explains Fieldnote in under one minute.',
    publicBoundary: 'Fictional copy and local demo data only. No accounts, messages, publishing or customer information.',
    agentMay: ['Draft one bounded page section', 'Attach local proof receipts', 'Request a human decision'],
    agentMustNot: ['Approve its own work', 'Publish or connect accounts', 'Claim proof that is not attached'],
    completionRule: 'A human approves the brick after reviewing its scope and evidence.'
  },
  proposal: {
    id: 'brick-003',
    title: 'Clarify the launch promise',
    intent: 'Replace the vague hero sentence with one outcome a visitor can repeat.',
    scope: 'Copy only: headline, subhead and one supporting proof line. No layout or deployment changes.',
    successSignal: 'Five-second comprehension check passes and every claim maps to a receipt.',
    status: 'awaiting_review',
    proposedAt: '2026-08-26T08:42:00+02:00',
    proposedBy: 'Fieldnote agent',
    receipts: [
      {
        id: 'receipt-101',
        kind: 'artifact',
        label: 'Revised launch copy',
        detail: 'Headline and supporting copy are captured as a local, reviewable artifact.',
        createdAt: '2026-08-26T08:49:00+02:00',
        actor: 'agent'
      },
      {
        id: 'receipt-102',
        kind: 'test',
        label: 'Comprehension check · 5/5',
        detail: 'Five fictional test responses identified the same outcome without additional context.',
        createdAt: '2026-08-26T08:55:00+02:00',
        actor: 'agent'
      },
      {
        id: 'receipt-103',
        kind: 'source',
        label: 'Claim map · 3 linked',
        detail: 'Each public-facing claim is linked to a local source note; no external customer data is present.',
        createdAt: '2026-08-26T09:01:00+02:00',
        actor: 'agent'
      }
    ]
  },
  history: [
    {
      id: 'history-002',
      proposalId: 'brick-002',
      title: 'Define the public boundary',
      summary: 'Documented what the agent may inspect and what remains human-only.',
      approvedAt: '2026-08-25T17:24:00+02:00',
      approvedBy: 'Morgan Lee',
      receiptCount: 2,
      digest: '7B2C-19A0'
    },
    {
      id: 'history-001',
      proposalId: 'brick-001',
      title: 'Choose one launch outcome',
      summary: 'Reduced the page goal to a single visitor outcome.',
      approvedAt: '2026-08-25T15:10:00+02:00',
      approvedBy: 'Morgan Lee',
      receiptCount: 1,
      digest: '10F4-A7C1'
    }
  ],
  activity: [
    { id: 'act-3', action: 'Review requested', detail: 'Brick 003 is waiting for a human decision.', actor: 'agent', createdAt: '2026-08-26T09:03:00+02:00' },
    { id: 'act-2', action: 'Evidence attached', detail: 'Three receipts now support the proposal.', actor: 'agent', createdAt: '2026-08-26T09:01:00+02:00' },
    { id: 'act-1', action: 'Brick proposed', detail: 'Scope fixed to copy only.', actor: 'agent', createdAt: '2026-08-26T08:42:00+02:00' }
  ],
  revision: 3
};
